import express from 'express';
import { submitKyc, getAllKyc, updateKycStatus, getKycStatus } from '../controllers/kycController.js';
import { kycUpload } from '../middleware/upload.js';
// import protect, authorize middlewares as needed

const router = express.Router();

// User routes
router.post('/submit', kycUpload.single('selfie'), submitKyc);
router.get('/status/:userId', getKycStatus);

// Admin routes
router.get('/admin', getAllKyc); // list submissions
// router.post('/admin/:id/approve', approveKyc);
// router.post('/admin/:id/reject', rejectKyc);

export default router;
