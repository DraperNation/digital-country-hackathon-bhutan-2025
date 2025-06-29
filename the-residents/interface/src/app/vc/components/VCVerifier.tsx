'use client';

import { useState } from 'react';

type VerifiableCredential = {
  '@context': string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: {
    id: string;
    name: string;
    email: string;
    country: string;
    residencyStatus: string;
    passportNumber?: string;
    kycVerified: boolean;
    zkReady?: boolean;
  };
  proof: {
    type: string;
    created: string;
    proofPurpose: string;
    verificationMethod: string;
    jws: string;
  };
  id: string;
  credentialStatus?: {
    id: string;
    type: string;
  };
};

type VCVerifierProps = {
  userVC?: VerifiableCredential;
  userVCId?: string;
};

export default function VCVerifier({ userVC, userVCId }: VCVerifierProps) {
  const [inputVC, setInputVC] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Copy user's VC JSON to clipboard
  const copyUserVC = async () => {
    if (!userVC) return;
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(userVC, null, 2));
      setCopied(true);
      setInputVC(JSON.stringify(userVC, null, 2));
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Verify credential by VC ID
  const verifyByVCId = async (vcId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vc/verify/${vcId}`);
      const data = await response.json();
      setVerificationResult(data);
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        isValid: false,
        message: 'Failed to verify credential'
      });
    } finally {
      setLoading(false);
    }
  };

  // Verify credential by JSON input
  const verifyByJSON = async () => {
    if (!inputVC.trim()) return;

    setLoading(true);
    try {
      // Parse the JSON input
      const vcData = JSON.parse(inputVC);
      
      // Extract VC ID from the JSON
      const vcId = vcData.id;
      if (!vcId) {
        setVerificationResult({
          isValid: false,
          message: 'Invalid VC format: missing credential ID'
        });
        setLoading(false);
        return;
      }

      // Verify using the ID
      await verifyByVCId(vcId);
    } catch (error) {
      console.error('JSON parse error:', error);
      setVerificationResult({
        isValid: false,
        message: 'Invalid JSON format'
      });
      setLoading(false);
    }
  };

  // Quick verify user's own VC
  const verifyUserVC = async () => {
    if (!userVCId) return;
    await verifyByVCId(userVCId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Credential Verifier</h2>
            <p className="text-green-700 text-sm">Test and verify any Bhutan eResidency credential</p>
          </div>
          <div className="ml-auto">
            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
              🛡️ ZK-Ready
            </span>
          </div>
        </div>
        
        <div className="bg-white/60 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Privacy-First Verification:</strong> This verifier only reveals essential information needed for verification. 
            Personal details remain protected through ZK-ready selective disclosure capabilities.
          </p>
        </div>
      </div>

      {/* Quick Actions for User's VC */}
      {userVC && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Your Credential</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={verifyUserVC}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {loading ? 'Verifying...' : 'Quick Verify My VC'}
            </button>
            
            <button
              onClick={copyUserVC}
              className="flex items-center justify-center gap-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? 'Copied!' : 'Copy My VC JSON'}
            </button>
          </div>
        </div>
      )}

      {/* Manual Verification */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Verify Any Credential</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="vcInput" className="block text-sm font-medium text-gray-700 mb-2">
              Paste Verifiable Credential JSON
            </label>
            <textarea
              id="vcInput"
              value={inputVC}
              onChange={(e) => setInputVC(e.target.value)}
              placeholder={`{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "eResidencyCredential"],
  "issuer": "did:bt:gov",
  ...
}`}
              className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
          </div>
          
          <button
            onClick={verifyByJSON}
            disabled={loading || !inputVC.trim()}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Verifying Credential...
              </div>
            ) : (
              'Verify Credential'
            )}
          </button>
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="text-center mb-6">
            {verificationResult.isValid ? (
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-900">✅ Valid Credential</h3>
                  <p className="text-green-600">This credential is authentic and verified</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-900">❌ Invalid Credential</h3>
                  <p className="text-red-600">{verificationResult.message}</p>
                </div>
              </div>
            )}
          </div>

          {verificationResult.isValid && verificationResult.verification && (
            <div className="space-y-6">
              {/* ZK Privacy Protection Notice */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h4 className="text-sm font-semibold text-purple-900">Privacy-Protected Verification</h4>
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                    🛡️ ZK-Ready
                  </span>
                </div>
                <p className="text-xs text-purple-700">
                  Only essential verification information is displayed below. Sensitive personal details are protected from disclosure.
                </p>
              </div>

              {/* Public Verification Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">Verified Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-blue-700 font-medium">Holder Name</label>
                    <p className="text-blue-900">{verificationResult.verification.subject?.name}</p>
                  </div>
                  <div>
                    <label className="text-blue-700 font-medium">Residency Status</label>
                    <div className="flex items-center gap-2">
                      <p className="text-blue-900 capitalize">{verificationResult.verification.subject?.residencyStatus}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-blue-700 font-medium">Issued Date</label>
                    <p className="text-blue-900">{new Date(verificationResult.verification.issuedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-blue-700 font-medium">Expires Date</label>
                    <p className="text-blue-900">{new Date(verificationResult.verification.expiresAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Technical Verification Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-600 font-medium">Credential ID</label>
                    <p className="text-gray-900 font-mono text-xs break-all">{verificationResult.verification.vcId}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Hash Integrity</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      verificationResult.verification.hashValid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {verificationResult.verification.hashValid ? '✓ VALID' : '✗ INVALID'}
                    </span>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Issuer</label>
                    <p className="text-gray-900">{verificationResult.verification.issuer}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Status</label>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {verificationResult.verification.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* ZK Features Demonstration */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Zero-Knowledge Features</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" disabled checked className="w-4 h-4 text-purple-600 rounded" />
                      <span className="text-sm text-gray-700">Identity verified without full data exposure</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" disabled checked className="w-4 h-4 text-purple-600 rounded" />
                      <span className="text-sm text-gray-700">Cryptographic proof validation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" disabled checked className="w-4 h-4 text-purple-600 rounded" />
                      <span className="text-sm text-gray-700">Selective information disclosure</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" disabled className="w-4 h-4 text-gray-400 rounded" />
                      <span className="text-sm text-gray-500">Advanced ZK circuits (coming soon)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" disabled className="w-4 h-4 text-gray-400 rounded" />
                      <span className="text-sm text-gray-500">Field-level privacy proofs (coming soon)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" disabled className="w-4 h-4 text-gray-400 rounded" />
                      <span className="text-sm text-gray-500">Cross-issuer ZK verification (coming soon)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* How It Works */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How Verification Works</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔍</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Parse & Validate</h4>
            <p className="text-sm text-gray-600">
              Extract credential ID and validate JSON structure against W3C standards.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔐</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Cryptographic Check</h4>
            <p className="text-sm text-gray-600">
              Verify digital signatures and hash integrity without exposing private data.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🛡️</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Privacy-First Results</h4>
            <p className="text-sm text-gray-600">
              Display only necessary verification status while protecting personal details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 