import mongoose from 'mongoose';

const kycApplicationSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firebaseUID: {
    type: String,
    required: true
  },
  personalInfo: {
    fullName: {
      type: String,
      required: true
    },
    nationality: {
      type: String,
      required: true
    },
    passportNumber: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    }
  },
  addressInfo: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    postalCode: {
      type: String
    }
  },
  documents: {
    passportImageURL: {
      type: String,
      required: true
    },
    addressProofURL: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('KYCApplication', kycApplicationSchema);