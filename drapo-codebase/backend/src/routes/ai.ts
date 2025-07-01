import express from 'express';
import {
  createChatSession,
  sendMessage,
  getChatHistory,
  deleteChatSession,
  getLegalGuidance,
  getDzongkhaTranslation,
} from '../controllers/aiController.js';

const router = express.Router();

// Create a new chat session
router.post('/session', createChatSession);

// Send a message to the AI
router.post('/message', sendMessage);

// Get legal guidance
router.post('/legal', getLegalGuidance);

// Get Dzongkha translation and cultural services
router.post('/dzongkha', getDzongkhaTranslation);

// Get chat history for a session
router.get('/session/:sessionId', getChatHistory);

// Delete a chat session
router.delete('/session/:sessionId', deleteChatSession);

export default router;
