import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  register,
  login,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { casbinMiddleware } from '../middleware/casbin.js';

const router = Router();

router.put('/:id', authenticate, casbinMiddleware('user', 'manage'), updateUser);
router.delete('/:id', authenticate, casbinMiddleware('user', 'manage'), deleteUser);

router.get('/', authenticate, casbinMiddleware('user', 'view'), getUsers);
router.get('/:id', authenticate, casbinMiddleware('user', 'view'), getUserById);

// Registration and login remain public
router.post('/register', register);
router.post('/login', login);

export default router;
