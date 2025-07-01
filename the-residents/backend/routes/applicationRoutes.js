import express from 'express';
import { check } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  uploadDocument,
  deleteDocument,
  updateApplicationStatus,
  getApplicationStats
} from '../controllers/applicationController.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

// Routes
router
  .route('/')
  .post(
    [
      check('type', 'Application type is required').not().isEmpty(),
      check('data', 'Application data is required').isObject()
    ],
    createApplication
  )
  .get(getApplications);

router
  .route('/:id')
  .get(getApplication)
  .put(updateApplication)
  .delete(deleteApplication);

router
  .route('/:id/documents')
  .post(uploadDocument);

router
  .route('/:id/documents/:docId')
  .delete(deleteDocument);

// Admin routes
router.use(authorize('admin'));

router
  .route('/:id/status')
  .put(
    [
      check('status', 'Status is required').not().isEmpty(),
      check('reviewNotes', 'Review notes are required for rejections')
        .if((req) => req.body.status === 'rejected')
        .not()
        .isEmpty()
    ],
    updateApplicationStatus
  );

router
  .route('/stats/overview')
  .get(getApplicationStats);

export default router;
