import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firebaseUID: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  companyType: {
    type: String,
    required: true,
    enum: ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship']
  },
  incorporationDate: {
    type: Date,
    required: true
  },
  taxID: {
    type: String,
    required: true,
    unique: true
  },
  businessAddress: {
    address: String,
    city: String,
    country: String,
    postalCode: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  certificateGenerated: {
    type: Boolean,
    default: false
  },
  certificateURL: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Company', companySchema);