import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    passportNumber: { type: String, required: true },
    selfieUrl: { type: String },   // path or URL to uploaded selfie
    address: { type: String },
    country: { type: String},
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Kyc', kycSchema);
