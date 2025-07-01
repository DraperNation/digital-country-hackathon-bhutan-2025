import { Router } from 'express';
import { getAuditLogs } from '../controllers/iamController.js';

const router = Router();
router.get('/logs', getAuditLogs);

export default router;
