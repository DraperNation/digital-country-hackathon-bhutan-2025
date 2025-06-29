import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  // User who performed the action (if authenticated)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  
  // IP address of the requester
  ipAddress: {
    type: String,
    index: true
  },
  
  // User agent string
  userAgent: String,
  
  // Action performed (e.g., 'login', 'document_upload', 'application_submit')
  action: {
    type: String,
    required: true,
    index: true
  },
  
  // Entity type that was affected (e.g., 'User', 'Application', 'Document')
  entityType: {
    type: String,
    index: true
  },
  
  // ID of the affected entity
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  
  // Additional metadata about the action
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Status of the action (success/failure)
  status: {
    type: String,
    enum: ['success', 'failure', 'pending'],
    default: 'success'
  },
  
  // Error details if the action failed
  error: {
    message: String,
    stack: String,
    code: String
  },
  
  // Request details
  request: {
    method: String,
    url: String,
    params: mongoose.Schema.Types.Mixed,
    query: mongoose.Schema.Types.Mixed,
    body: mongoose.Schema.Types.Mixed,
    headers: mongoose.Schema.Types.Mixed
  },
  
  // Response details
  response: {
    statusCode: Number,
    body: mongoose.Schema.Types.Mixed,
    headers: mongoose.Schema.Types.Mixed
  },
  
  // Timestamps
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  
  // Duration in milliseconds
  duration: Number
}, {
  timestamps: true,
  strict: false // Allow dynamic fields
});

// Indexes for common queries
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1, status: 1 });
auditLogSchema.index({ 'metadata.email': 1 });

// Virtual for duration calculation
auditLogSchema.virtual('durationMs').get(function() {
  if (this.startTime && this.endTime) {
    return this.endTime - this.startTime;
  }
  return null;
});

// Pre-save hook to calculate duration
auditLogSchema.pre('save', function(next) {
  if (this.isModified('endTime') && this.endTime && this.startTime) {
    this.duration = this.endTime - this.startTime;
  }
  next();
});

// Static method to log an action
auditLogSchema.statics.log = async function({
  user,
  action,
  entityType,
  entityId,
  metadata = {},
  request = {},
  response = {},
  status = 'success',
  error = null,
  ipAddress,
  userAgent
}) {
  const logData = {
    user: user?._id || user,
    action,
    entityType,
    entityId,
    metadata,
    request: {
      method: request.method,
      url: request.url,
      params: request.params,
      query: request.query,
      body: this.sanitizeObject(request.body),
      headers: this.sanitizeObject(request.headers)
    },
    response: {
      statusCode: response.statusCode,
      body: this.sanitizeObject(response.body),
      headers: this.sanitizeObject(response.headers)
    },
    status,
    ipAddress,
    userAgent,
    startTime: new Date()
  };

  if (error) {
    logData.error = {
      message: error.message,
      stack: error.stack,
      code: error.code
    };
  }

  return this.create(logData);
};

// Helper method to sanitize sensitive data
auditLogSchema.statics.sanitizeObject = function(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sensitiveFields = [
    'password',
    'newPassword',
    'currentPassword',
    'confirmPassword',
    'token',
    'accessToken',
    'refreshToken',
    'authorization',
    'apiKey',
    'creditCard',
    'cvv',
    'ssn',
    'socialSecurityNumber'
  ];
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (sensitiveFields.includes(key.toLowerCase())) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = this.sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Query helper for common filters
auditLogSchema.query.byUser = function(userId) {
  return this.where({ user: userId });
};

auditLogSchema.query.byAction = function(action) {
  return this.where({ action });
};

auditLogSchema.query.byEntity = function(entityType, entityId) {
  return this.where({ entityType, entityId });
};

auditLogSchema.query.byStatus = function(status) {
  return this.where({ status });
};

// Text index for search
auditLogSchema.index({
  action: 'text',
  'metadata.text': 'text',
  'request.url': 'text',
  'error.message': 'text'
});

// Enable virtuals for toJSON and toObject
auditLogSchema.set('toJSON', { virtuals: true });
auditLogSchema.set('toObject', { virtuals: true });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
