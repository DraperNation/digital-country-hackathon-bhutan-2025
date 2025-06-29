import express from 'express';
import {
  registerCompany,
  getCompanyByUser,
  getCompanyByRegistration,
  updateCompany,
  getAllCompanies,
  deleteCompany,
  getAllUserCompanies,
  getCompanyStatus,
  downloadCertificate,
  regenerateCertificate
} from '../controllers/companyController.js';

const router = express.Router();

// @route   POST /api/company/register
// @desc    Register a new company/entity
// @access  Public (but requires valid user with approved KYC)
router.post('/register', registerCompany);

// @route   GET /api/company/user/:userId/all
// @desc    Get all companies for a user
// @access  Public
router.get('/user/:userId/all', getAllUserCompanies);

// @route   GET /api/company/user/:userId
// @desc    Get company by user ID
// @access  Public
router.get('/user/:userId', getCompanyByUser);

// @route   GET /api/company/registration/:regNumber
// @desc    Get company by registration number
// @access  Public
router.get('/registration/:regNumber', getCompanyByRegistration);

// @route   GET /api/company/status/:companyId
// @desc    Get company status
// @access  Public
router.get('/status/:companyId', getCompanyStatus);

// @route   GET /api/company/certificate/:companyId
// @desc    Download company certificate
// @access  Public
router.get('/certificate/:companyId', downloadCertificate);

// @route   POST /api/company/regenerate-certificate/:companyId
// @desc    Regenerate company certificate
// @access  Public
router.post('/regenerate-certificate/:companyId', regenerateCertificate);

// @route   PUT /api/company/:companyId
// @desc    Update company information
// @access  Private (company owner only)
router.put('/:companyId', updateCompany);

// @route   GET /api/company/all
// @desc    Get all companies (admin only)
// @access  Private (admin)
router.get('/all', getAllCompanies);

// @route   DELETE /api/company/:companyId
// @desc    Delete company
// @access  Private (company owner only)
router.delete('/:companyId', deleteCompany);

export default router; 