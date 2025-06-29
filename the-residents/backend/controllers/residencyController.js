import { ethers } from 'ethers';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Residency from '../models/Residency.js';
import User from '../models/User.js';
import Kyc from '../models/Kyc.js';
import Company from '../models/Company.js';
import { responseHandler } from '../utils/responseHandler.js';

dotenv.config();

// Configuration
const CONTRACT_ADDRESS = process.env.ERESIDENCY_NFT_CONTRACT_ADDRESS ;
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY ;
const RPC_URL = process.env.MUMBAI_RPC_URL ;
const METADATA_BASE_URI = process.env.METADATA_BASE_URI ;

console.log(CONTRACT_ADDRESS, PRIVATE_KEY, RPC_URL, METADATA_BASE_URI);


// Validate configuration
if (!CONTRACT_ADDRESS) {
  console.warn('Using default contract address for local development');
}
if (!PRIVATE_KEY) {
  console.warn('Using default private key for local development');
}

// Initialize provider and signer with error handling
let provider;
let wallet;

try {
  provider = new ethers.JsonRpcProvider(RPC_URL);
  wallet = new ethers.Wallet(PRIVATE_KEY, provider);
} catch (error) {
  console.error('Failed to initialize Ethereum provider/wallet:', error);
  throw new Error('Failed to initialize blockchain connection');
}

// Contract ABI - Should match your deployed contract
const contractABI = [
  // ERC721 Standard
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function transferFrom(address from, address to, uint256 tokenId)',
  'function approve(address to, uint256 tokenId)',
  'function getApproved(uint256 tokenId) view returns (address)',
  'function setApprovalForAll(address operator, bool _approved)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data)',
  
  // ERC721 Metadata
  'function name() view returns (string memory)',
  'function symbol() view returns (string memory)',
  'function tokenURI(uint256 tokenId) view returns (string memory)',
  
  // Custom Functions
  'function mintNFT(address to, string memory name, string memory citizenshipCountry, string memory eResidencyId, string memory tokenUri) external returns (uint256)',
  'function tokenOfOwner(address owner) view returns (uint256)',
  'function getResidencyData(uint256 tokenId) view returns (string memory name, string memory citizenshipCountry, string memory eResidencyId, uint256 timestamp)'
];

// Helper function to check if address has NFT on blockchain
const checkNFTOnBlockchain = async (walletAddress) => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
    const tokenId = await contract.tokenOfOwner(walletAddress);
    return { hasNFT: true, tokenId: tokenId.toString() };
  } catch (error) {
    // If error contains "Owner has no tokens", then no NFT exists
    if (error.message.includes('Owner has no tokens')) {
      return { hasNFT: false, tokenId: null };
    }
    throw error;
  }
};

// Helper function to fetch NFT data from blockchain
const fetchNFTDataFromBlockchain = async (tokenId, walletAddress) => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
    
    // Get residency data from contract
    const [name, citizenshipCountry, eResidencyId, timestamp] = await contract.getResidencyData(tokenId);
    
    // Get token URI
    const tokenUri = await contract.tokenURI(tokenId);
    
    return {
      tokenId: tokenId.toString(),
      name,
      citizenshipCountry,
      eResidencyId,
      timestamp: timestamp.toString(),
      tokenUri,
      walletAddress: walletAddress.toLowerCase()
    };
  } catch (error) {
    console.error('Error fetching NFT data from blockchain:', error);
    throw error;
  }
};

// Function to save blockchain NFT data to database
const saveBlockchainNFTToDatabase = async (userId, nftData, session) => {
  try {
    // Create metadata object
    const metadata = {
      name: nftData.name,
      citizenshipCountry: nftData.citizenshipCountry,
      eResidencyId: nftData.eResidencyId,
      timestamp: new Date(parseInt(nftData.timestamp) * 1000).toISOString(),
      description: `e-Residency NFT for ${nftData.name}`,
      image: `http://localhost:8000/api/image/${nftData.eResidencyId}`,
      attributes: [
        {
          trait_type: 'Citizenship',
          value: nftData.citizenshipCountry
        },
        {
          display_type: 'date',
          trait_type: 'Issued On',
          value: parseInt(nftData.timestamp)
        }
      ]
    };

    // Save to Residency collection
    const newResidency = new Residency({
      user: userId,
      walletAddress: nftData.walletAddress,
      tokenId: nftData.tokenId,
      contractAddress: CONTRACT_ADDRESS,
      transactionHash: '', // We don't have the original transaction hash
      metadata,
      blockNumber: 0, // We don't have the original block number
      blockHash: '', // We don't have the original block hash
      syncedFromBlockchain: true // Flag to indicate this was synced from blockchain
    });
    
    await newResidency.save({ session });

    // Update user with residency data
    const user = await User.findById(userId).session(session);
    if (user) {
      user.eResidencyId = nftData.eResidencyId;
      user.walletAddress = nftData.walletAddress;
      user.nftTokenId = nftData.tokenId;
      await user.save({ session });
    }

    return newResidency;
  } catch (error) {
    console.error('Error saving blockchain NFT to database:', error);
    throw error;
  }
};

export const checkMintStatus = async (req, res) => {
  try {
    console.log('Checking mint status for user:', req.params.userId);
    const { userId } = req.params;
    const residency = await Residency.findOne({ user: userId });
    
    if (!residency) {
      return res.status(404).json({ 
        hasMinted: false,
        message: 'No residency NFT found for this user'
      });
    }
    
    res.json({
      hasMinted: true,
      tokenId: residency.tokenId,
      contractAddress: residency.contractAddress,
      transactionHash: residency.transactionHash,
      mintedAt: residency.createdAt,
      metadata: residency.metadata
    });
  } catch (error) {
    console.error('Error checking mint status:', error);
    res.status(500).json({ error: 'Failed to check mint status' });
  }
};

/**
 * @swagger
 * /api/residency/mint:
 *   post:
 *     summary: Mint a new e-Residency NFT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - walletAddress
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user requesting the mint
 *               walletAddress:
 *                 type: string
 *                 description: The Ethereum address where the NFT will be minted
 *     responses:
 *       200:
 *         description: NFT minted successfully
 *       400:
 *         description: Invalid request or NFT already minted
 *       403:
 *         description: KYC not approved
 *       500:
 *         description: Server error
 */
export const mintResidencyNFT = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { userId, walletAddress } = req.body;
    
    // Input validation
    if (!userId || !walletAddress) {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: 'Missing required fields: userId and walletAddress are required' 
      });
    }
    
    // Validate Ethereum address
    if (!ethers.isAddress(walletAddress)) {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: 'Invalid wallet address' 
      });
    }
    
    // Verify user exists and is KYC approved
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Check KYC status from Kyc model
    const kyc = await Kyc.findOne({ user: userId }).session(session);
    if (!kyc || kyc.status !== 'approved') {
      await session.abortTransaction();
      return res.status(403).json({ 
        error: 'KYC verification not approved',
        kycStatus: kyc?.status || 'not_found'
      });
    }
    
    // Check if already minted
    const existingResidency = await Residency.findOne({ user: userId }).session(session);
    if (existingResidency) {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: 'NFT already minted for this user',
        tokenId: existingResidency.tokenId,
        transactionHash: existingResidency.transactionHash
      });
    }
    
    // Prepare metadata
    const eResidencyId = `ER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const metadata = {
      name: user.fullName,
      citizenshipCountry: user.nationality || 'Unknown',
      eResidencyId,
      timestamp: new Date().toISOString(),
      description: `e-Residency NFT for ${user.fullName}`,
      image: `http://localhost:8000/api/image/${eResidencyId}`,
      attributes: [
        {
          trait_type: 'Citizenship',
          value: user.nationality || 'Unknown'
        },
        {
          display_type: 'date',
          trait_type: 'Issued On',
          value: Math.floor(Date.now() / 1000)
        }
      ]
    };
    
    try {
      // Connect to contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);
      
      // Call mint function
      const tokenUri = `http://localhost:8000/api/metadata/${eResidencyId}`;
      const tx = await contract.mintNFT(
        walletAddress,
        metadata.name,
        metadata.citizenshipCountry,
        eResidencyId,
        tokenUri
      );
      
      const receipt = await tx.wait();
      
      // Parse token ID from transaction receipt
      let tokenId;
      try {
        const iface = new ethers.Interface(contractABI);
        const log = receipt.logs.find(
          log => log.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()
        );
        
        if (log) {
          const parsedLog = iface.parseLog(log);
          tokenId = parsedLog.args.tokenId?.toString();
        }
      } catch (parseError) {
        console.error('Error parsing transaction receipt:', parseError);
        // Fallback to block number if we can't parse the token ID
        tokenId = `tx-${receipt.blockNumber}-${receipt.transactionIndex}`;
      }
    
      // Save to database
      const newResidency = new Residency({
        user: userId,
        walletAddress: walletAddress.toLowerCase(),
        tokenId: tokenId.toString(),
        contractAddress: CONTRACT_ADDRESS,
        transactionHash: receipt.transactionHash,
        metadata,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash
      });
      
      await newResidency.save({ session });
      
      // Update user with residency ID
      user.eResidencyId = eResidencyId;
      user.walletAddress = walletAddress.toLowerCase();
      user.nftTokenId = tokenId.toString();
      await user.save({ session });
      
      // Commit the transaction
      await session.commitTransaction();
      
      // Send response
      res.json({
        success: true,
        transactionHash: receipt.transactionHash,
        tokenId: tokenId.toString(),
        eResidencyId,
        contractAddress: CONTRACT_ADDRESS,
        blockNumber: receipt.blockNumber,
        timestamp: new Date().toISOString()
      });
      
    } catch (blockchainError) {
      console.error('Blockchain transaction failed:', blockchainError);
      
      // Check if error is because address already has an NFT
      if (blockchainError.message.includes('Address already has an eResidency NFT')) {
        console.log(`Wallet ${walletAddress} already has an NFT. Attempting to sync from blockchain...`);
        
        try {
          // Check if the NFT exists on blockchain
          const blockchainCheck = await checkNFTOnBlockchain(walletAddress);
          
          if (blockchainCheck.hasNFT) {
            // Fetch NFT data from blockchain
            const nftData = await fetchNFTDataFromBlockchain(blockchainCheck.tokenId, walletAddress);
            
            // Save to database
            const savedResidency = await saveBlockchainNFTToDatabase(userId, nftData, session);
            
            // Commit the transaction
            await session.commitTransaction();
            
            // Return success response with synced data
            return res.json({
              success: true,
              message: 'NFT data synced from blockchain',
              synced: true,
              tokenId: nftData.tokenId,
              eResidencyId: nftData.eResidencyId,
              contractAddress: CONTRACT_ADDRESS,
              syncedAt: new Date().toISOString()
            });
          }
        } catch (syncError) {
          console.error('Error syncing NFT from blockchain:', syncError);
          await session.abortTransaction();
          throw new Error(`Failed to sync existing NFT: ${syncError.message}`);
        }
      }
      
      await session.abortTransaction();
      throw new Error(`Blockchain transaction failed: ${blockchainError.message}`);
    }
    
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch (abortError) {
      console.error('Error aborting transaction:', abortError);
    }
    
    console.error('Error in mintResidencyNFT:', error);
    
    // More specific error handling
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return res.status(400).json({
        error: 'Insufficient funds for transaction',
        code: 'INSUFFICIENT_FUNDS'
      });
    }
    
    if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
      return res.status(503).json({
        error: 'Blockchain network error. Please try again later.',
        code: 'NETWORK_ERROR'
      });
    }
    
    // Default error response
    res.status(500).json({ 
      error: 'Failed to mint NFT',
      code: 'MINT_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    await session.endSession();
  }
};

// Get public directory of verified residents
const getPublicDirectory = async (req, res) => {
  try {
    // Get all approved KYC records
    const approvedKycs = await Kyc.find({ 
      status: 'approved' 
    }).populate('user', 'fullName email walletAddress publicProfile createdAt');

    const publicResidents = [];

    for (const kyc of approvedKycs) {
      if (!kyc.user) continue;

      const user = kyc.user;
      
      // Check if user has opted for public profile (default to false for privacy)
      const isPublic = user.publicProfile || false;
      
      // Get user's companies if any
      const companies = await Company.find({ owner: user._id }).select(
        'companyName status registrationDate registrationNumber'
      );

      // Prepare resident data with privacy controls
      const residentData = {
        id: user._id,
        // Show full name only if public, otherwise show pseudonym
        name: isPublic ? user.fullName : `Resident-${user._id.toString().slice(-8)}`,
        residencyDate: kyc.approvedAt || kyc.createdAt,
        isPublic: isPublic,
        // Show wallet address only if public and exists
        walletAddress: isPublic && user.walletAddress ? user.walletAddress : null,
        // Show entities with obfuscated details unless public
        entities: companies.map(company => ({
          id: company._id,
          name: isPublic ? company.companyName : `Entity-${company.registrationNumber}`,
          status: company.status,
          registrationDate: company.registrationDate,
          registrationNumber: isPublic ? company.registrationNumber : `BT-***${company.registrationNumber.slice(-4)}`
        }))
      };

      publicResidents.push(residentData);
    }

    // Sort by residency date (newest first)
    publicResidents.sort((a, b) => new Date(b.residencyDate) - new Date(a.residencyDate));

    return responseHandler.success(res, 'Public directory retrieved successfully', {
      residents: publicResidents,
      totalCount: publicResidents.length,
      publicCount: publicResidents.filter(r => r.isPublic).length,
      privateCount: publicResidents.filter(r => !r.isPublic).length
    });

  } catch (error) {
    console.error('Error fetching public directory:', error);
    return responseHandler.error(res, 'Failed to fetch public directory', 500);
  }
};

// Update user's public profile preference
const updatePublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { publicProfile, publicName, publicWallet } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return responseHandler.error(res, 'User not found', 404);
    }

    // Update public profile settings
    user.publicProfile = publicProfile;
    if (publicName !== undefined) user.publicName = publicName;
    if (publicWallet !== undefined) user.publicWallet = publicWallet;

    await user.save();

    return responseHandler.success(res, 'Public profile settings updated', {
      publicProfile: user.publicProfile,
      publicName: user.publicName,
      publicWallet: user.publicWallet
    });

  } catch (error) {
    console.error('Error updating public profile:', error);
    return responseHandler.error(res, 'Failed to update public profile', 500);
  }
};

// Get public directory statistics
const getDirectoryStats = async (req, res) => {
  try {
    const totalResidents = await Kyc.countDocuments({ status: 'approved' });
    const totalEntities = await Company.countDocuments({ status: 'Active' });
    
    const publicUsers = await User.countDocuments({ publicProfile: true });
    
    // Get recent residents (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentResidents = await Kyc.countDocuments({
      status: 'approved',
      approvedAt: { $gte: thirtyDaysAgo }
    });

    return responseHandler.success(res, 'Directory statistics retrieved', {
      totalResidents,
      totalEntities,
      publicResidents: publicUsers,
      privateResidents: totalResidents - publicUsers,
      recentResidents
    });

  } catch (error) {
    console.error('Error fetching directory stats:', error);
    return responseHandler.error(res, 'Failed to fetch directory statistics', 500);
  }
};

export {
  getPublicDirectory,
  updatePublicProfile,
  getDirectoryStats
};
/**
 * @swagger
 * /api/residency/sync:
 *   post:
 *     summary: Sync existing NFT from blockchain to database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - walletAddress
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *               walletAddress:
 *                 type: string
 *                 description: The Ethereum address to sync NFT for
 *     responses:
 *       200:
 *         description: NFT synced successfully
 *       400:
 *         description: Invalid request or no NFT found
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const syncNFTFromBlockchain = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { userId, walletAddress } = req.body;
    
    // Input validation
    if (!userId || !walletAddress) {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: 'Missing required fields: userId and walletAddress are required' 
      });
    }
    
    // Validate Ethereum address
    if (!ethers.isAddress(walletAddress)) {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: 'Invalid wallet address' 
      });
    }
    
    // Verify user exists
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }
    
    // Check if already exists in database
    const existingResidency = await Residency.findOne({ user: userId }).session(session);
    if (existingResidency) {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: 'NFT data already exists in database',
        tokenId: existingResidency.tokenId,
        eResidencyId: existingResidency.metadata?.eResidencyId
      });
    }
    
    // Check if the NFT exists on blockchain
    const blockchainCheck = await checkNFTOnBlockchain(walletAddress);
    
    if (!blockchainCheck.hasNFT) {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: 'No NFT found for this wallet address on blockchain' 
      });
    }
    
    // Fetch NFT data from blockchain
    const nftData = await fetchNFTDataFromBlockchain(blockchainCheck.tokenId, walletAddress);
    
    // Save to database
    const savedResidency = await saveBlockchainNFTToDatabase(userId, nftData, session);
    
    // Commit the transaction
    await session.commitTransaction();
    
    // Return success response
    res.json({
      success: true,
      message: 'NFT data synced successfully from blockchain',
      tokenId: nftData.tokenId,
      eResidencyId: nftData.eResidencyId,
      contractAddress: CONTRACT_ADDRESS,
      syncedAt: new Date().toISOString(),
      data: savedResidency
    });
    
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch (abortError) {
      console.error('Error aborting transaction:', abortError);
    }
    
    console.error('Error in syncNFTFromBlockchain:', error);
    
    res.status(500).json({ 
      error: 'Failed to sync NFT from blockchain',
      code: 'SYNC_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    await session.endSession();
  }
};
