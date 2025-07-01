// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Interface for KYC contract
interface IKYCPlatform {
    enum UserType { Individual, Business }
    enum BusinessStatus { Pending, Verified, Rejected }
    
    struct KYCData {
        uint256 kycId;
        address userAddress;
        string fullName;
        string email;
        string phoneNumber;
        string residenceAddress;
        string documentHash;
        UserType userType;
        uint8 status; // Using uint8 instead of enum for interface compatibility
        uint256 submissionTime;
        uint256 verificationTime;
        address verifiedBy;
    }

    struct BusinessListing {
        uint256 listingId;
        address applicant;
        string businessName;
        string businessDescription;
        string businessType; 
        string documentsHash;
        BusinessStatus status;
        uint256 submittedAt;
        uint256 verifiedAt;
        address verifiedBy;
        string rejectionReason;
    }
    
    function checkKYCStatus(address user) external view returns (bool);
    function getKYCDataForContract(address user) external view returns (KYCData memory);
    function getBusinessListingForContract(uint256 listingId) external view returns (BusinessListing memory);
}

// Custom errors
error NotAuthorizedVerifier();
error UserNotKYCVerified();
error TaxIdUsed();
error TaxIdRequired();
error InvalidAddress();
error NotTokenOwner();
error ResidencyNotActive();
error TokenNotExist();

/**
 * @title BhutanEResidencyNFT
 * @dev NFT-based digital residency system with marketplace functionality
 */
contract BhutanEResidencyNFT is ERC721, Ownable, ReentrancyGuard, Pausable {
    // ================= State Variables =================
    uint256 private _tokenIdCounter;
    IKYCPlatform public kycContract;
    
    enum ResidencyType { Individual, Business, PremiumBusiness }
    
    struct ResidencyData {
        uint256 tokenId;
        address resident;
        ResidencyType residencyType;
        string taxId;
        string legalEntityName;
        uint256 issueDate;
        uint256 expiryDate;
        bool isActive;
        string documentsHash;
    }

    struct ResidencyNFTMetadata {
        string name;
        string description;
        string image;
        string[] attributes;
    }

    // Mappings
    mapping(uint256 => ResidencyData) public residencyData;
    mapping(address => uint256[]) public userResidencies;
    mapping(string => bool) public usedTaxIds;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => bool) public isTokenListedInMarketplace;
    mapping(address => bool) public authorizedMarketplaces;

    // Constants
    uint256 public constant RESIDENCY_VALIDITY_PERIOD = 365 days;

    // Events
    event ResidencyIssued(
        address indexed resident, 
        uint256 indexed tokenId, 
        ResidencyType residencyType,
        string taxId
    );
    event ResidencyNFTMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        string metadataURI,
        uint256 kycId
    );
    event BusinessNFTMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        uint256 businessListingId,
        string businessName
    );
    event ResidencyRenewed(uint256 indexed tokenId, uint256 newExpiryDate);
    event ResidencyRevoked(uint256 indexed tokenId);
    event TokenListedInMarketplace(uint256 indexed tokenId, address indexed marketplace);

    // Modifiers
    modifier onlyVerifiedUser(address user) {
        if (!kycContract.checkKYCStatus(user)) revert UserNotKYCVerified();
        _;
    }

    modifier onlyVerifiedUserSelf() {
        if (!kycContract.checkKYCStatus(msg.sender)) revert UserNotKYCVerified();
        _;
    }

    modifier onlyOwnerOrSelf() {
        require(msg.sender == owner() || msg.sender == address(this), "Not authorized");
        _;
    }

    constructor(address _kycContract) ERC721("Bhutan eResidency", "BHRES") Ownable(msg.sender) {
        require(_kycContract != address(0), "Invalid KYC contract address");
        kycContract = IKYCPlatform(_kycContract);
    }

    // ================= Contract Management =================
    function setKYCContract(address _kycContract) external onlyOwner {
        require(_kycContract != address(0), "Invalid KYC contract address");
        kycContract = IKYCPlatform(_kycContract);
    }

    function authorizeMarketplace(address marketplace) external onlyOwner {
        authorizedMarketplaces[marketplace] = true;
    }

    function revokeMarketplaceAuthorization(address marketplace) external onlyOwner {
        authorizedMarketplaces[marketplace] = false;
    }

    // ================= NFT Minting Functions =================
    function mintResidencyNFTFromKYC(address recipient, string memory tokenURI) external onlyOwner onlyVerifiedUser(recipient) whenNotPaused {
        _mintResidencyNFT(recipient, tokenURI);
    }

    function mintBusinessNFTFromListing(
        address recipient, 
        uint256 businessListingId, 
        string memory tokenURI
    ) external onlyOwner onlyVerifiedUser(recipient) whenNotPaused {
        IKYCPlatform.BusinessListing memory listing = kycContract.getBusinessListingForContract(businessListingId);
        require(listing.applicant == recipient, "Recipient mismatch");
        require(listing.status == IKYCPlatform.BusinessStatus.Verified, "Business not verified");
        
        _mintBusinessNFT(recipient, businessListingId, listing.businessName, tokenURI);
    }

    function _mintResidencyNFT(address recipient, string memory tokenURI) internal {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        
        IKYCPlatform.KYCData memory userData = kycContract.getKYCDataForContract(recipient);
        
        // Create basic residency data
        uint256 issueDate = block.timestamp;
        uint256 expiryDate = issueDate + RESIDENCY_VALIDITY_PERIOD;
        
        // Generate a unique tax ID based on KYC ID and timestamp
        string memory autoTaxId = string(abi.encodePacked("BT", 
            Strings.toString(userData.kycId), 
            Strings.toString(block.timestamp % 10000)));
        
        residencyData[newTokenId] = ResidencyData({
            tokenId: newTokenId,
            resident: recipient,
            residencyType: userData.userType == IKYCPlatform.UserType.Individual ? 
                ResidencyType.Individual : ResidencyType.Business,
            taxId: autoTaxId,
            legalEntityName: userData.userType == IKYCPlatform.UserType.Business ? 
                userData.fullName : "",
            issueDate: issueDate,
            expiryDate: expiryDate,
            isActive: true,
            documentsHash: userData.documentHash
        });
        
        usedTaxIds[autoTaxId] = true;
        userResidencies[recipient].push(newTokenId);
        
        _safeMint(recipient, newTokenId);
        
        // Set the token URI
        if (bytes(tokenURI).length > 0) {
            setTokenURI(newTokenId, tokenURI);
        }
        
        emit ResidencyNFTMinted(recipient, newTokenId, tokenURI, userData.kycId);
        emit ResidencyIssued(recipient, newTokenId, 
            userData.userType == IKYCPlatform.UserType.Individual ? 
                ResidencyType.Individual : ResidencyType.Business, 
            autoTaxId);
    }

    function _mintBusinessNFT(
        address recipient, 
        uint256 businessListingId, 
        string memory businessName, 
        string memory tokenURI
    ) internal {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        
        IKYCPlatform.BusinessListing memory businessData = kycContract.getBusinessListingForContract(businessListingId);
        
        // Create business residency data
        uint256 issueDate = block.timestamp;
        uint256 expiryDate = issueDate + RESIDENCY_VALIDITY_PERIOD;
        
        // Generate a unique tax ID for the business
        string memory businessTaxId = string(abi.encodePacked("BT-BIZ-", 
            Strings.toString(businessListingId), 
            "-", 
            Strings.toString(block.timestamp % 10000)));
        
        residencyData[newTokenId] = ResidencyData({
            tokenId: newTokenId,
            resident: recipient,
            residencyType: ResidencyType.Business,
            taxId: businessTaxId,
            legalEntityName: businessName,
            issueDate: issueDate,
            expiryDate: expiryDate,
            isActive: true,
            documentsHash: businessData.documentsHash
        });
        
        usedTaxIds[businessTaxId] = true;
        userResidencies[recipient].push(newTokenId);
        
        _safeMint(recipient, newTokenId);
        
        // Set the token URI if provided
        if (bytes(tokenURI).length > 0) {
            setTokenURI(newTokenId, tokenURI);
        }
        
        emit BusinessNFTMinted(recipient, newTokenId, businessListingId, businessName);
        emit ResidencyIssued(recipient, newTokenId, ResidencyType.Business, businessTaxId);
    }

    // ================= Residency Management =================
    function issueResidency(
        address recipient,
        ResidencyType _residencyType,
        string memory _taxId,
        string memory _legalEntityName,
        string memory _documentsHash,
        string memory tokenURI
    ) public onlyVerifiedUser(recipient) onlyOwnerOrSelf returns (uint256) {
        if (usedTaxIds[_taxId]) revert TaxIdUsed();
        if (bytes(_taxId).length == 0) revert TaxIdRequired();
        
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        uint256 issueDate = block.timestamp;
        uint256 expiryDate = issueDate + RESIDENCY_VALIDITY_PERIOD;
        
        residencyData[newTokenId] = ResidencyData({
            tokenId: newTokenId,
            resident: recipient,
            residencyType: _residencyType,
            taxId: _taxId,
            legalEntityName: _legalEntityName,
            issueDate: issueDate,
            expiryDate: expiryDate,
            isActive: true,
            documentsHash: _documentsHash
        });
        
        usedTaxIds[_taxId] = true;
        userResidencies[recipient].push(newTokenId);
        
        _safeMint(recipient, newTokenId);
        
        if (bytes(tokenURI).length > 0) {
            setTokenURI(newTokenId, tokenURI);
        }
        
        emit ResidencyIssued(recipient, newTokenId, _residencyType, _taxId);
        return newTokenId;
    }

    function renewResidency(uint256 tokenId) external payable nonReentrant {
        if (ownerOf(tokenId) == address(0)) revert TokenNotExist();
        if (ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        if (!residencyData[tokenId].isActive) revert ResidencyNotActive();
        
        uint256 newExpiryDate = residencyData[tokenId].expiryDate + RESIDENCY_VALIDITY_PERIOD;
        residencyData[tokenId].expiryDate = newExpiryDate;
        
        emit ResidencyRenewed(tokenId, newExpiryDate);
    }

    function revokeResidency(uint256 tokenId) external onlyOwner {
        if (ownerOf(tokenId) == address(0)) revert TokenNotExist();
        if (!residencyData[tokenId].isActive) revert ResidencyNotActive();
        
        residencyData[tokenId].isActive = false;
        emit ResidencyRevoked(tokenId);
    }

    // ================= Marketplace Integration =================
    function setTokenMarketplaceListing(uint256 tokenId, bool isListed, address marketplaceContract) external {
        require(
            authorizedMarketplaces[marketplaceContract] || msg.sender == owner(), 
            "Not authorized marketplace"
        );
        
        isTokenListedInMarketplace[tokenId] = isListed;
        if (isListed) {
            emit TokenListedInMarketplace(tokenId, marketplaceContract);
        }
    }

    // ================= Token URI Management =================
    function setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function setNFTTokenURI(uint256 tokenId, string memory _tokenURI) external onlyOwner {
        if (ownerOf(tokenId) == address(0)) revert TokenNotExist();
        setTokenURI(tokenId, _tokenURI);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (ownerOf(tokenId) == address(0)) revert TokenNotExist();
        
        string memory _tokenURI = _tokenURIs[tokenId];
        return bytes(_tokenURI).length > 0 ? _tokenURI : "";
    }

    // ================= View Functions =================
    function isResidencyValid(uint256 tokenId) external view returns (bool) {
        return ownerOf(tokenId) != address(0) && 
               residencyData[tokenId].isActive && 
               block.timestamp <= residencyData[tokenId].expiryDate;
    }

    function getUserResidencies(address user) external view returns (uint256[] memory) {
        return userResidencies[user];
    }

    function getUserOwnedTokens(address user) external view returns (uint256[] memory) {
        uint256[] memory allUserTokens = userResidencies[user];
        uint256 count = 0;
        
        // Count owned tokens
        for (uint256 i = 0; i < allUserTokens.length; i++) {
            if (ownerOf(allUserTokens[i]) == user) {
                count++;
            }
        }
        
        uint256[] memory ownedTokens = new uint256[](count);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < allUserTokens.length; i++) {
            if (ownerOf(allUserTokens[i]) == user) {
                ownedTokens[currentIndex] = allUserTokens[i];
                currentIndex++;
            }
        }
        
        return ownedTokens;
    }

    function getResidencyData(uint256 tokenId) external view returns (ResidencyData memory) {
        if (ownerOf(tokenId) == address(0)) revert TokenNotExist();
        return residencyData[tokenId];
    }

    function hasBusinessResidency(address user) external view returns (bool) {
        uint256[] memory userTokens = userResidencies[user];
        for (uint256 i = 0; i < userTokens.length; i++) {
            ResidencyData memory residency = residencyData[userTokens[i]];
            if (residency.residencyType == ResidencyType.Business && 
                residency.isActive && 
                block.timestamp <= residency.expiryDate) {
                return true;
            }
        }
        return false;
    }

    function getUserBusinessResidencies(address user) external view returns (uint256[] memory) {
        uint256[] memory allTokens = userResidencies[user];
        uint256 businessCount = 0;
        
        // Count business residencies
        for (uint256 i = 0; i < allTokens.length; i++) {
            ResidencyData memory residency = residencyData[allTokens[i]];
            if (residency.residencyType == ResidencyType.Business) {
                businessCount++;
            }
        }
        
        // Create array of business residencies
        uint256[] memory businessResidencies = new uint256[](businessCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < allTokens.length; i++) {
            ResidencyData memory residency = residencyData[allTokens[i]];
            if (residency.residencyType == ResidencyType.Business) {
                businessResidencies[currentIndex] = allTokens[i];
                currentIndex++;
            }
        }
        
        return businessResidencies;
    }

    // ================= Admin Functions =================
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // ================= Integration Functions =================
    // Functions to integrate with the KYC contract for seamless operation
    function mintResidencyForVerifiedKYC(address user, string memory tokenURI) external {
        require(msg.sender == address(kycContract) || msg.sender == owner(), "Only KYC contract or owner");
        require(kycContract.checkKYCStatus(user), "User not KYC verified");
        
        _mintResidencyNFT(user, tokenURI);
    }

    function mintBusinessResidencyForVerifiedListing(
        address user, 
        uint256 businessListingId, 
        string memory tokenURI
    ) external {
        require(msg.sender == address(kycContract) || msg.sender == owner(), "Only KYC contract or owner");
        require(kycContract.checkKYCStatus(user), "User not KYC verified");
        
        IKYCPlatform.BusinessListing memory listing = kycContract.getBusinessListingForContract(businessListingId);
        require(listing.applicant == user, "User mismatch");
        require(listing.status == IKYCPlatform.BusinessStatus.Verified, "Business not verified");
        
        _mintBusinessNFT(user, businessListingId, listing.businessName, tokenURI);
    }
}