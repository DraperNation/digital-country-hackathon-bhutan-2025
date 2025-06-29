import { Router } from 'express';
import { AppController } from '../controllers/appController.js';

const router = Router();
const appController = new AppController();

/**
 * Unified tool execution endpoint
 * Handles both calculator tools (no auth) and GitHub tools (with auth)
 * The controller determines authentication requirements based on tool type
 */
router.post('/tools/:toolName', appController.handleTool.bind(appController));

export default router; 