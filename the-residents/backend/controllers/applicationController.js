import Application from '../models/Application.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
export const createApplication = asyncHandler(async (req, res) => {
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
});

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
export const getApplications = asyncHandler(async (req, res) => {
  let query = { user: req.user.id };
  
  // If admin, get all applications
  if (req.user.role === 'admin') {
    query = {};
  }
  
  const applications = await Application.find(query)
    .sort({ createdAt: -1 })
    .populate('user', ['fullName', 'email']);
    
  res.json(applications);
});

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
export const getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('user', ['fullName', 'email'])
    .populate('reviewedBy', ['fullName', 'email']);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Make sure user owns the application or is admin
  if (application.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(application);
});

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
export const updateApplication = asyncHandler(async (req, res) => {
  const { data, status, reviewNotes } = req.body;
  
  let application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Make sure user owns the application or is admin
  if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized');
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
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Make sure user owns the application or is admin
  if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized');
  }

  await application.deleteOne();

  res.json({ msg: 'Application removed' });
});

// @desc    Upload document to application
// @route   POST /api/applications/:id/documents
// @access  Private
export const uploadDocument = asyncHandler(async (req, res) => {
  const { name, url, type, size } = req.body;

  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Make sure user owns the application or is admin
  if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized');
  }

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
});

// @desc    Delete document from application
// @route   DELETE /api/applications/:id/documents/:docId
// @access  Private
export const deleteDocument = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Make sure user owns the application or is admin
  if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Find the document index
  const docIndex = application.documents.findIndex(
    doc => doc._id.toString() === req.params.docId
  );

  if (docIndex === -1) {
    res.status(404);
    throw new Error('Document not found');
  }

  // Remove the document
  application.documents.splice(docIndex, 1);
  await application.save();

  res.json({ msg: 'Document removed' });
});

// @desc    Update application status (admin)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, reviewNotes } = req.body;

  let application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
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
});

// @desc    Get application statistics
// @route   GET /api/applications/stats/overview
// @access  Private/Admin
export const getApplicationStats = asyncHandler(async (req, res) => {
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
});
