import crypto from 'crypto';

/**
 * Generate a mock JWS signature for demo purposes
 * In production, this would use real cryptographic signing
 */
export const generateMockSignature = (payload) => {
  // Create a mock signature that looks realistic
  const header = {
    alg: 'EdDSA',
    typ: 'JWT'
  };
  
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  // Generate a mock signature (in production, this would be real cryptographic signing)
  const mockSignature = crypto
    .createHash('sha256')
    .update(`${encodedHeader}.${encodedPayload}.secret-key`)
    .digest('base64url');
  
  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

/**
 * Generate SHA-256 hash of VC for integrity verification
 */
export const generateVCHash = (vcData) => {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(vcData))
    .digest('hex');
};

/**
 * Create a DID (Decentralized Identifier) for a user
 */
export const generateUserDID = (userId) => {
  return `did:bt:user:${userId}`;
};

/**
 * Validate VC structure according to W3C standards
 */
export const validateVCStructure = (vc) => {
  const requiredFields = ['@context', 'type', 'issuer', 'issuanceDate', 'credentialSubject'];
  
  for (const field of requiredFields) {
    if (!vc[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  // Validate context
  if (!vc['@context'].includes('https://www.w3.org/2018/credentials/v1')) {
    throw new Error('Invalid @context: must include W3C credentials context');
  }
  
  // Validate types
  if (!vc.type.includes('VerifiableCredential')) {
    throw new Error('Invalid type: must include VerifiableCredential');
  }
  
  return true;
};

/**
 * Generate a complete VC with all required fields and mock signature
 */
export const generateCompleteVC = (userData, kycData) => {
  const now = new Date();
  const credentialSubject = {
    id: generateUserDID(userData._id),
    name: userData.fullName,
    email: userData.email,
    country: 'Bhutan',
    residencyStatus: 'approved',
    passportNumber: userData.passportNumber,
    kycVerified: true,
    verificationDate: now.toISOString(),
    zkReady: true // ZK-proof ready indicator for UI
  };
  
  const vcPayload = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential', 'eResidencyCredential'],
    issuer: 'did:bt:gov',
    issuanceDate: now.toISOString(),
    credentialSubject
  };
  
  // Generate mock signature
  const jws = generateMockSignature(vcPayload);
  
  const completeVC = {
    ...vcPayload,
    proof: {
      type: 'Ed25519Signature2020',
      created: now.toISOString(),
      proofPurpose: 'assertionMethod',
      verificationMethod: 'did:bt:gov#key-1',
      jws
    }
  };
  
  // Validate the generated VC
  validateVCStructure(completeVC);
  
  return completeVC;
}; 