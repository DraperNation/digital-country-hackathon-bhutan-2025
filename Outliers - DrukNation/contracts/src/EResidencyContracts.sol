// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title BhutanEResidencyPlatform
 * @dev Complete eResidency system with KYC, P2P marketplace, and NFT-based digital residency
 */

// ============================================================================
// KYC VERIFICATION CONTRACT
// ============================================================================

contract KYCVerification is Ownable, Pausable {
    uint256 private _kycIdCounter;

    constructor() Ownable(msg.sender) {}

    enum KYCStatus { Pending, Verified, Rejected, Suspended }
    enum UserType { Individual, Business }

    struct KYCData {
        uint256 kycId;
        address userAddress;
        string fullName;
        string email;
        string phoneNumber;
        string residenceAddress;
        string documentHash; // IPFS hash of uploaded documents
        UserType userType;
        KYCStatus status;
        uint256 submissionTime;
        uint256 verificationTime;
        address verifiedBy;
    }

    mapping(address => KYCData) public kycRecords;
    mapping(uint256 => address) public kycIdToAddress;
    mapping(address => bool) public kycVerifiers;
    
    event KYCSubmitted(address indexed user, uint256 kycId, UserType userType);
    event KYCVerified(address indexed user, uint256 kycId, address verifiedBy);
    event KYCRejected(address indexed user, uint256 kycId, string reason);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);

    modifier onlyVerifier() {
        require(kycVerifiers[msg.sender] || msg.sender == owner(), "Not authorized verifier");
        _;
    }

    modifier onlyVerifiedUser(address user) {
        require(kycRecords[user].status == KYCStatus.Verified, "User not KYC verified");
        _;
    }

    function addVerifier(address verifier) external onlyOwner {
        kycVerifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }

    function removeVerifier(address verifier) external onlyOwner {
        kycVerifiers[verifier] = false;
        emit VerifierRemoved(verifier);
    }

    function submitKYC(
        string memory _fullName,
        string memory _email,
        string memory _phoneNumber,
        string memory _residenceAddress,
        string memory _documentHash,
        UserType _userType
    ) external whenNotPaused {
        require(bytes(_fullName).length > 0, "Full name required");
        require(bytes(_email).length > 0, "Email required");
        require(bytes(_phoneNumber).length > 0, "Phone number required");
        require(bytes(_residenceAddress).length > 0, "Address required");
        require(bytes(_documentHash).length > 0, "Document hash required");
        require(kycRecords[msg.sender].kycId == 0, "KYC already submitted");

        _kycIdCounter++;
        uint256 newKycId = _kycIdCounter;

        kycRecords[msg.sender] = KYCData({
            kycId: newKycId,
            userAddress: msg.sender,
            fullName: _fullName,
            email: _email,
            phoneNumber: _phoneNumber,
            residenceAddress: _residenceAddress,
            documentHash: _documentHash,
            userType: _userType,
            status: KYCStatus.Pending,
            submissionTime: block.timestamp,
            verificationTime: 0,
            verifiedBy: address(0)
        });

        kycIdToAddress[newKycId] = msg.sender;
        emit KYCSubmitted(msg.sender, newKycId, _userType);
    }

    function verifyKYC(address user) external onlyVerifier whenNotPaused {
        require(kycRecords[user].kycId != 0, "KYC not submitted");
        require(kycRecords[user].status == KYCStatus.Pending, "KYC not pending");

        kycRecords[user].status = KYCStatus.Verified;
        kycRecords[user].verificationTime = block.timestamp;
        kycRecords[user].verifiedBy = msg.sender;

        emit KYCVerified(user, kycRecords[user].kycId, msg.sender);
    }

    function rejectKYC(address user, string memory reason) external onlyVerifier whenNotPaused {
        require(kycRecords[user].kycId != 0, "KYC not submitted");
        require(kycRecords[user].status == KYCStatus.Pending, "KYC not pending");

        kycRecords[user].status = KYCStatus.Rejected;
        emit KYCRejected(user, kycRecords[user].kycId, reason);
    }

    function isKYCVerified(address user) external view returns (bool) {
        return kycRecords[user].status == KYCStatus.Verified;
    }

    function getKYCData(address user) external view returns (KYCData memory) {
        return kycRecords[user];
    }
}

// ============================================================================
// ERESIDENCY NFT CONTRACT
// ============================================================================

contract BhutanEResidencyNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;

    enum ResidencyType { Individual, Business, PremiumBusiness }

    struct ResidencyData {
        uint256 tokenId;
        address resident;
        ResidencyType residencyType;
        string taxId;
        string legalEntityName; // For business residencies
        uint256 issueDate;
        uint256 expiryDate;
        bool isActive;
        string documentsHash; // IPFS hash of legal documents
    }

    KYCVerification public kycContract;
    mapping(uint256 => ResidencyData) public residencyData;
    mapping(address => uint256[]) public userResidencies;
    mapping(string => bool) public usedTaxIds;
    
    uint256 public constant RESIDENCY_VALIDITY_PERIOD = 365 days;
    
    event ResidencyIssued(
        address indexed resident, 
        uint256 indexed tokenId, 
        ResidencyType residencyType,
        string taxId
    );
    event ResidencyRenewed(uint256 indexed tokenId, uint256 newExpiryDate);
    event ResidencyRevoked(uint256 indexed tokenId);

    constructor(address _kycContract) ERC721("Bhutan eResidency", "BHRES") Ownable(msg.sender) {
        kycContract = KYCVerification(_kycContract);
    }

    modifier onlyVerifiedUser() {
        require(kycContract.isKYCVerified(msg.sender), "User not KYC verified");
        _;
    }

    function issueResidency(
        address recipient,
        ResidencyType _residencyType,
        string memory _taxId,
        string memory _legalEntityName,
        string memory _documentsHash,
        string memory tokenURI
    ) external onlyOwner returns (uint256) {
        require(kycContract.isKYCVerified(recipient), "Recipient not KYC verified");
        require(!usedTaxIds[_taxId], "Tax ID already used");
        require(bytes(_taxId).length > 0, "Tax ID required");

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
        _setTokenURI(newTokenId, tokenURI);

        emit ResidencyIssued(recipient, newTokenId, _residencyType, _taxId);
        return newTokenId;
    }

    function renewResidency(uint256 tokenId) external payable nonReentrant {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(residencyData[tokenId].isActive, "Residency not active");
        
        // Renewal fee logic can be implemented here
        
        uint256 newExpiryDate = residencyData[tokenId].expiryDate + RESIDENCY_VALIDITY_PERIOD;
        residencyData[tokenId].expiryDate = newExpiryDate;

        emit ResidencyRenewed(tokenId, newExpiryDate);
    }

    function revokeResidency(uint256 tokenId) external onlyOwner {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        require(residencyData[tokenId].isActive, "Already revoked");

        residencyData[tokenId].isActive = false;
        emit ResidencyRevoked(tokenId);
    }

    function isResidencyValid(uint256 tokenId) external view returns (bool) {
        return ownerOf(tokenId) != address(0) && 
               residencyData[tokenId].isActive && 
               block.timestamp <= residencyData[tokenId].expiryDate;
    }

    function getUserResidencies(address user) external view returns (uint256[] memory) {
        return userResidencies[user];
    }

    function getResidencyData(uint256 tokenId) external view returns (ResidencyData memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return residencyData[tokenId];
    }

    // Override required functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

// ============================================================================
// P2P MARKETPLACE CONTRACT
// ============================================================================

contract EResidencyMarketplace is ReentrancyGuard, Pausable, Ownable {
    uint256 private _listingIdCounter;

    enum ListingStatus { Active, Sold, Cancelled, Expired }

    struct Listing {
        uint256 listingId;
        address seller;
        BhutanEResidencyNFT.ResidencyType residencyType;
        uint256 price;
        string description;
        string documentsHash; // Additional documents/templates
        ListingStatus status;
        uint256 createdAt;
        uint256 expiresAt;
        address buyer;
        uint256 soldAt;
    }

struct EscrowData {
    uint256 listingId;
    address buyer;
    uint256 amount;       
    uint256 createdAt;
    bool isReleased;
    bool isRefunded;
}

    KYCVerification public kycContract;
    BhutanEResidencyNFT public residencyNFT;
    
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => EscrowData) public escrows;
    mapping(address => uint256[]) public sellerListings;
    mapping(address => uint256[]) public buyerPurchases;
    
    uint256 public constant LISTING_DURATION = 30 days;
    uint256 public constant ESCROW_TIMEOUT = 7 days;
    uint256 public platformFeePercentage = 250; // 2.5%
    uint256 public constant PERCENTAGE_BASE = 10000;
    
    address public feeRecipient;

    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        BhutanEResidencyNFT.ResidencyType residencyType,
        uint256 price
    );
    event PurchaseInitiated(uint256 indexed listingId, address indexed buyer, uint256 amount);
    event PurchaseCompleted(uint256 indexed listingId, address indexed buyer, uint256 tokenId);
    event ListingCancelled(uint256 indexed listingId);
    event EscrowReleased(uint256 indexed listingId, address indexed buyer);
    event EscrowRefunded(uint256 indexed listingId, address indexed buyer);

    modifier onlyVerifiedUser() {
        require(kycContract.isKYCVerified(msg.sender), "User not KYC verified");
        _;
    }

    modifier validListing(uint256 listingId) {
        require(listings[listingId].listingId != 0, "Listing does not exist");
        require(listings[listingId].status == ListingStatus.Active, "Listing not active");
        require(block.timestamp <= listings[listingId].expiresAt, "Listing expired");
        _;
    }

    constructor(
        address _kycContract,
        address _residencyNFT,
        address _feeRecipient
    ) Ownable(msg.sender) {
        kycContract = KYCVerification(_kycContract);
        residencyNFT = BhutanEResidencyNFT(_residencyNFT);
        feeRecipient = _feeRecipient;
    }

    function createListing(
        BhutanEResidencyNFT.ResidencyType _residencyType,
        uint256 _price,
        string memory _description,
        string memory _documentsHash
    ) external onlyVerifiedUser whenNotPaused returns (uint256) {
        require(_price > 0, "Price must be greater than 0");
        require(bytes(_description).length > 0, "Description required");

        _listingIdCounter++;
        uint256 newListingId = _listingIdCounter;

        listings[newListingId] = Listing({
            listingId: newListingId,
            seller: msg.sender,
            residencyType: _residencyType,
            price: _price,
            description: _description,
            documentsHash: _documentsHash,
            status: ListingStatus.Active,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + LISTING_DURATION,
            buyer: address(0),
            soldAt: 0
        });

        sellerListings[msg.sender].push(newListingId);

        emit ListingCreated(newListingId, msg.sender, _residencyType, _price);
        return newListingId;
    }

function purchaseResidency(
    uint256 listingId,
    string memory taxId,
    string memory legalEntityName,
    string memory tokenURI
) external payable onlyVerifiedUser validListing(listingId) nonReentrant whenNotPaused {
    Listing storage listing = listings[listingId];
    require(msg.sender != listing.seller, "Cannot buy own listing");
    require(msg.value >= listing.price, "Insufficient payment");

    // Create escrow with the listing price, not msg.value
    escrows[listingId] = EscrowData({
        listingId: listingId,
        buyer: msg.sender,
        amount: listing.price,  // Use listing.price instead of msg.value
        createdAt: block.timestamp,
        isReleased: false,
        isRefunded: false
    });

    // Update listing
    listing.status = ListingStatus.Sold;
    listing.buyer = msg.sender;
    listing.soldAt = block.timestamp;

    buyerPurchases[msg.sender].push(listingId);

    emit PurchaseInitiated(listingId, msg.sender, msg.value);

    // Issue residency NFT
    uint256 tokenId = residencyNFT.issueResidency(
        msg.sender,
        listing.residencyType,
        taxId,
        legalEntityName,
        listing.documentsHash,
        tokenURI
    );

    // Release escrow automatically upon successful NFT minting
    _releaseEscrow(listingId);

    emit PurchaseCompleted(listingId, msg.sender, tokenId);

    // Refund excess payment BEFORE escrow operations
    if (msg.value > listing.price) {
        payable(msg.sender).transfer(msg.value - listing.price);
    }
}

    function _releaseEscrow(uint256 listingId) internal {
        EscrowData storage escrow = escrows[listingId];
        require(!escrow.isReleased && !escrow.isRefunded, "Escrow already processed");

        escrow.isReleased = true;

        uint256 platformFee = (escrow.amount * platformFeePercentage) / PERCENTAGE_BASE;
        uint256 sellerAmount = escrow.amount - platformFee;

        address seller = listings[listingId].seller;

        // Transfer to seller
        payable(seller).transfer(sellerAmount);
        
        // Transfer platform fee
        payable(feeRecipient).transfer(platformFee);

        emit EscrowReleased(listingId, escrow.buyer);
    }

    function cancelListing(uint256 listingId) external validListing(listingId) {
        require(listings[listingId].seller == msg.sender, "Not listing seller");
        
        listings[listingId].status = ListingStatus.Cancelled;
        emit ListingCancelled(listingId);
    }

    function refundEscrow(uint256 listingId) external onlyOwner nonReentrant {
        EscrowData storage escrow = escrows[listingId];
        require(!escrow.isReleased && !escrow.isRefunded, "Escrow already processed");
        require(block.timestamp > escrow.createdAt + ESCROW_TIMEOUT, "Escrow timeout not reached");

        escrow.isRefunded = true;
        payable(escrow.buyer).transfer(escrow.amount);

        emit EscrowRefunded(listingId, escrow.buyer);
    }

    function getSellerListings(address seller) external view returns (uint256[] memory) {
        return sellerListings[seller];
    }

    function getBuyerPurchases(address buyer) external view returns (uint256[] memory) {
        return buyerPurchases[buyer];
    }

    function setPlatformFee(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 1000, "Fee too high"); // Max 10%
        platformFeePercentage = _feePercentage;
    }

    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "Invalid address");
        feeRecipient = _feeRecipient;
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

// ============================================================================
// DEPLOYMENT SCRIPT INTERFACE
// ============================================================================

contract EResidencyDeployer {
    KYCVerification public kycContract;
    BhutanEResidencyNFT public nftContract;
    EResidencyMarketplace public marketplaceContract;

    event ContractsDeployed(
        address kycContract,
        address nftContract,
        address marketplaceContract
    );

    function deployAll(address feeRecipient) external {
        // Deploy KYC contract
        kycContract = new KYCVerification();
        
        // Deploy NFT contract
        nftContract = new BhutanEResidencyNFT(address(kycContract));
        
        // Deploy marketplace contract
        marketplaceContract = new EResidencyMarketplace(
            address(kycContract),
            address(nftContract),
            feeRecipient
        );

        // Transfer ownership of NFT contract to marketplace for minting
        nftContract.transferOwnership(address(marketplaceContract));

        emit ContractsDeployed(
            address(kycContract),
            address(nftContract),
            address(marketplaceContract)
        );
    }
}