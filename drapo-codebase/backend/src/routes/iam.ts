import { Router } from 'express';
import {
  createRole,
  createScope,
  assignRoleToUser,
  removeRoleFromUser,
  assignScopeToRole,
  removeScopeFromRole,
  checkUserScope,
} from '../controllers/iamController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/role', authenticate, createRole);
router.post('/scope', authenticate, createScope);
router.post('/assign-role', authenticate, assignRoleToUser);
router.post('/remove-role', authenticate, removeRoleFromUser);
router.post('/assign-scope', authenticate, assignScopeToRole);
router.post('/remove-scope', authenticate, removeScopeFromRole);
router.post('/check-scope', authenticate, checkUserScope);

export default router;
