// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Interface for KYC Platform
interface IKYCPlatform {
    enum UserType { Individual, Business }
    enum KYCStatus { Pending, Verified, Rejected, Suspended }
    
    struct KYCData {
        uint256 kycId;
        address userAddress;
        string fullName;
        string email;
        string phoneNumber;
        string residenceAddress;
        string documentHash;
        UserType userType;
        uint8 status; // Using uint8 for interface compatibility
        uint256 submissionTime;
        uint256 verificationTime;
        address verifiedBy;
    }
    
    function checkKYCStatus(address user) external view returns (bool);
    function getKYCDataForContract(address user) external view returns (KYCData memory);
}

// Interface for E-Residency NFT
interface IBhutanEResidencyNFT {
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
    
    function isResidencyValid(uint256 tokenId) external view returns (bool);
    function getResidencyData(uint256 tokenId) external view returns (ResidencyData memory);
    function getUserOwnedTokens(address user) external view returns (uint256[] memory);
    function hasBusinessResidency(address user) external view returns (bool);
}

// Custom errors
error NotAuthorizedVerifier();
error NotKYCVerified();
error NotBhutaneseNational();
error NotEResident();
error LandNotFound();
error NotLandOwner();
error LandNotForSale();
error InsufficientPayment();
error LandAlreadyListed();
error InvalidPrice();
error InvalidArea();
error TransferFailed();
error LandNotAvailable();
error InvalidCoordinates();

/**
 * @title BhutanLandMarketplace
 * @dev Marketplace for Bhutanese nationals to list lands and e-residents to purchase them
 */
contract BhutanLandMarketplace is Ownable, ReentrancyGuard, Pausable {
    // ================= State Variables =================
    IKYCPlatform public kycContract;
    IBhutanEResidencyNFT public eResidencyContract;
    
    uint256 private _landIdCounter;
    uint256 private _bhutaneseKycIdCounter;
    
    // Platform fee (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFeeRate = 250; // 2.5%
    address public feeRecipient;
    
    enum LandType { Residential, Commercial, Agricultural, Industrial }
    enum LandStatus { Available, Sold, Delisted }
    enum BhutaneseKYCStatus { Pending, Verified, Rejected }
    
    struct BhutaneseKYCData {
        uint256 kycId;
        address userAddress;
        string fullName;
        string email;
        string phoneNumber;
        string residenceAddress;
        string citizenshipNumber;
        string documentHash;
        BhutaneseKYCStatus status;
        uint256 submissionTime;
        uint256 verificationTime;
        address verifiedBy;
    }
    
    struct LandListing {
        uint256 landId;
        address owner;
        string landTitle;
        string description;
        string location;
        string coordinates; // GPS coordinates
        uint256 area; // in square feet
        LandType landType;
        uint256 price; // in wei
        LandStatus status;
        string[] imageHashes; // IPFS hashes for land images
        string documentHash; // Legal documents hash
        uint256 listedAt;
        uint256 soldAt;
        address soldTo;
        bool isVerified; // Verified by authorities
    }
    
    struct PurchaseRecord {
        uint256 purchaseId;
        uint256 landId;
        address buyer;
        address seller;
        uint256 price;
        uint256 platformFee;
        uint256 timestamp;
        string transactionHash;
    }
    
    // Mappings
    mapping(address => BhutaneseKYCData) public bhutaneseKycRecords;
    mapping(uint256 => address) public bhutaneseKycIdToAddress;
    mapping(address => bool) public verifiers;
    mapping(uint256 => LandListing) public landListings;
    mapping(address => uint256[]) public userLandListings;
    mapping(address => uint256[]) public userPurchases;
    mapping(uint256 => PurchaseRecord) public purchaseRecords;
    mapping(address => bool) public verifiedBhutaneseNationals;
    
    uint256 private _purchaseIdCounter;
    
    // Events
    event BhutaneseKYCSubmitted(address indexed user, uint256 kycId, string citizenshipNumber);
    event BhutaneseKYCVerified(address indexed user, uint256 kycId, address verifiedBy);
    event BhutaneseKYCRejected(address indexed user, uint256 kycId, string reason);
    
    event LandListed(
        uint256 indexed landId,
        address indexed owner,
        string landTitle,
        uint256 price,
        LandType landType
    );
    event LandSold(
        uint256 indexed landId,
        address indexed seller,
        address indexed buyer,
        uint256 price,
        uint256 platformFee
    );
    event LandDelisted(uint256 indexed landId, address indexed owner);
    event LandVerified(uint256 indexed landId, address indexed verifier);
    event LandPriceUpdated(uint256 indexed landId, uint256 oldPrice, uint256 newPrice);
    
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    
    // Modifiers
    modifier onlyVerifier() {
        if (!(verifiers[msg.sender] || msg.sender == owner())) revert NotAuthorizedVerifier();
        _;
    }
    
    modifier onlyVerifiedBhutanese() {
        if (!isVerifiedBhutaneseNational(msg.sender)) revert NotBhutaneseNational();
        _;
    }
    
    modifier onlyEResident() {
        if (!isValidEResident(msg.sender)) revert NotEResident();
        _;
    }
    
    modifier landExists(uint256 landId) {
        if (landListings[landId].landId == 0) revert LandNotFound();
        _;
    }
    
    modifier onlyLandOwner(uint256 landId) {
        if (landListings[landId].owner != msg.sender) revert NotLandOwner();
        _;
    }
    
    constructor(
        address _kycContract,
        address _eResidencyContract,
        address _feeRecipient
    ) Ownable(msg.sender) {
        require(_kycContract != address(0), "Invalid KYC contract");
        require(_eResidencyContract != address(0), "Invalid e-residency contract");
        require(_feeRecipient != address(0), "Invalid fee recipient");
        
        kycContract = IKYCPlatform(_kycContract);
        eResidencyContract = IBhutanEResidencyNFT(_eResidencyContract);
        feeRecipient = _feeRecipient;
    }
    
    // ================= Contract Management =================
    function setKYCContract(address _kycContract) external onlyOwner {
        require(_kycContract != address(0), "Invalid KYC contract");
        kycContract = IKYCPlatform(_kycContract);
    }
    
    function setEResidencyContract(address _eResidencyContract) external onlyOwner {
        require(_eResidencyContract != address(0), "Invalid e-residency contract");
        eResidencyContract = IBhutanEResidencyNFT(_eResidencyContract);
    }
    
    function setPlatformFee(uint256 _feeRate) external onlyOwner {
        require(_feeRate <= 1000, "Fee too high"); // Max 10%
        uint256 oldFee = platformFeeRate;
        platformFeeRate = _feeRate;
        emit PlatformFeeUpdated(oldFee, _feeRate);
    }
    
    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        feeRecipient = _feeRecipient;
    }
    
    // ================= Verifier Management =================
    function addVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }
    
    function removeVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = false;
        emit VerifierRemoved(verifier);
    }
    
    // ================= Bhutanese National KYC =================
    function submitBhutaneseKYC(
        string memory _fullName,
        string memory _email,
        string memory _phoneNumber,
        string memory _residenceAddress,
        string memory _citizenshipNumber,
        string memory _documentHash
    ) external whenNotPaused {
        require(bytes(_fullName).length > 0, "Full name required");
        require(bytes(_email).length > 0, "Email required");
        require(bytes(_phoneNumber).length > 0, "Phone required");
        require(bytes(_residenceAddress).length > 0, "Address required");
        require(bytes(_citizenshipNumber).length > 0, "Citizenship number required");
        require(bytes(_documentHash).length > 0, "Documents required");
        require(bhutaneseKycRecords[msg.sender].kycId == 0, "KYC already submitted");
        
        _bhutaneseKycIdCounter++;
        uint256 newKycId = _bhutaneseKycIdCounter;
        
        bhutaneseKycRecords[msg.sender] = BhutaneseKYCData({
            kycId: newKycId,
            userAddress: msg.sender,
            fullName: _fullName,
            email: _email,
            phoneNumber: _phoneNumber,
            residenceAddress: _residenceAddress,
            citizenshipNumber: _citizenshipNumber,
            documentHash: _documentHash,
            status: BhutaneseKYCStatus.Pending,
            submissionTime: block.timestamp,
            verificationTime: 0,
            verifiedBy: address(0)
        });
        
        bhutaneseKycIdToAddress[newKycId] = msg.sender;
        emit BhutaneseKYCSubmitted(msg.sender, newKycId, _citizenshipNumber);
    }
    
    function verifyBhutaneseKYC(address user) external onlyVerifier whenNotPaused {
        require(bhutaneseKycRecords[user].kycId != 0, "KYC not submitted");
        require(bhutaneseKycRecords[user].status == BhutaneseKYCStatus.Pending, "KYC not pending");
        
        bhutaneseKycRecords[user].status = BhutaneseKYCStatus.Verified;
        bhutaneseKycRecords[user].verificationTime = block.timestamp;
        bhutaneseKycRecords[user].verifiedBy = msg.sender;
        verifiedBhutaneseNationals[user] = true;
        
        emit BhutaneseKYCVerified(user, bhutaneseKycRecords[user].kycId, msg.sender);
    }
    
    function rejectBhutaneseKYC(address user, string memory reason) external onlyVerifier whenNotPaused {
        require(bhutaneseKycRecords[user].kycId != 0, "KYC not submitted");
        require(bhutaneseKycRecords[user].status == BhutaneseKYCStatus.Pending, "KYC not pending");
        
        bhutaneseKycRecords[user].status = BhutaneseKYCStatus.Rejected;
        emit BhutaneseKYCRejected(user, bhutaneseKycRecords[user].kycId, reason);
    }
    
    // ================= Land Listing Functions =================
    function listLand(
        string memory _landTitle,
        string memory _description,
        string memory _location,
        string memory _coordinates,
        uint256 _area,
        LandType _landType,
        uint256 _price,
        string[] memory _imageHashes,
        string memory _documentHash
    ) external onlyVerifiedBhutanese whenNotPaused returns (uint256) {
        require(bytes(_landTitle).length > 0, "Land title required");
        require(bytes(_description).length > 0, "Description required");
        require(bytes(_location).length > 0, "Location required");
        require(bytes(_coordinates).length > 0, "Coordinates required");
        require(_area > 0, "Invalid area");
        require(_price > 0, "Invalid price");
        require(bytes(_documentHash).length > 0, "Documents required");
        
        _landIdCounter++;
        uint256 newLandId = _landIdCounter;
        
        landListings[newLandId] = LandListing({
            landId: newLandId,
            owner: msg.sender,
            landTitle: _landTitle,
            description: _description,
            location: _location,
            coordinates: _coordinates,
            area: _area,
            landType: _landType,
            price: _price,
            status: LandStatus.Available,
            imageHashes: _imageHashes,
            documentHash: _documentHash,
            listedAt: block.timestamp,
            soldAt: 0,
            soldTo: address(0),
            isVerified: false
        });
        
        userLandListings[msg.sender].push(newLandId);
        
        emit LandListed(newLandId, msg.sender, _landTitle, _price, _landType);
        return newLandId;
    }
    
    function updateLandPrice(uint256 landId, uint256 newPrice) 
        external 
        landExists(landId) 
        onlyLandOwner(landId) 
        whenNotPaused 
    {
        require(newPrice > 0, "Invalid price");
        require(landListings[landId].status == LandStatus.Available, "Land not available");
        
        uint256 oldPrice = landListings[landId].price;
        landListings[landId].price = newPrice;
        
        emit LandPriceUpdated(landId, oldPrice, newPrice);
    }
    
    function delistLand(uint256 landId) 
        external 
        landExists(landId) 
        onlyLandOwner(landId) 
        whenNotPaused 
    {
        require(landListings[landId].status == LandStatus.Available, "Land not available");
        
        landListings[landId].status = LandStatus.Delisted;
        emit LandDelisted(landId, msg.sender);
    }
    
    function verifyLand(uint256 landId) external onlyVerifier landExists(landId) {
        landListings[landId].isVerified = true;
        emit LandVerified(landId, msg.sender);
    }
    
    // ================= Purchase Functions =================
    function purchaseLand(uint256 landId) 
        external 
        payable 
        landExists(landId) 
        onlyEResident 
        nonReentrant 
        whenNotPaused 
    {
        LandListing storage land = landListings[landId];
        
        require(land.status == LandStatus.Available, "Land not available");
        require(land.owner != msg.sender, "Cannot buy own land");
        require(msg.value >= land.price, "Insufficient payment");
        
        // Calculate platform fee
        uint256 platformFee = (land.price * platformFeeRate) / 10000;
        uint256 sellerAmount = land.price - platformFee;
        
        // Update land status
        land.status = LandStatus.Sold;
        land.soldAt = block.timestamp;
        land.soldTo = msg.sender;
        
        // Record purchase
        _purchaseIdCounter++;
        uint256 purchaseId = _purchaseIdCounter;
        
        purchaseRecords[purchaseId] = PurchaseRecord({
            purchaseId: purchaseId,
            landId: landId,
            buyer: msg.sender,
            seller: land.owner,
            price: land.price,
            platformFee: platformFee,
            timestamp: block.timestamp,
            transactionHash: ""
        });
        
        userPurchases[msg.sender].push(purchaseId);
        
        // Transfer funds
        if (platformFee > 0) {
            (bool feeTransferSuccess,) = feeRecipient.call{value: platformFee}("");
            require(feeTransferSuccess, "Fee transfer failed");
        }
        
        (bool sellerTransferSuccess,) = land.owner.call{value: sellerAmount}("");
        require(sellerTransferSuccess, "Seller transfer failed");
        
        // Refund excess payment
        if (msg.value > land.price) {
            (bool refundSuccess,) = msg.sender.call{value: msg.value - land.price}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit LandSold(landId, land.owner, msg.sender, land.price, platformFee);
    }
    
    // ================= View Functions =================
    function isVerifiedBhutaneseNational(address user) public view returns (bool) {
        return verifiedBhutaneseNationals[user] && 
               bhutaneseKycRecords[user].status == BhutaneseKYCStatus.Verified;
    }
    
    function isValidEResident(address user) public view returns (bool) {
        if (!kycContract.checkKYCStatus(user)) return false;
        
        uint256[] memory userTokens = eResidencyContract.getUserOwnedTokens(user);
        
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (eResidencyContract.isResidencyValid(userTokens[i])) {
                return true;
            }
        }
        
        return false;
    }
    
    function getBhutaneseKYCData(address user) external view returns (BhutaneseKYCData memory) {
        return bhutaneseKycRecords[user];
    }
    
    function getLandListing(uint256 landId) external view returns (LandListing memory) {
        require(landListings[landId].landId != 0, "Land not found");
        return landListings[landId];
    }
    
    function getAvailableLands() external view returns (LandListing[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _landIdCounter; i++) {
            if (landListings[i].status == LandStatus.Available) {
                count++;
            }
        }
        
        LandListing[] memory availableLands = new LandListing[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= _landIdCounter; i++) {
            if (landListings[i].status == LandStatus.Available) {
                availableLands[idx++] = landListings[i];
            }
        }
        
        return availableLands;
    }
    
    function getVerifiedLands() external view returns (LandListing[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _landIdCounter; i++) {
            if (landListings[i].status == LandStatus.Available && landListings[i].isVerified) {
                count++;
            }
        }
        
        LandListing[] memory verifiedLands = new LandListing[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= _landIdCounter; i++) {
            if (landListings[i].status == LandStatus.Available && landListings[i].isVerified) {
                verifiedLands[idx++] = landListings[i];
            }
        }
        
        return verifiedLands;
    }
    
    function getUserLandListings(address user) external view returns (LandListing[] memory) {
        uint256[] memory userLandIds = userLandListings[user];
        LandListing[] memory userLands = new LandListing[](userLandIds.length);
        
        for (uint256 i = 0; i < userLandIds.length; i++) {
            userLands[i] = landListings[userLandIds[i]];
        }
        
        return userLands;
    }
    
    function getUserPurchaseHistory(address user) external view returns (PurchaseRecord[] memory) {
        uint256[] memory userPurchaseIds = userPurchases[user];
        PurchaseRecord[] memory purchases = new PurchaseRecord[](userPurchaseIds.length);
        
        for (uint256 i = 0; i < userPurchaseIds.length; i++) {
            purchases[i] = purchaseRecords[userPurchaseIds[i]];
        }
        
        return purchases;
    }
    

    
    function getLandsByType(LandType landType) external view returns (LandListing[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _landIdCounter; i++) {
            if (landListings[i].status == LandStatus.Available && landListings[i].landType == landType) {
                count++;
            }
        }
        
        LandListing[] memory typedLands = new LandListing[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= _landIdCounter; i++) {
            if (landListings[i].status == LandStatus.Available && landListings[i].landType == landType) {
                typedLands[idx++] = landListings[i];
            }
        }
        
        return typedLands;
    }
    
    function getLandsByPriceRange(uint256 minPrice, uint256 maxPrice) external view returns (LandListing[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _landIdCounter; i++) {
            if (landListings[i].status == LandStatus.Available && 
                landListings[i].price >= minPrice && 
                landListings[i].price <= maxPrice) {
                count++;
            }
        }
        
        LandListing[] memory filteredLands = new LandListing[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= _landIdCounter; i++) {
            if (landListings[i].status == LandStatus.Available && 
                landListings[i].price >= minPrice && 
                landListings[i].price <= maxPrice) {
                filteredLands[idx++] = landListings[i];
            }
        }
        
        return filteredLands;
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
    
    
    // ================= Statistics =================
    function getMarketplaceStats() external view returns (
        uint256 totalLands,
        uint256 availableLands,
        uint256 soldLands,
        uint256 totalSales,
        uint256 totalVolume
    ) {
        totalLands = _landIdCounter;
        availableLands = 0;
        soldLands = 0;
        totalSales = _purchaseIdCounter;
        totalVolume = 0;
        
        for (uint256 i = 1; i <= _landIdCounter; i++) {
            if (landListings[i].status == LandStatus.Available) {
                availableLands++;
            } else if (landListings[i].status == LandStatus.Sold) {
                soldLands++;
            }
        }
        
        for (uint256 i = 1; i <= _purchaseIdCounter; i++) {
            totalVolume += purchaseRecords[i].price;
        }
    }
    function getPendingBhutaneseKYC() public view returns (BhutaneseKYCData[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _bhutaneseKycIdCounter; i++) {
            address user = bhutaneseKycIdToAddress[i];
            if (bhutaneseKycRecords[user].status == BhutaneseKYCStatus.Pending) {
                count++;
            }
        }
        
        BhutaneseKYCData[] memory pending = new BhutaneseKYCData[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= _bhutaneseKycIdCounter; i++) {
            address user = bhutaneseKycIdToAddress[i];
            if (bhutaneseKycRecords[user].status == BhutaneseKYCStatus.Pending) {
                pending[idx++] = bhutaneseKycRecords[user];
            }
        }
        return pending;
    }

    function getAllPendingBhutaneseKYC() external view returns (BhutaneseKYCData[] memory) {
        return getPendingBhutaneseKYC();
    }

/**
 * @dev Get KYC data by address for verifier
 */
function getBhutaneseKYCByAddress(address user) external view returns (BhutaneseKYCData memory) {
    require(bhutaneseKycRecords[user].kycId != 0, "KYC not found");
    return bhutaneseKycRecords[user];
}

/**
 * @dev Check if address is a verifier
 */
function isVerifier(address user) external view returns (bool) {
    return verifiers[user] || user == owner();
}

/**
 * @dev Get total KYC count for pagination
 */
function getTotalBhutaneseKYCCount() external view returns (uint256) {
    return _bhutaneseKycIdCounter;
}

/**
 * @dev Get KYC applications by status
 */
function getBhutaneseKYCByStatus(BhutaneseKYCStatus status) external view returns (BhutaneseKYCData[] memory) {
    uint256 count = 0;
    for (uint256 i = 1; i <= _bhutaneseKycIdCounter; i++) {
        address user = bhutaneseKycIdToAddress[i];
        if (bhutaneseKycRecords[user].status == status) {
            count++;
        }
    }
    
    BhutaneseKYCData[] memory statusKyc = new BhutaneseKYCData[](count);
    uint256 idx = 0;
    for (uint256 i = 1; i <= _bhutaneseKycIdCounter; i++) {
        address user = bhutaneseKycIdToAddress[i];
        if (bhutaneseKycRecords[user].status == status) {
            statusKyc[idx++] = bhutaneseKycRecords[user];
        }
    }
    return statusKyc;
}

}