import admin from '../config/firebase.js';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Find or create user in database
    let user = await User.findOne({ firebaseUID: decodedToken.uid });
    
    if (!user) {
      user = new User({
        firebaseUID: decodedToken.uid,
        name: decodedToken.name || 'User',
        email: decodedToken.email,
        role: 'user'
      });
      await user.save();
    }

    req.user = user;
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const requireKYCVerified = (req, res, next) => {
  if (req.user.kycStatus !== 'verified') {
    return res.status(403).json({ 
      message: 'KYC verification required',
      kycStatus: req.user.kycStatus 
    });
  }
  next();
};