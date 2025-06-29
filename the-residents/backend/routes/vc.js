import express from 'express';
import { 
  generateVC, 
  getUserVC, 
  verifyVC, 
  getVCStatus, 
  revokeVC, 
  listAllVCs 
} from '../controllers/vcController.js';

const router = express.Router();

// Public routes
router.get('/verify/:vcId', verifyVC);
router.get('/status/:vcId', getVCStatus);

// User routes (should be protected in production)
router.get('/:userId', getUserVC);
router.post('/generate/:userId', generateVC);

// Admin routes (should be protected with admin middleware in production)
router.get('/admin/list', listAllVCs);
router.put('/revoke/:vcId', revokeVC);

export default router; 