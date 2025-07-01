// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
// import "@openzeppelin/contracts/utils/Context.sol";

/**
 * @title InvoiceNFT
 * @dev ERC721 token representing a credit-based invoice
 */
contract InvoiceNFT is ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl {
    uint256 private _nextTokenId;
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct InvoiceDetails {
        string invoiceId;
        address supplier;
        address buyer;
        uint256 creditAmount;
        uint256 dueDate;
        string ipfsHash;
        bool isVerified;
    }

    // Mapping from token ID to invoice details
    mapping(uint256 => InvoiceDetails) private _invoiceDetails;
    mapping(string => bool) private _usedInvoiceIds;

    // Events
    event InvoiceMinted(
        uint256 indexed tokenId,
        address indexed supplier,
        string invoiceId
    );
    event InvoiceVerified(uint256 indexed tokenId);
    event InvoiceBurned(uint256 indexed tokenId);

    constructor() ERC721("InvoiceNFT", "INV") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    /**
     * @dev Mints a new invoice NFT
     * @param to Address to mint the NFT to
     * @param invoiceId Unique identifier for the invoice
     * @param creditAmount Credit amount of the invoice
     * @param dueDate Due date of the invoice
     * @param ipfsHash IPFS hash for additional metadata
     * @return tokenId The ID of the newly minted NFT
     */
    function mintInvoiceNFT(
        address to,
        string calldata invoiceId,
        uint256 creditAmount,
        uint256 dueDate,
        string calldata ipfsHash
    ) external returns (uint256) {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        require(!_usedInvoiceIds[invoiceId], "Invoice ID already used");
        require(creditAmount > 0, "Credit amount must be greater than 0");
        require(dueDate > block.timestamp, "Due date must be in the future");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, ipfsHash);

        _invoiceDetails[tokenId] = InvoiceDetails({
            invoiceId: invoiceId,
            supplier: msg.sender,
            buyer: to,
            creditAmount: creditAmount,
            dueDate: dueDate,
            ipfsHash: ipfsHash,
            isVerified: false
        });

        _usedInvoiceIds[invoiceId] = true;

        emit InvoiceMinted(tokenId, msg.sender, invoiceId);
        return tokenId;
    }

    /**
     * @dev Returns the details of an invoice
     * @param tokenId The ID of the NFT
     * @return InvoiceDetails struct containing all invoice information
     */
    function getInvoiceDetails(uint256 tokenId) external view returns (InvoiceDetails memory) {
        require(_exists(tokenId), "Invoice does not exist");
        return _invoiceDetails[tokenId];
    }

    /**
     * @dev Marks an invoice as verified (only callable by verifier)
     * @param tokenId The ID of the NFT to verify
     */
    function verifyInvoice(uint256 tokenId) external {
        require(hasRole(VERIFIER_ROLE, msg.sender), "Caller is not a verifier");
        require(_exists(tokenId), "Invoice does not exist");
        require(!_invoiceDetails[tokenId].isVerified, "Invoice already verified");
        
        _invoiceDetails[tokenId].isVerified = true;
        emit InvoiceVerified(tokenId);
    }

    /**
     * @dev Checks if an invoice is verified
     * @param tokenId The ID of the NFT
     * @return bool True if the invoice is verified
     */
    function isVerified(uint256 tokenId) external view returns (bool) {
        require(_exists(tokenId), "Invoice does not exist");
        return _invoiceDetails[tokenId].isVerified;
    }

    /**
     * @dev Burn an invoice NFT
     * @param tokenId ID of the invoice NFT
     */
    function burn(uint256 tokenId) external {
        address owner = ownerOf(tokenId);
        require(
            msg.sender == owner ||
            getApproved(tokenId) == msg.sender ||
            isApprovedForAll(owner, msg.sender),
            "Not approved or owner"
        );
        _burn(tokenId);
        emit InvoiceBurned(tokenId);
    }

    /**
     * @dev Override _update to prevent transfers of unverified invoices
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        require(
            _invoiceDetails[tokenId].isVerified || 
            hasRole(VERIFIER_ROLE, msg.sender) || 
            auth == address(0x0) || // Allow minting
            msg.sender == address(0x0), // Allow minting
            "Invoice must be verified before transfer"
        );
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Returns whether the specified token exists
     * @param tokenId uint256 ID of the token to query the existence of
     * @return bool whether the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    // The following functions are overrides required by Solidity
    function _increaseBalance(address account, uint128 amount)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, amount);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
} 