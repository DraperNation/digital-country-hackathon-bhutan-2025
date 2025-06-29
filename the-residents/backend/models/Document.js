import mongoose from 'mongoose';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const documentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    index: true
  },
  name: { 
    type: String, 
    required: true 
  },
  description: String,
  // URL to the file in storage (S3, local filesystem, etc.)
  url: { 
    type: String, 
    required: true 
  },
  // File metadata
  type: {
    type: String,
    enum: [
      'passport',
      'id_card',
      'proof_of_address',
      'bank_statement',
      'tax_document',
      'business_license',
      'photo',
      'signature',
      'other'
    ],
    required: true,
    index: true
  },
  originalName: {
    type: String,
    required: true
  },
  storagePath: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    index: true
  },
  mimeType: { 
    type: String, 
    required: true 
  },
  size: { 
    type: Number, 
    required: true 
  },
  // Document status
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'expired'],
    default: 'pending',
  },
  // Rejection details if document is rejected
  rejectionReason: String,
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: Date,
  // Verification details
  verifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  verifiedAt: Date,
  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  tags: [String],
  // Access control
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  // For documents that expire (like temporary uploads)
  expiresAt: {
    type: Date,
    index: { expires: 0 } // Automatically remove document when expiresAt is reached
  },
  // Document expiration date (different from expiresAt which is for temp storage)
  validUntil: {
    type: Date,
    index: true
  },
  // Document issue date
  issuedAt: {
    type: Date
  },
  // Document number (e.g., passport number)
  documentNumber: {
    type: String,
    index: true
  },
  // For versioning
  isLatest: {
    type: Boolean,
    default: true
  },
  previousVersion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  // For audit trail
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true 
});

// Indexes for faster querying
documentSchema.index({ user: 1, type: 1 });
documentSchema.index({ user: 1, status: 1 });
documentSchema.index({ application: 1, status: 1 });
documentSchema.index({ isPublic: 1 });
documentSchema.index({ tags: 1 });

// Text index for search
documentSchema.index(
  { 
    name: 'text',
    description: 'text',
    tags: 'text',
    'metadata.text': 'text'
  },
  {
    weights: {
      name: 10,
      description: 5,
      tags: 3,
      'metadata.text': 1
    }
  }
);

// Pre-save hook to handle versioning
documentSchema.pre('save', async function(next) {
  if (this.isNew && this.previousVersion) {
    // If this is an update to an existing document, mark the previous version as not latest
    await this.constructor.updateOne(
      { _id: this.previousVersion },
      { $set: { isLatest: false } }
    );
  }
  next();
});

// Soft delete method
documentSchema.methods.softDelete = async function(userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = userId;
  return this.save();
};

// Restore method
documentSchema.methods.restore = async function() {
  this.isDeleted = false;
  this.deletedAt = undefined;
  this.deletedBy = undefined;
  return this.save();
};

// Virtual for file extension
documentSchema.virtual('extension').get(function() {
  return path.extname(this.url).slice(1).toLowerCase();
});

// Virtual for file size in human-readable format
documentSchema.virtual('sizeFormatted').get(function() {
  if (this.size < 1024) return `${this.size} bytes`;
  if (this.size < 1024 * 1024) return `${(this.size / 1024).toFixed(1)} KB`;
  return `${(this.size / (1024 * 1024)).toFixed(1)} MB`;
});

// Method to get public URL (in a real app, this would sign the URL if using S3)
documentSchema.methods.getPublicUrl = function() {
  if (this.isPublic) {
    return this.url; // In production, this would be a signed URL
  }
  return null;
};

// Static method to find documents by user with pagination
documentSchema.statics.findByUser = async function(userId, options = {}) {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
  const skip = (page - 1) * limit;
  
  const [items, total] = await Promise.all([
    this.find({ user: userId, isDeleted: false })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('application', 'referenceNumber type status')
      .populate('verifiedBy', 'fullName email'),
    this.countDocuments({ user: userId, isDeleted: false })
  ]);
  
  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPreviousPage: page > 1
  };
};

// Method to verify a document
documentSchema.methods.verify = async function(userId, notes = '') {
  this.status = 'verified';
  this.verifiedBy = userId;
  this.verifiedAt = new Date();
  this.verificationNotes = notes;
  return this.save();
};

// Method to reject a document
documentSchema.methods.reject = async function(userId, reason) {
  this.status = 'rejected';
  this.rejectedBy = userId;
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
  return this.save();
};

// Pre-save hook to handle file metadata
documentSchema.pre('save', function(next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  
  // Generate a unique filename if not provided
  if (this.isNew && !this.url) {
    const ext = path.extname(this.originalName || 'file');
    this.url = `/uploads/documents/${uuidv4()}${ext}`;
  }
  
  next();
});

// Text index for search
documentSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  'metadata.text': 'text'
});

// Compound indexes for common queries
documentSchema.index({ user: 1, status: 1 });
documentSchema.index({ application: 1, type: 1 });
documentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Enable virtuals for toJSON and toObject
documentSchema.set('toJSON', { virtuals: true });
documentSchema.set('toObject', { virtuals: true });

// Soft delete method
documentSchema.methods.softDelete = async function(userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = userId;
  return this.save();
};

// Restore method
documentSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = undefined;
  this.deletedBy = undefined;
  return this.save();
};

// Query helper for non-deleted documents
documentSchema.query.notDeleted = function() {
  return this.where({ isDeleted: { $ne: true } });
};

const Document = mongoose.model('Document', documentSchema);

export default Document;
