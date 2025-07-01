import express from 'express';
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('type', 'Application type is required').not().isEmpty(),
      check('data', 'Application data is required').isObject(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { type, data, documents } = req.body;

      // Create application
      const application = new Application({
        user: req.user.id,
        type,
        data,
        documents: documents || [],
        status: 'submitted',
        submittedAt: Date.now()
      });

      await application.save();

      // Add application to user's applications
      await User.findByIdAndUpdate(
        req.user.id,
        { $push: { applications: application._id } },
        { new: true }
      );

      res.status(201).json(application);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = { user: req.user.id };
    
    // If admin, get all applications
    if (req.user.role === 'admin') {
      query = {};
    }
    
    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .populate('user', ['fullName', 'email']);
      
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('user', ['fullName', 'email'])
      .populate('reviewedBy', ['fullName', 'email']);

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    // Make sure user owns the application or is admin
    if (application.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(application);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Application not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { data, status, reviewNotes } = req.body;
    
    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    // Make sure user owns the application or is admin
    if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update fields
    if (data) application.data = { ...application.data, ...data };
    
    // Only allow status update for admin
    if (status && req.user.role === 'admin') {
      application.status = status;
      application.reviewedBy = req.user.id;
      application.reviewedAt = Date.now();
      
      if (reviewNotes) {
        application.reviewNotes = reviewNotes;
      }
    }

    await application.save();

    // Populate user and reviewedBy fields before sending response
    application = await Application.populate(application, [
      { path: 'user', select: 'fullName email' },
      { path: 'reviewedBy', select: 'fullName email' }
    ]);

    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    // Make sure user owns the application or is admin
    if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await application.remove();

    res.json({ msg: 'Application removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Application not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @desc    Upload document to application
// @route   POST /api/applications/:id/documents
// @access  Private
router.post('/:id/documents', protect, async (req, res) => {
  try {
    const { name, url, type, size } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    // Make sure user owns the application or is admin
    if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // In a real app, you would handle file upload here
    // For now, we'll just accept a URL
    const newDoc = {
      name,
      url,
      type,
      size,
      uploadedAt: Date.now()
    };

    application.documents.unshift(newDoc);
    await application.save();

    res.json(application.documents[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Delete document from application
// @route   DELETE /api/applications/:id/documents/:docId
// @access  Private
router.delete('/:id/documents/:docId', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    // Make sure user owns the application or is admin
    if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Find the document index
    const docIndex = application.documents.findIndex(
      doc => doc._id.toString() === req.params.docId
    );

    if (docIndex === -1) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    // Remove the document
    application.documents.splice(docIndex, 1);
    await application.save();

    res.json({ msg: 'Document removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Application or document not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Admin routes for managing all applications

// @desc    Update application status (admin)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
router.put(
  '/:id/status',
  [
    protect,
    authorize('admin'),
    [
      check('status', 'Status is required').not().isEmpty(),
      check('reviewNotes', 'Review notes are required for rejections')
        .if((req) => req.body.status === 'rejected')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { status, reviewNotes } = req.body;

      let application = await Application.findById(req.params.id);

      if (!application) {
        return res.status(404).json({ msg: 'Application not found' });
      }

      // Update status and review info
      application.status = status;
      application.reviewedBy = req.user.id;
      application.reviewedAt = Date.now();
      
      if (reviewNotes) {
        application.reviewNotes = reviewNotes;
      }

      await application.save();

      // Populate user and reviewedBy fields before sending response
      application = await Application.populate(application, [
        { path: 'user', select: 'fullName email' },
        { path: 'reviewedBy', select: 'fullName email' }
      ]);

      res.json(application);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @desc    Get application statistics
// @route   GET /api/applications/stats/overview
// @access  Private/Admin
router.get('/stats/overview', [protect, authorize('admin')], async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          applications: { $push: '$$ROOT' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const total = stats.reduce((acc, curr) => acc + curr.count, 0);

    // Get counts by application type
    const byType = await Application.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get monthly applications for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    res.json({
      total,
      byStatus: stats,
      byType,
      monthlyStats
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
