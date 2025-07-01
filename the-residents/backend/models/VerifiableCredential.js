import mongoose from 'mongoose';

const VerifiableCredentialSchema = new mongoose.Schema({
  // W3C VC Standard fields
  context: [{
    type: String,
    default: 'https://www.w3.org/2018/credentials/v1'
  }],
  type: [{
    type: String,
    default: ['VerifiableCredential', 'eResidencyCredential']
  }],
  issuer: {
    type: String,
    default: 'did:bt:gov'
  },
  issuanceDate: {
    type: Date,
    default: Date.now
  },
  expirationDate: {
    type: Date,
    // Set expiration to 5 years from issuance
    default: () => new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000)
  },
  
  // Credential Subject
  credentialSubject: {
    id: {
      type: String,
      required: true // did:bt:user:userId
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'Bhutan'
    },
    residencyStatus: {
      type: String,
      enum: ['approved', 'active', 'suspended', 'revoked'],
      default: 'approved'
    },
    passportNumber: String,
    kycVerified: {
      type: Boolean,
      default: true
    },
    zkReady: {
      type: Boolean,
      default: true
    }
  },
  
  // Cryptographic proof (mocked for demo)
  proof: {
    type: {
      type: String,
      default: 'Ed25519Signature2020'
    },
    created: {
      type: Date,
      default: Date.now
    },
    proofPurpose: {
      type: String,
      default: 'assertionMethod'
    },
    verificationMethod: {
      type: String,
      default: 'did:bt:gov#key-1'
    },
    jws: String // Mock signature
  },
  
  // Internal fields
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kyc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kyc',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'revoked', 'suspended'],
    default: 'active'
  },
  vcId: {
    type: String,
    unique: true
  },
  hash: String // SHA-256 hash of the VC for integrity
}, {
  timestamps: true
});

// Generate VC ID before saving
VerifiableCredentialSchema.pre('save', function(next) {
  if (!this.vcId) {
    this.vcId = `vc:bt:${this.user}:${Date.now()}`;
  }
  next();
});

// Method to get W3C compliant VC JSON
VerifiableCredentialSchema.methods.toW3CFormat = function() {
  return {
    '@context': this.context,
    type: this.type,
    issuer: this.issuer,
    issuanceDate: this.issuanceDate.toISOString(),
    expirationDate: this.expirationDate.toISOString(),
    credentialSubject: {
      id: this.credentialSubject.id,
      name: this.credentialSubject.name,
      email: this.credentialSubject.email,
      country: this.credentialSubject.country,
      residencyStatus: this.credentialSubject.residencyStatus,
      passportNumber: this.credentialSubject.passportNumber,
      kycVerified: this.credentialSubject.kycVerified,
      zkReady: this.credentialSubject.zkReady
    },
    proof: this.proof,
    // Additional metadata
    id: this.vcId,
    credentialStatus: {
      id: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/vc/status/${this.vcId}`,
      type: 'RevocationList2020Status'
    }
  };
};

export default mongoose.model('VerifiableCredential', VerifiableCredentialSchema);