import { Router } from 'express';
import upload from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';
import { casbinMiddleware } from '../middleware/casbin.js';
import {
  submitKYC,
  getKycById,
  getAllKYC,
  getUserKYC,
  updateKYCStatus,
  getKYCStatusHistory,
  getUserNotifications,
} from '../controllers/kycController.js';

const router = Router();

router.post(
  '/',
  authenticate,
  casbinMiddleware('kyc', 'submit'),
  upload.fields([
    { name: 'passport', maxCount: 1 },
    { name: 'nationalId', maxCount: 1 },
    { name: 'proofOfAddress', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'fingerprintScan', maxCount: 1 },
    { name: 'fingerprintImage', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
    { name: 'otherDocuments', maxCount: 10 }, // allow up to 10 other docs
  ]),
  submitKYC
);

router.get('/', authenticate, casbinMiddleware('kyc', 'view'), getAllKYC);
router.get('/:id', authenticate, casbinMiddleware('kyc', 'view'), getKycById);
router.get('/user/:userId', authenticate, casbinMiddleware('kyc', 'view'), getUserKYC);
router.patch('/:id', authenticate, casbinMiddleware('kyc', 'review'), updateKYCStatus);
router.get('/:kycId/history', authenticate, casbinMiddleware('kyc', 'view'), getKYCStatusHistory);
router.get(
  '/notifications/:userId',
  authenticate,
  casbinMiddleware('notification', 'view'),
  getUserNotifications
);

export default router;
