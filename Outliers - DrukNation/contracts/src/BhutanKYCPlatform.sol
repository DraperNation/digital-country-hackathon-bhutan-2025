// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

// Custom errors for gas and size optimization
error NotAuthorizedVerifier();
error UserNotKYCVerified();
error KYCAlreadySubmitted();
error KYCNotSubmitted();
error KYCNotPending();
error DescriptionRequired();


interface IBhutanEResidencyNFT {
    function mintResidencyForVerifiedKYC(address user, string memory tokenURI) external;
}

/**

 * @title BhutanKYCPlatform
 * @dev KYC verification system for individuals and businesses
 */
contract BhutanKYCPlatform is Ownable, Pausable {
    // ================= KYC =================
    uint256 private _kycIdCounter;
    uint256 private _listingIdCounter;
    
    enum KYCStatus { Pending, Verified, Rejected, Suspended }
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
        KYCStatus status;
        uint256 submissionTime;
        uint256 verificationTime;
        address verifiedBy;
    }

IBhutanEResidencyNFT public nftContract;

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

    // Mappings
    mapping(address => KYCData) public kycRecords;
    mapping(uint256 => address) public kycIdToAddress;
    mapping(address => bool) public kycVerifiers;
    mapping(uint256 => BusinessListing) public businessListings;
    mapping(address => uint256[]) public userBusinessListings;
    mapping(address => bool) public authorizedContracts;

    // Events
    event KYCSubmitted(address indexed user, uint256 kycId, UserType userType);
    event KYCVerified(address indexed user, uint256 kycId, address verifiedBy);
    event KYCRejected(address indexed user, uint256 kycId, string reason);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    
    event BusinessListingSubmitted(
        uint256 indexed listingId,
        address indexed applicant,
        string businessName,
        string businessType
    );
    event BusinessListingVerified(
        uint256 indexed listingId,
        address indexed applicant,
        address indexed verifiedBy
    );
    event BusinessListingRejected(
        uint256 indexed listingId,
        address indexed applicant,
        string reason
    );

    // Modifiers
    modifier onlyVerifier() {
        if (!(kycVerifiers[msg.sender] || msg.sender == owner())) revert NotAuthorizedVerifier();
        _;
    }
    
    modifier onlyVerifiedUser(address user) {
        if (kycRecords[user].status != KYCStatus.Verified) revert UserNotKYCVerified();
        _;
    }

    modifier onlyVerifiedUserSelf() {
        if (!isKYCVerified(msg.sender)) revert UserNotKYCVerified();
        _;
    }

    modifier onlyAuthorizedContract() {
        require(authorizedContracts[msg.sender] || msg.sender == owner(), "Not authorized contract");
        _;
    }

    constructor() Ownable(msg.sender) {
        // Constructor logic
    }

    // ================= Contract Management =================
    function authorizeContract(address contractAddress) external onlyOwner {
        authorizedContracts[contractAddress] = true;
    }

    function revokeContractAuthorization(address contractAddress) external onlyOwner {
        authorizedContracts[contractAddress] = false;
    }

    // ================= Verifier Management =================
    function addVerifier(address verifier) external onlyOwner {
        kycVerifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }

    function removeVerifier(address verifier) external onlyOwner {
        kycVerifiers[verifier] = false;
        emit VerifierRemoved(verifier);
    }

    // ================= KYC Functions =================
    function submitKYC(
        string memory _fullName,
        string memory _email,
        string memory _phoneNumber,
        string memory _residenceAddress,
        string memory _documentHash,
        UserType _userType
    ) external whenNotPaused {
        if (bytes(_fullName).length == 0) revert();
        if (bytes(_email).length == 0) revert();
        if (bytes(_phoneNumber).length == 0) revert();
        if (bytes(_residenceAddress).length == 0) revert();
        if (bytes(_documentHash).length == 0) revert();
        if (kycRecords[msg.sender].kycId != 0) revert KYCAlreadySubmitted();

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

function setNFTContract(address _nftContract) external onlyOwner {
    require(_nftContract != address(0), "Invalid NFT contract address");
    nftContract = IBhutanEResidencyNFT(_nftContract);
}

function verifyKYCAndMintNFT(address user, string memory tokenURI) external onlyVerifier whenNotPaused {
    if (kycRecords[user].kycId == 0) revert KYCNotSubmitted();
    if (kycRecords[user].status != KYCStatus.Pending) revert KYCNotPending();
    
    // Verify KYC first
    kycRecords[user].status = KYCStatus.Verified;
    kycRecords[user].verificationTime = block.timestamp;
    kycRecords[user].verifiedBy = msg.sender;
    
    emit KYCVerified(user, kycRecords[user].kycId, msg.sender);
    
    // Mint NFT if NFT contract is set
    if (address(nftContract) != address(0)) {
        nftContract.mintResidencyForVerifiedKYC(user, tokenURI);
    }
}
    function verifyKYC(address user) external onlyVerifier whenNotPaused {
        if (kycRecords[user].kycId == 0) revert KYCNotSubmitted();
        if (kycRecords[user].status != KYCStatus.Pending) revert KYCNotPending();
        
        kycRecords[user].status = KYCStatus.Verified;
        kycRecords[user].verificationTime = block.timestamp;
        kycRecords[user].verifiedBy = msg.sender;
        
        emit KYCVerified(user, kycRecords[user].kycId, msg.sender);
    }

    function rejectKYC(address user, string memory reason) external onlyVerifier whenNotPaused {
        if (kycRecords[user].kycId == 0) revert KYCNotSubmitted();
        if (kycRecords[user].status != KYCStatus.Pending) revert KYCNotPending();
        
        kycRecords[user].status = KYCStatus.Rejected;
        emit KYCRejected(user, kycRecords[user].kycId, reason);
    }

    function getAllPendingKYC() external view returns (KYCData[] memory) {
        uint256 count;
        for (uint256 i = 1; i <= _kycIdCounter; i++) {
            address user = kycIdToAddress[i];
            if (kycRecords[user].status == KYCStatus.Pending) {
                count++;
            }
        }
        
        KYCData[] memory pending = new KYCData[](count);
        uint256 idx;
        for (uint256 i = 1; i <= _kycIdCounter; i++) {
            address user = kycIdToAddress[i];
            if (kycRecords[user].status == KYCStatus.Pending) {
                pending[idx++] = kycRecords[user];
            }
        }
        return pending;
    }

    // ================= Business Listing Functions =================
    function submitBusinessListing(
        string memory _businessName,
        string memory _businessDescription,
        string memory _businessType,
        string memory _documentsHash
    ) external onlyVerifiedUserSelf whenNotPaused returns (uint256) {
        if (bytes(_businessName).length == 0) revert("Business name required");
        if (bytes(_businessDescription).length == 0) revert DescriptionRequired();
        if (bytes(_businessType).length == 0) revert("Business type required");
        if (bytes(_documentsHash).length == 0) revert("Documents required");
        
        _listingIdCounter++;
        uint256 newListingId = _listingIdCounter;
        
        businessListings[newListingId] = BusinessListing({
            listingId: newListingId,
            applicant: msg.sender,
            businessName: _businessName,
            businessDescription: _businessDescription,
            businessType: _businessType,
            documentsHash: _documentsHash,
            status: BusinessStatus.Pending,
            submittedAt: block.timestamp,
            verifiedAt: 0,
            verifiedBy: address(0),
            rejectionReason: ""
        });
        
        userBusinessListings[msg.sender].push(newListingId);
        emit BusinessListingSubmitted(newListingId, msg.sender, _businessName, _businessType);
        return newListingId;
    }

    function verifyBusinessListing(uint256 listingId) external onlyVerifier whenNotPaused {
        BusinessListing storage listing = businessListings[listingId];
        require(listing.listingId != 0, "Listing not found");
        require(listing.status == BusinessStatus.Pending, "Listing not pending");
        
        listing.status = BusinessStatus.Verified;
        listing.verifiedAt = block.timestamp;
        listing.verifiedBy = msg.sender;
        
        emit BusinessListingVerified(listingId, listing.applicant, msg.sender);
    }

    function rejectBusinessListing(uint256 listingId, string memory reason) external onlyVerifier whenNotPaused {
        BusinessListing storage listing = businessListings[listingId];
        require(listing.listingId != 0, "Listing not found");
        require(listing.status == BusinessStatus.Pending, "Listing not pending");
        
        listing.status = BusinessStatus.Rejected;
        listing.rejectionReason = reason;
        
        emit BusinessListingRejected(listingId, listing.applicant, reason);
    }

    // ================= View Functions =================
    function isKYCVerified(address user) public view returns (bool) {
        return kycRecords[user].status == KYCStatus.Verified;
    }

    function getKYCData(address user) external view returns (KYCData memory) {
        return kycRecords[user];
    }

    function getBusinessListing(uint256 listingId) external view returns (BusinessListing memory) {
        require(businessListings[listingId].listingId != 0, "Listing not found");
        return businessListings[listingId];
    }

    function getPendingBusinessListings() external view returns (BusinessListing[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _listingIdCounter; i++) {
            if (businessListings[i].status == BusinessStatus.Pending) {
                count++;
            }
        }
        
        BusinessListing[] memory pending = new BusinessListing[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= _listingIdCounter; i++) {
            if (businessListings[i].status == BusinessStatus.Pending) {
                pending[idx++] = businessListings[i];
            }
        }
        return pending;
    }

    function getUserBusinessListings(address user) external view returns (BusinessListing[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _listingIdCounter; i++) {
            if (businessListings[i].applicant == user) {
                count++;
            }
        }
        
        BusinessListing[] memory userListings = new BusinessListing[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= _listingIdCounter; i++) {
            if (businessListings[i].applicant == user) {
                userListings[idx++] = businessListings[i];
            }
        }
        return userListings;
    }

    function getVerifiedBusinessListings() external view returns (BusinessListing[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _listingIdCounter; i++) {
            if (businessListings[i].status == BusinessStatus.Verified) {
                count++;
            }
        }
        
        BusinessListing[] memory verified = new BusinessListing[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= _listingIdCounter; i++) {
            if (businessListings[i].status == BusinessStatus.Verified) {
                verified[idx++] = businessListings[i];
            }
        }
        return verified;
    }

    // ================= External Access Functions =================
    // These functions allow authorized contracts to check KYC status
    function checkKYCStatus(address user) external view onlyAuthorizedContract returns (bool) {
        return isKYCVerified(user);
    }

    function getKYCDataForContract(address user) external view onlyAuthorizedContract returns (KYCData memory) {
        return kycRecords[user];
    }

    function getBusinessListingForContract(uint256 listingId) external view onlyAuthorizedContract returns (BusinessListing memory) {
        return businessListings[listingId];
    }

    // ================= Admin Functions =================
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}