import express from 'express';
import { checkMintStatus, mintResidencyNFT, syncNFTFromBlockchain } from '../controllers/residencyController.js';

const router = express.Router();

// Check mint status
router.get('/status/:userId', checkMintStatus);

// Mint new residency NFT
router.post('/mint', mintResidencyNFT);

// Sync existing NFT from blockchain
router.post('/sync', syncNFTFromBlockchain);

export default router;
