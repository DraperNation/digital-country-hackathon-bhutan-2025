import express from 'express';
import {
  getAllKycSubmissions,
  approveKyc,
  rejectKyc,
  getAllCompanies,
  getDashboardStats,
  getAuditLogs
} from '../controllers/adminController.js';

const router = express.Router();

// Dashboard statistics
router.get('/stats', getDashboardStats);

// KYC management
router.get('/kyc', getAllKycSubmissions);
router.post('/kyc/:id/approve', approveKyc);
router.post('/kyc/:id/reject', rejectKyc);

// Company management
router.get('/companies', getAllCompanies);

// Audit logs
router.get('/logs', getAuditLogs);

export default router; 