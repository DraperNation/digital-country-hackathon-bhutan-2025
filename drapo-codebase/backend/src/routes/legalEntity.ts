import { Router } from 'express';
import upload from '../middleware/upload.js';
import {
  reserveName,
  submitProposal,
  registerCompany,
  getAllEntities,
  removeDocument,
} from '../controllers/legalEntityController.js';
import { authenticate } from '../middleware/auth.js';
import { casbinMiddleware } from '../middleware/casbin.js';

const router = Router();

router.post('/reserve-name', upload.single('securityCertificate'), reserveName);
router.post('/submit-proposal', upload.single('proposal'), submitProposal);
router.post('/register', upload.array('registrationDocs', 5), registerCompany);
router.get('/', getAllEntities);
router.patch(
  '/:id/documents',
  authenticate,
  casbinMiddleware('legalEntity', 'update'),
  removeDocument
);

export default router;
