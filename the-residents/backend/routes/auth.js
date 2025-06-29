import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  logout, 
  protect 
} from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// Get user by ID
router.get('/me/:userId', getMe);

export default router;
