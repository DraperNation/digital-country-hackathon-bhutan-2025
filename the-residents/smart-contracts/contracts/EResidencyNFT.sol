// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

/**
 * @title eResidencyNFT
 * @dev Soulbound (non-transferable) ERC721 token for eResidency
 */
contract EResidencyNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    // Mapping from token ID to metadata
    mapping(uint256 => ResidencyData) private _residencyData;
    
    // Mapping from user address to token ID
    mapping(address => uint256) private _tokenOfOwner;
    
    // Counter for token IDs
    uint256 private _tokenIdCounter;
    
    // Struct to store residency data
    struct ResidencyData {
        string name;
        string citizenshipCountry;
        string eResidencyId;
        uint256 timestamp;
    }
    
    // Events
    event ResidencyMinted(address indexed to, uint256 indexed tokenId, string eResidencyId);
    
    constructor() 
        ERC721("eResidencyNFT", "eRES")
        Ownable(msg.sender)
    {}
    
    /**
     * @dev Mints a new eResidency NFT (only callable by owner)
     * @param to The address that will receive the NFT
     * @param name The name of the eResident
     * @param citizenshipCountry The country of citizenship
     * @param eResidencyId The eResidency ID
     * @param tokenUri The URI for the token metadata
     */
    function mintNFT(
        address to,
        string memory name,
        string memory citizenshipCountry,
        string memory eResidencyId,
        string memory tokenUri
    ) external onlyOwner returns (uint256) {
        require(_tokenOfOwner[to] == 0, "Address already has an eResidency NFT");
        
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        
        // Store residency data
        _residencyData[newTokenId] = ResidencyData({
            name: name,
            citizenshipCountry: citizenshipCountry,
            eResidencyId: eResidencyId,
            timestamp: block.timestamp
        });
        
        // Mint the token
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenUri);
        _tokenOfOwner[to] = newTokenId;
        
        emit ResidencyMinted(to, newTokenId, eResidencyId);
        
        return newTokenId;
    }
    
    /**
     * @dev Gets the residency data for a token
     * @param tokenId The token ID to query
     */
    function getResidencyData(uint256 tokenId) external view returns (
        string memory name,
        string memory citizenshipCountry,
        string memory eResidencyId,
        uint256 timestamp
    ) {
        // This will revert if token doesn't exist
        ownerOf(tokenId);
        
        ResidencyData memory data = _residencyData[tokenId];
        return (data.name, data.citizenshipCountry, data.eResidencyId, data.timestamp);
    }
    
    /**
     * @dev Gets the token ID for a given owner
     * @param owner The address to query
     */
    function tokenOfOwner(address owner) external view returns (uint256) {
        uint256 tokenId = _tokenOfOwner[owner];
        require(tokenId != 0, "Owner has no tokens");
        return tokenId;
    }
    
    // Override _update to prevent transfers and update our ownership mapping
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721) returns (address) {
        address from = _ownerOf(tokenId);
        
        // Only allow minting (from address(0)) and burning (to address(0))
        if (from != address(0) && to != address(0)) {
            revert("eResidencyNFT: Token is soulbound and cannot be transferred");
        }
        
        // Update our ownership mapping
        if (from != address(0)) {
            delete _tokenOfOwner[from];
        }
        if (to != address(0)) {
            _tokenOfOwner[to] = tokenId;
        }
        
        return super._update(to, tokenId, auth);
    }
    
    // The following functions are overrides required by Solidity
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
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
