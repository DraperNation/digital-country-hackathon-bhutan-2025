import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const applicationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: {
    type: String,
    enum: ['visa', 'company_registration', 'residency_renewal', 'other'],
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'in_review', 'additional_info_required', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'draft',
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  referenceNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  // General application data
  data: { 
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Application-specific fields
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Documents related to this application
  documents: [documentSchema],
  // Admin/Reviewer fields
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  reviewNotes: String,
  reviewedAt: Date,
  // Payment information
  payment: {
    amount: Number,
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    paymentMethod: String,
    paidAt: Date
  },
  // Tracking
  submittedAt: Date,
  completedAt: Date,
  // For applications that require follow-up
  followUpDate: Date,
  isArchived: { type: Boolean, default: false }
}, { 
  timestamps: true 
});

// Indexes for faster querying
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ type: 1, status: 1 });
applicationSchema.index({ 'payment.status': 1 });
applicationSchema.index({ followUpDate: 1 });

// Add a text index for search
applicationSchema.index(
  { 
    'data.fullName': 'text',
    'data.passportNumber': 'text',
    'data.referenceNumber': 'text',
    status: 'text'
  },
  { 
    weights: { 
      'data.fullName': 10,
      'data.passportNumber': 5,
      'data.referenceNumber': 5,
      status: 1
    }
  }
);

// Pre-save hook to handle status changes and reference number automatically
applicationSchema.pre('save', function(next) {
  // Generate reference number if not exists
  if (!this.referenceNumber && this.status === 'submitted') {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.referenceNumber = `APP-${year}${(date.getMonth() + 1).toString().padStart(2, '0')}-${random}`;
  }

  // Set submittedAt when status changes to submitted
  if (this.isModified('status')) {
    if (this.status === 'submitted' && !this.submittedAt) {
      this.submittedAt = new Date();
    }
    
    // Set completedAt for terminal states
    if (['approved', 'rejected', 'completed', 'cancelled'].includes(this.status)) {
      this.completedAt = new Date();
    }
    
    // Set inReviewAt when status changes to in_review
    if (this.status === 'in_review' && !this.inReviewAt) {
      this.inReviewAt = new Date();
    }
  }
  
  next();
});

// Add virtual for formatted application number
applicationSchema.virtual('applicationNumber').get(function() {
  const date = this.createdAt || new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const id = this._id.toString().slice(-6).toUpperCase();
  return `APP-${year}${month}-${id}`;
});

// Add method to get public view of application
applicationSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  
  // Remove sensitive fields
  delete obj.__v;
  delete obj.user?.password;
  delete obj.user?.resetToken;
  delete obj.user?.verificationToken;
  
  return obj;
};

// Add static method for pagination
applicationSchema.statics.paginate = async function(query, options) {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
  const skip = (page - 1) * limit;
  
  const [items, total] = await Promise.all([
    this.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('user', 'fullName email')
      .populate('reviewedBy', 'fullName email'),
    this.countDocuments(query)
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

// Add text search method
applicationSchema.statics.search = function(query) {
  return this.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

// Add pre-remove hook to clean up related documents
applicationSchema.pre('remove', async function(next) {
  // Implement any cleanup logic here
  // For example, remove related documents or update references
  next();
});

// Enable virtuals for toJSON and toObject
applicationSchema.set('toJSON', { virtuals: true });
applicationSchema.set('toObject', { virtuals: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
