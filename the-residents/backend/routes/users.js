import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import { check, validationResult } from 'express-validator';

const router = express.Router();

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
router.put('/me', 
  [
    protect,
    check('fullName', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('country', 'Country is required').not().isEmpty(),
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, country, phone, address } = req.body;

    try {
      let user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      // Check if email is already taken
      if (email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ msg: 'Email already in use' });
        }
      }

      // Update user
      const userFields = {
        fullName,
        email,
        country,
        phone: phone || user.phone,
        address: address || user.address
      };

      user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: userFields },
        { new: true }
      ).select('-password');

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
router.put('/change-password',
  [
    protect,
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    try {
      const user = await User.findById(req.user.id).select('+password');

      // Check current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Current password is incorrect' });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({ msg: 'Password updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @desc    Upload user photo
// @route   POST /api/users/photo
// @access  Private
router.post('/photo', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // In a real app, you would handle file upload here
    // For now, we'll just accept a URL
    const { photoUrl } = req.body;
    
    if (!photoUrl) {
      return res.status(400).json({ msg: 'Please provide a photo URL' });
    }

    user.photo = photoUrl;
    await user.save();

    res.json({ photo: user.photo });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Delete user account
// @route   DELETE /api/users/me
// @access  Private
router.delete('/me', protect, async (req, res) => {
  try {
    // In a real app, you might want to soft delete the user
    // or mark their account as inactive instead of deleting it
    await User.findByIdAndDelete(req.user.id);
    
    // Clear the token cookie
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.json({ msg: 'Account deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Admin routes (protected and authorized for admin only)

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', [protect, authorize('admin')], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', [protect, authorize('admin')], async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @desc    Update user (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', [protect, authorize('admin')], async (req, res) => {
  try {
    const { fullName, email, role, status } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.role = role || user.role;
    user.status = status || user.status;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', [protect, authorize('admin')], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // In a real app, you might want to soft delete the user
    // or mark their account as inactive instead of deleting it
    await user.remove();

    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @desc    Update user's wallet address
// @route   PUT /api/users/wallet
// @access  Public (since we're using localStorage userId)
router.put('/wallet', async (req, res) => {
  try {
    const { userId, walletAddress } = req.body;
    
    if (!userId || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'userId and walletAddress are required'
      });
    }
    
    // Update user with wallet address
    const user = await User.findByIdAndUpdate(
      userId,
      { walletAddress: walletAddress.toLowerCase() },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Wallet address updated successfully',
      data: {
        id: user._id,
        walletAddress: user.walletAddress
      }
    });
    
  } catch (error) {
    console.error('Error updating wallet address:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});



export default router;
