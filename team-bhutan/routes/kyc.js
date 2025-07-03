import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import KYCApplication from '../models/KYCApplication.js';
import User from '../models/User.js';

const router = express.Router();

// Submit KYC application
router.post('/', authenticateToken, upload.fields([
  { name: 'passportImage', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      fullName,
      nationality,
      passportNumber,
      dateOfBirth,
      address,
      city,
      country,
      postalCode
    } = req.body;

    // Check if user already has a KYC application
    const existingApplication = await KYCApplication.findOne({
      firebaseUID: req.user.firebaseUID
    });

    if (existingApplication && existingApplication.status !== 'rejected') {
      return res.status(400).json({ 
        message: 'KYC application already exists' 
      });
    }

    // Create new KYC application
    const kycApplication = new KYCApplication({
      userID: req.user._id,
      firebaseUID: req.user.firebaseUID,
      personalInfo: {
        fullName,
        nationality,
        passportNumber,
        dateOfBirth: new Date(dateOfBirth)
      },
      addressInfo: {
        address,
        city,
        country,
        postalCode
      },
      documents: {
        passportImageURL: req.files?.passportImage?.[0]?.path || '',
        addressProofURL: req.files?.addressProof?.[0]?.path || ''
      }
    });

    await kycApplication.save();

    // Update user KYC status
    await User.findByIdAndUpdate(req.user._id, {
      kycStatus: 'pending'
    });

    res.status(201).json({
      message: 'KYC application submitted successfully',
      application: kycApplication
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user's KYC status
router.get('/', authenticateToken, async (req, res) => {
  try {
    const application = await KYCApplication.findOne({
      firebaseUID: req.user.firebaseUID
    }).sort({ createdAt: -1 });

    res.json({
      kycStatus: req.user.kycStatus,
      application: application || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all KYC applications (Admin only)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = status ? { status } : {};
    
    const applications = await KYCApplication.find(query)
      .populate('userID', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await KYCApplication.countDocuments(query);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update KYC application status (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be "verified" or "rejected"' 
      });
    }

    const application = await KYCApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'KYC application not found' });
    }

    // Update application
    application.status = status;
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    
    if (status === 'rejected' && rejectionReason) {
      application.rejectionReason = rejectionReason;
    }

    await application.save();

    // Update user KYC status
    await User.findByIdAndUpdate(application.userID, {
      kycStatus: status
    });

    res.json({
      message: `KYC application ${status} successfully`,
      application
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;