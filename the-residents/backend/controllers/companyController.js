import asyncHandler from 'express-async-handler';
import Company from '../models/Company.js';
import User from '../models/User.js';
import Kyc from '../models/Kyc.js';
import { generateCompanyIncorporationCertificate, getCertificatePath } from '../utils/certificateGenerator.js';
import path from 'path';

// @desc    Register a new company/entity
// @route   POST /api/company/register
// @access  Public (but requires valid user)
export const registerCompany = asyncHandler(async (req, res) => {
  const {
    companyName,
    companyType,
    businessActivity,
    jurisdiction,
    virtualOfficeOptIn,
    owner,
    ownerDirector,
    coFounders,
    governanceModel,
    bylawsFile,
    termsAccepted,
    bitcoinAddress,
    paymentConfirmed
  } = req.body;

  // Validate required fields
  if (!companyName || !companyType || !businessActivity || !owner || !ownerDirector || !governanceModel) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  if (!termsAccepted) {
    return res.status(400).json({
      success: false,
      message: 'You must accept the terms and conditions'
    });
  }

  try {
    // Verify user exists and has approved KYC
    const user = await User.findById(owner);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has approved KYC
    const kyc = await Kyc.findOne({ user: owner });
    if (!kyc || kyc.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'KYC verification required before company registration'
      });
    }

    // Check if user already has a registered company
    const existingCompany = await Company.findOne({ owner });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'User already has a registered company',
        company: existingCompany
      });
    }

    // Create new company
    const companyData = {
      companyName,
      companyType,
      businessActivity,
      jurisdiction: jurisdiction || 'Bhutan',
      virtualOfficeOptIn: virtualOfficeOptIn || false,
      owner,
      ownerDirector,
      coFounders: coFounders || [],
      governanceModel,
      bylawsFile,
      termsAccepted,
      bitcoinAddress,
      paymentConfirmed: paymentConfirmed || false
    };

    const company = await Company.create(companyData);

    // Auto-approve for demo purposes and generate certificate
    setTimeout(async () => {
      try {
        console.log('Auto-approving company incorporation for demo purposes...');
        
        // Update status to active
        company.status = 'Active';
        company.incorporationDate = new Date();
        await company.save();

        // Generate incorporation certificate
        const certificateData = await generateCompanyIncorporationCertificate({
          companyName: company.companyName,
          registrationNumber: company.registrationNumber,
          taxId: company.taxId,
          ownerDirector: company.ownerDirector,
          businessActivity: company.businessActivity,
          jurisdiction: company.jurisdiction,
          incorporationDate: company.incorporationDate,
          address: company.address,
          companyType: company.companyType,
          governanceModel: company.governanceModel
        });

        // Update company with certificate info
        company.certificateGenerated = true;
        company.certificatePath = certificateData.certificatePath;
        company.certificateHash = certificateData.certificateHash;
        company.certificateGeneratedAt = new Date();
        await company.save();

        console.log(`Company ${company.companyName} incorporated with Tax ID: ${company.taxId}`);
        console.log(`Certificate generated: ${company.certificatePath}`);
      } catch (error) {
        console.error('Error in auto-approval process:', error);
      }
    }, 3000); // 3 second delay for demo effect

    // Populate owner information
    await company.populate('owner', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      data: company
    });

  } catch (error) {
    console.error('Company registration error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Company with this ${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during company registration',
      error: error.message
    });
  }
});

// @desc    Get company by user ID
// @route   GET /api/company/user/:userId
// @access  Public
// @desc    Get all companies for a user
// @route   GET /api/company/user/:userId/all
// @access  Public
export const getAllUserCompanies = asyncHandler(async (req, res) => {
  try {
    const companies = await Company.find({ owner: req.params.userId })
      .select('-__v -updatedAt')
      .populate('owner', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    console.error('Get all companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get company by user ID
// @route   GET /api/company/user/:userId
// @access  Public
export const getCompanyByUser = asyncHandler(async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.params.userId })
      .populate('owner', 'fullName email');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'No company found for this user'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get company by registration number
// @route   GET /api/company/registration/:regNumber
// @access  Public
export const getCompanyByRegistration = asyncHandler(async (req, res) => {
  try {
    const company = await Company.findOne({ registrationNumber: req.params.regNumber })
      .populate('owner', 'fullName email');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Get company by registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get company status
// @route   GET /api/company/status/:companyId
// @access  Public
export const getCompanyStatus = asyncHandler(async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: {
        _id: company._id,
        companyName: company.companyName,
        status: company.status,
        taxId: company.taxId,
        incorporationDate: company.incorporationDate,
        certificateGenerated: company.certificateGenerated,
        registrationNumber: company.registrationNumber,
        address: company.address,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt
      }
    });
  } catch (error) {
    console.error('Get company status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Download company certificate
// @route   GET /api/company/certificate/:companyId
// @access  Public
export const downloadCertificate = asyncHandler(async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (!company.certificateGenerated || !company.certificatePath) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not available yet. Please wait for incorporation to complete.'
      });
    }

    const filePath = getCertificatePath(company.certificatePath);
    
    // Check if file exists
    if (!require('fs').existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Certificate file not found'
      });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="incorporation-certificate-${company.companyName.replace(/\s+/g, '-')}.pdf"`);
    
    // Send file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download certificate',
      error: error.message
    });
  }
});

// @desc    Regenerate company certificate
// @route   POST /api/company/regenerate-certificate/:companyId
// @access  Public
export const regenerateCertificate = asyncHandler(async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'Company must be active to regenerate certificate'
      });
    }

    // Generate new certificate
    const certificateData = await generateCompanyIncorporationCertificate({
      companyName: company.companyName,
      registrationNumber: company.registrationNumber,
      taxId: company.taxId,
      ownerDirector: company.ownerDirector,
      businessActivity: company.businessActivity,
      jurisdiction: company.jurisdiction,
      incorporationDate: company.incorporationDate,
      address: company.address,
      companyType: company.companyType,
      governanceModel: company.governanceModel
    });

    // Update company with new certificate info
    company.certificatePath = certificateData.certificatePath;
    company.certificateHash = certificateData.certificateHash;
    company.certificateGenerated = true;
    company.certificateGeneratedAt = new Date();
    await company.save();

    res.json({
      success: true,
      message: 'Certificate regenerated successfully',
      data: {
        certificateGenerated: true,
        certificateHash: company.certificateHash,
        certificateGeneratedAt: company.certificateGeneratedAt
      }
    });
  } catch (error) {
    console.error('Regenerate certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate certificate',
      error: error.message
    });
  }
});

// @desc    Update company information
// @route   PUT /api/company/:companyId
// @access  Private (company owner only)
export const updateCompany = asyncHandler(async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'companyName', 'businessActivity', 'virtualOfficeOptIn', 
      'coFounders', 'governanceModel', 'bylawsFile', 'bitcoinAddress'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field];
      }
    });

    await company.save();

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get all companies (admin only)
// @route   GET /api/company/all
// @access  Private (admin)
export const getAllCompanies = asyncHandler(async (req, res) => {
  try {
    const companies = await Company.find({})
      .populate('owner', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    console.error('Get all companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Delete company
// @route   DELETE /api/company/:companyId
// @access  Private (company owner only)
export const deleteCompany = asyncHandler(async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    await Company.findByIdAndDelete(req.params.companyId);

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});
