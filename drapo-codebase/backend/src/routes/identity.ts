import express from 'express';
import {
  getIdentityOverview,
  getDIDDetails,
  getCredentials,
  getBiometricData,
  getPassportData,
  updateBiometricEnrollment,
  requestCredential,
  issueKYCCredential,
  issueBiometricCredential,
  issueProofOfPersonhoodCredential,
  issueReputationCredential,
  issueAttestationCredential,
  verifyCredential,
  createIdentityPresentation,
  verifyPresentation,
  revokeCredential,
  getCredentialStatus,
} from '../controllers/identityController.js';

const router = express.Router();

// Get user's identity overview
router.get('/overview/:userId', getIdentityOverview);

// Get user's DID details
router.get('/did/:userId', getDIDDetails);

// Get user's credentials
router.get('/credentials/:userId', getCredentials);

// Get user's biometric data
router.get('/biometric/:userId', getBiometricData);

// Get user's passport data
router.get('/passport/:userId', getPassportData);

// Update biometric enrollment
router.put('/biometric/:userId', updateBiometricEnrollment);

// Request new credential
router.post('/credentials/:userId', requestCredential);

// Veramo Integration Routes

// Issue credentials using Veramo
router.post('/credentials/:userId/kyc', issueKYCCredential);
router.post('/credentials/:userId/biometric', issueBiometricCredential);
router.post('/credentials/:userId/personhood', issueProofOfPersonhoodCredential);
router.post('/credentials/:userId/reputation', issueReputationCredential);
router.post('/credentials/:userId/attestation', issueAttestationCredential);

// Verify credentials and presentations
router.post('/verify/credential', verifyCredential);
router.post('/verify/presentation', verifyPresentation);

// Create identity presentations
router.post('/presentation/:userId', createIdentityPresentation);

// Credential management
router.delete('/credentials/:credentialId', revokeCredential);
router.get('/credentials/status/:credentialId', getCredentialStatus);

export default router;
