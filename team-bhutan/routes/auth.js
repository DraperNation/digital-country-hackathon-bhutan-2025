import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user,
      firebaseUser: {
        uid: req.firebaseUser.uid,
        email: req.firebaseUser.email,
        name: req.firebaseUser.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, profileCompleted: true },
      { new: true }
    );

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;