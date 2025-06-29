import mongoose from 'mongoose';

const residencySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  walletAddress: {
    type: String,
    required: true
  },
  tokenId: {
    type: String,
  },
  contractAddress: {
    type: String,
  },
  transactionHash: {
    type: String,
  },
  blockNumber: {
    type: Number,
  },
  blockHash: {
    type: String,
  },
  syncedFromBlockchain: {
    type: Boolean,
    default: false
  },
  metadata: {
    name: String,
    citizenshipCountry: String,
    eResidencyId: String,
    timestamp: String,
    description: String,
    image: String,
    attributes: [{
      trait_type: String,
      value: mongoose.Schema.Types.Mixed,
      display_type: String
    }]
  }
}, { timestamps: true });

export default mongoose.models.Residency || mongoose.model('Residency', residencySchema);
