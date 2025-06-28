import { Router } from 'express';
import { getUserNotifications } from '../controllers/userController.js';

const router = Router();

router.get('/:userId', getUserNotifications);

export default router;
