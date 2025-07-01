import express from 'express';
import { getPublicDirectory, updatePublicProfile, getDirectoryStats } from '../controllers/residencyController.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/directory', getPublicDirectory);
router.get('/directory/stats', getDirectoryStats);

// Protected routes (require authentication)
router.put('/profile/:userId/public', updatePublicProfile);

export default router; 