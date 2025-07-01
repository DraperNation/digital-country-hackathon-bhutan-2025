import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: { 
    type: String, 
    required: true, 
    select: false,
    minlength: [6, 'Password must be at least 6 characters long']
  },
  passportNumber: { 
    type: String, 
    // required: true, 

  },
  residencyType: { 
    type: String, 
    default: 'bhutan',
    // required: true 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetToken: String,
  resetTokenExpiry: Date,
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'delete', 'manage_users', 'manage_content'],
  }],
  lastLogin: Date,
  status: {
    type: String,
    enum: ['active', 'suspended', 'deactivated'],
    default: 'active'
  },
  // Wallet information
  walletAddress: {
    type: String,
    lowercase: true,
    sparse: true, // Allows multiple null values
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow null/undefined
        return /^0x[a-fA-F0-9]{40}$/.test(v); // Validate Ethereum address format
      },
      message: 'Invalid Ethereum wallet address format'
    }
  },
  // NFT information
  nftTokenId: String,
  nftContractAddress: String,
  eResidencyId: String,
  // Public directory settings
  publicProfile: { type: Boolean, default: false },
  publicName: { type: String }, // Custom name for public display
  publicWallet: { type: Boolean, default: false } // Whether to show wallet publicly
}, { 
  timestamps: true 
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Update timestamps on save
userSchema.pre('save', function(next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!candidatePassword || !this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user info without sensitive data
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetToken;
  delete user.resetTokenExpiry;
  delete user.verificationToken;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
