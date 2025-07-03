import express from 'express';
import { authenticateToken, requireKYCVerified } from '../middleware/auth.js';
import Company from '../models/Company.js';

const router = express.Router();

// Register a new company
router.post('/', authenticateToken, requireKYCVerified, async (req, res) => {
  try {
    const {
      companyName,
      companyType,
      businessAddress
    } = req.body;

    // Check if user already has a company
    const existingCompany = await Company.findOne({
      firebaseUID: req.user.firebaseUID
    });

    if (existingCompany) {
      return res.status(400).json({ 
        message: 'User already has a registered company' 
      });
    }

    // Generate unique tax ID
    const taxID = `BHU${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const company = new Company({
      userID: req.user._id,
      firebaseUID: req.user.firebaseUID,
      companyName,
      companyType,
      incorporationDate: new Date(),
      taxID,
      businessAddress
    });

    await company.save();

    res.status(201).json({
      message: 'Company registered successfully',
      company
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user's company
router.get('/', authenticateToken, async (req, res) => {
  try {
    const company = await Company.findOne({
      firebaseUID: req.user.firebaseUID
    });

    res.json({ company });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update company information
router.put('/', authenticateToken, requireKYCVerified, async (req, res) => {
  try {
    const updates = req.body;
    
    const company = await Company.findOneAndUpdate(
      { firebaseUID: req.user.firebaseUID },
      updates,
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({
      message: 'Company updated successfully',
      company
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate company certificate
router.post('/certificate', authenticateToken, requireKYCVerified, async (req, res) => {
  try {
    const company = await Company.findOne({
      firebaseUID: req.user.firebaseUID
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // In a real implementation, you would generate a PDF certificate here
    // For now, we'll just mark it as generated
    company.certificateGenerated = true;
    company.certificateURL = `certificates/${company.taxID}.pdf`;
    await company.save();

    res.json({
      message: 'Certificate generated successfully',
      certificateURL: company.certificateURL
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;