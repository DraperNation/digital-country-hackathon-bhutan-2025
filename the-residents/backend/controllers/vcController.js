import asyncHandler from 'express-async-handler';
import VerifiableCredential from '../models/VerifiableCredential.js';
import User from '../models/User.js';
import Kyc from '../models/Kyc.js';
import { generateCompleteVC, generateVCHash, generateUserDID } from '../utils/vcGenerator.js';

// @desc    Generate VC for approved KYC
// @route   POST /api/vc/generate/:userId
// @access  Private (Admin or automatic on KYC approval)
export const generateVC = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  // Find user and their approved KYC
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const kyc = await Kyc.findOne({ user: userId, status: 'approved' });
  if (!kyc) {
    return res.status(400).json({ 
      message: 'No approved KYC found for this user' 
    });
  }
  
  // Check if VC already exists
  const existingVC = await VerifiableCredential.findOne({ user: userId, status: 'active' });
  if (existingVC) {
    return res.status(400).json({ 
      message: 'Active Verifiable Credential already exists for this user',
      vc: existingVC.toW3CFormat()
    });
  }
  
  try {
    // Generate the W3C compliant VC
    const vcData = generateCompleteVC(user, kyc);
    const vcHash = generateVCHash(vcData);
    
    // Generate vcId
    const vcId = `vc:bt:${userId}:${Date.now()}`;
    
    // Save to database
    const newVC = await VerifiableCredential.create({
      context: vcData['@context'],
      type: vcData.type,
      issuer: vcData.issuer,
      issuanceDate: new Date(vcData.issuanceDate),
      credentialSubject: {
        id: vcData.credentialSubject.id,
        name: vcData.credentialSubject.name,
        email: vcData.credentialSubject.email,
        country: vcData.credentialSubject.country,
        residencyStatus: vcData.credentialSubject.residencyStatus,
        passportNumber: vcData.credentialSubject.passportNumber,
        kycVerified: vcData.credentialSubject.kycVerified,
        zkReady: vcData.credentialSubject.zkReady
      },
      proof: vcData.proof,
      user: userId,
      kyc: kyc._id,
      hash: vcHash,
      vcId: vcId
    });
    
    res.status(201).json({
      message: 'Verifiable Credential generated successfully',
      vc: newVC.toW3CFormat(),
      vcId: newVC.vcId
    });
    
  } catch (error) {
    console.error('Error generating VC:', error);
    res.status(500).json({ 
      message: 'Failed to generate Verifiable Credential',
      error: error.message 
    });
  }
});

// @desc    Get user's VC
// @route   GET /api/vc/:userId
// @access  Private
export const getUserVC = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  try {
    const vc = await VerifiableCredential.findOne({ 
      user: userId, 
      status: 'active' 
    }).populate('user', 'fullName email').populate('kyc', 'status submittedAt');
    
    if (!vc) {
      return res.status(404).json({ 
        message: 'No active Verifiable Credential found for this user',
        hasVC: false
      });
    }
    
    res.status(200).json({
      success: true,
      hasVC: true,
      vc: vc.toW3CFormat(),
      metadata: {
        vcId: vc.vcId,
        status: vc.status,
        createdAt: vc.createdAt,
        hash: vc.hash,
        user: vc.user,
        kyc: vc.kyc
      }
    });
    
  } catch (error) {
    console.error('Error fetching VC:', error);
    res.status(500).json({ 
      message: 'Failed to fetch Verifiable Credential',
      error: error.message 
    });
  }
});

// @desc    Verify VC authenticity
// @route   GET /api/vc/verify/:vcId
// @access  Public
export const verifyVC = asyncHandler(async (req, res) => {
  const { vcId } = req.params;
  
  try {
    const vc = await VerifiableCredential.findOne({ vcId }).populate('user', 'fullName email');
    
    if (!vc) {
      return res.status(404).json({ 
        message: 'Verifiable Credential not found',
        isValid: false
      });
    }
    
    if (vc.status !== 'active') {
      return res.status(400).json({ 
        message: `Verifiable Credential is ${vc.status}`,
        isValid: false,
        status: vc.status
      });
    }
    
    // Check if expired
    if (vc.expirationDate && new Date() > vc.expirationDate) {
      return res.status(400).json({ 
        message: 'Verifiable Credential has expired',
        isValid: false,
        expiredAt: vc.expirationDate
      });
    }
    
    // Verify hash integrity
    const currentVCData = vc.toW3CFormat();
    const currentHash = generateVCHash(currentVCData);
    
    const isHashValid = currentHash === vc.hash;
    
    res.status(200).json({
      success: true,
      isValid: isHashValid && vc.status === 'active',
      vc: currentVCData,
      verification: {
        vcId: vc.vcId,
        status: vc.status,
        issuedAt: vc.issuanceDate,
        expiresAt: vc.expirationDate,
        hashValid: isHashValid,
        issuer: vc.issuer,
        subject: {
          name: vc.credentialSubject.name,
          residencyStatus: vc.credentialSubject.residencyStatus
        }
      }
    });
    
  } catch (error) {
    console.error('Error verifying VC:', error);
    res.status(500).json({ 
      message: 'Failed to verify Verifiable Credential',
      error: error.message,
      isValid: false
    });
  }
});

// @desc    Get VC status for revocation checking
// @route   GET /api/vc/status/:vcId
// @access  Public
export const getVCStatus = asyncHandler(async (req, res) => {
  const { vcId } = req.params;
  
  try {
    const vc = await VerifiableCredential.findOne({ vcId });
    
    if (!vc) {
      return res.status(404).json({ 
        message: 'Verifiable Credential not found' 
      });
    }
    
    res.status(200).json({
      vcId: vc.vcId,
      status: vc.status,
      issuedAt: vc.issuanceDate,
      expiresAt: vc.expirationDate,
      lastUpdated: vc.updatedAt
    });
    
  } catch (error) {
    console.error('Error getting VC status:', error);
    res.status(500).json({ 
      message: 'Failed to get VC status',
      error: error.message 
    });
  }
});

// @desc    Revoke VC (Admin only)
// @route   PUT /api/vc/revoke/:vcId
// @access  Private (Admin)
export const revokeVC = asyncHandler(async (req, res) => {
  const { vcId } = req.params;
  const { reason } = req.body;
  
  try {
    const vc = await VerifiableCredential.findOne({ vcId });
    
    if (!vc) {
      return res.status(404).json({ 
        message: 'Verifiable Credential not found' 
      });
    }
    
    if (vc.status === 'revoked') {
      return res.status(400).json({ 
        message: 'Verifiable Credential is already revoked' 
      });
    }
    
    vc.status = 'revoked';
    vc.revokedAt = new Date();
    vc.revocationReason = reason || 'Administrative action';
    await vc.save();
    
    res.status(200).json({
      message: 'Verifiable Credential revoked successfully',
      vcId: vc.vcId,
      status: vc.status,
      revokedAt: vc.revokedAt,
      reason: vc.revocationReason
    });
    
  } catch (error) {
    console.error('Error revoking VC:', error);
    res.status(500).json({ 
      message: 'Failed to revoke Verifiable Credential',
      error: error.message 
    });
  }
});

// @desc    List all VCs (Admin only)
// @route   GET /api/vc/admin/list
// @access  Private (Admin)
export const listAllVCs = asyncHandler(async (req, res) => {
  try {
    const vcs = await VerifiableCredential.find()
      .populate('user', 'fullName email')
      .populate('kyc', 'status submittedAt')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: vcs.length,
      vcs: vcs.map(vc => ({
        vcId: vc.vcId,
        status: vc.status,
        user: vc.user,
        credentialSubject: vc.credentialSubject,
        issuedAt: vc.issuanceDate,
        expiresAt: vc.expirationDate,
        createdAt: vc.createdAt
      }))
    });
    
  } catch (error) {
    console.error('Error listing VCs:', error);
    res.status(500).json({ 
      message: 'Failed to list Verifiable Credentials',
      error: error.message 
    });
  }
});