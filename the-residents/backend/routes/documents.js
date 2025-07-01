import express from 'express';
import { check, validationResult } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import Document from '../models/Document.js';
import User from '../models/User.js';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// File filter to accept only certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, PNG, and Word documents are allowed.'), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// @desc    Upload a document
// @route   POST /api/documents/upload
// @access  Private
router.post(
  '/upload',
  protect,
  upload.single('file'),
  [
    check('type', 'Document type is required').not().isEmpty(),
    check('name', 'Document name is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Clean up the uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'Please upload a file' });
      }

      const { type, name, description, tags, isPublic } = req.body;

      // Create document record
      const document = new Document({
        user: req.user.id,
        name,
        description: description || '',
        url: `/uploads/${req.file.filename}`,
        type,
        mimeType: req.file.mimetype,
        size: req.file.size,
        status: 'pending',
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        isPublic: isPublic === 'true',
        createdBy: req.user.id,
      });

      await document.save();

      // Add document to user's documents
      await User.findByIdAndUpdate(
        req.user.id,
        { $push: { documents: document._id } },
        { new: true }
      );

      res.status(201).json(document);
    } catch (err) {
      console.error(err.message);
      // Clean up the uploaded file if an error occurs
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).send('Server Error');
    }
  }
);

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = { user: req.user.id };
    
    // If admin, get all documents
    if (req.user.role === 'admin') {
      query = {};
    }
    
    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .populate('user', ['fullName', 'email']);
      
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('user', ['fullName', 'email'])
      .populate('verifiedBy', ['fullName', 'email']);

    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    // Make sure user owns the document or is admin
    if (document.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(document);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, description, tags, isPublic } = req.body;
    
    let document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    // Make sure user owns the document or is admin
    if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update fields
    if (name) document.name = name;
    if (description !== undefined) document.description = description;
    if (tags) document.tags = tags.split(',').map(tag => tag.trim());
    if (isPublic !== undefined) document.isPublic = isPublic === 'true';

    await document.save();

    // Populate user and verifiedBy fields before sending response
    document = await Document.populate(document, [
      { path: 'user', select: 'fullName email' },
      { path: 'verifiedBy', select: 'fullName email' }
    ]);

    res.json(document);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    // Make sure user owns the document or is admin
    if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Delete the file from the filesystem
    const filePath = path.join(__dirname, '..', document.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove the document record
    await document.remove();

    res.json({ msg: 'Document removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @desc    Download a document
// @route   GET /api/documents/download/:id
// @access  Private
router.get('/download/:id', protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    // Make sure user owns the document or is admin
    if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const filePath = path.join(__dirname, '..', document.url);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ msg: 'File not found' });
    }

    // Set appropriate headers for file download
    res.download(filePath, document.name + path.extname(document.url));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Admin routes for document management

// @desc    Update document status (admin)
// @route   PUT /api/documents/:id/status
// @access  Private/Admin
router.put(
  '/:id/status',
  [
    protect,
    authorize('admin'),
    [
      check('status', 'Status is required').not().isEmpty(),
      check('rejectionReason', 'Rejection reason is required for rejections')
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
      const { status, rejectionReason } = req.body;

      let document = await Document.findById(req.params.id);

      if (!document) {
        return res.status(404).json({ msg: 'Document not found' });
      }

      // Update status and verification info
      document.status = status;
      document.verifiedBy = req.user.id;
      document.verifiedAt = Date.now();
      
      if (status === 'rejected' && rejectionReason) {
        document.rejectionReason = rejectionReason;
        document.rejectedBy = req.user.id;
        document.rejectedAt = Date.now();
      } else if (status === 'verified') {
        document.rejectionReason = undefined;
        document.rejectedBy = undefined;
        document.rejectedAt = undefined;
      }

      await document.save();

      // Populate user and verifiedBy fields before sending response
      document = await Document.populate(document, [
        { path: 'user', select: 'fullName email' },
        { path: 'verifiedBy', select: 'fullName email' },
        { path: 'rejectedBy', select: 'fullName email' }
      ]);

      res.json(document);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @desc    Get document statistics
// @route   GET /api/documents/stats/overview
// @access  Private/Admin
router.get('/stats/overview', [protect, authorize('admin')], async (req, res) => {
  try {
    const stats = await Document.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const total = stats.reduce((acc, curr) => acc + curr.count, 0);
    const totalSize = stats.reduce((acc, curr) => acc + (curr.totalSize || 0), 0);

    // Get counts by document type
    const byType = await Document.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get monthly uploads for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Document.aggregate([
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
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    res.json({
      total,
      totalSize,
      byStatus: stats,
      byType,
      monthlyStats
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
