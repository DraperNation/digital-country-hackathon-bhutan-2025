import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Kyc from '../models/Kyc.js';
import { environment } from '../config/environment.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  // Get token from header or cookie
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, environment.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id).select('-password');
    
    // Check if user exists
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if user is active
    if (req.user.status !== 'active') {
      return res.status(401).json({ 
        success: false, 
        message: 'User account is not active' 
      });
    }

    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, token failed' 
    });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

// Generate JWT token
const signToken = (id) => {
  return jwt.sign(
    { id },
    environment.JWT_SECRET,
    { expiresIn: environment.JWT_EXPIRE }
  );
};

// Send JWT token in response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = signToken(user._id);
  const cookieExpireDays = parseInt(environment.JWT_COOKIE_EXPIRE) || 30;

  const options = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: environment.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user,
  });
};

// Login user
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide an email and password' 
    });
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Register user
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
      status: 'active'
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('Register error:', err);
    
    // Handle duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get user by ID with KYC data
export const getMe = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Find user and populate KYC data
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find KYC data for this user
    const kyc = await Kyc.findOne({ user: userId });

    // Format response
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      passportNumber: user.passportNumber,
      kyc: kyc ? {
        status: kyc.status,
        submittedAt: kyc.createdAt,
        selfieUrl: kyc.selfieUrl,
        address: kyc.address,
        country: kyc.country
      } : null,
      hasKyc: !!kyc,
      kycStatus: kyc?.status || 'not_submitted'
    };

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Logout user / clear cookie
export const logout = (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};
