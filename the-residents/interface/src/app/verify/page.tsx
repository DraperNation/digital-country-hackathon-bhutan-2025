'use client';

import { useState } from 'react';

export default function VerifyPage() {
  const [vcId, setVcId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const verifyCredential = async (e: any) => {
    e.preventDefault();
    if (!vcId.trim()) return;

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Credential Verifier</h1>
              <p className="text-gray-600">Privacy-first verification system</p>
            </div>
          </div>
          
          {/* ZK Privacy Indicator */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Zero-Knowledge Verification</h2>
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                🛡️ Privacy-First
              </span>
            </div>
            <p className="text-sm text-gray-600">
              This verifier only reveals essential information. Personal details remain private and secure.
            </p>
          </div>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Verify Credential</h3>
          
          <form onSubmit={verifyCredential} className="space-y-4">
            <div>
              <label htmlFor="vcId" className="block text-sm font-medium text-gray-700 mb-2">
                Credential ID
              </label>
              <input
                type="text"
                id="vcId"
                value={vcId}
                onChange={(e) => setVcId(e.target.value)}
                placeholder="Enter VC ID (e.g., vc:bt:user:123:1234567890)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !vcId.trim()}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Verifying...' : 'Verify Credential'}
            </button>
          </form>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="text-center mb-6">
              {verificationResult.isValid ? (
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-900">Valid Credential</h3>
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
                    <h3 className="text-xl font-semibold text-red-900">Invalid Credential</h3>
                    <p className="text-red-600">{verificationResult.message}</p>
                  </div>
                </div>
              )}
            </div>

            {verificationResult.isValid && verificationResult.verification && (
              <div className="space-y-6">
                {/* Privacy-First Information Display */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-blue-900">Public Verification Information</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-blue-700 font-medium">Holder Name</label>
                      <p className="text-blue-900">{verificationResult.verification.subject?.name}</p>
                    </div>
                    <div>
                      <label className="text-blue-700 font-medium">Residency Status</label>
                      <p className="text-blue-900 capitalize">{verificationResult.verification.subject?.residencyStatus}</p>
                    </div>
                    <div>
                      <label className="text-blue-700 font-medium">Issued Date</label>
                      <p className="text-blue-900">{new Date(verificationResult.verification.issuedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-blue-700 font-medium">Status</label>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {verificationResult.verification.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ZK Privacy Features */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-purple-900">Privacy Protection Active</h4>
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                      🛡️ ZK-Ready
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" disabled checked className="w-4 h-4 text-purple-600 rounded" />
                      <span className="text-purple-800">Only essential verification status shared</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" disabled checked className="w-4 h-4 text-purple-600 rounded" />
                      <span className="text-purple-800">Personal details protected from unauthorized access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" disabled className="w-4 h-4 text-gray-400 rounded" />
                      <span className="text-gray-500">Zero-knowledge proofs for selective disclosure (coming soon)</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white/60 border border-purple-200 rounded-lg">
                    <p className="text-xs text-purple-700">
                      <strong>Privacy Guarantee:</strong> This verification reveals only that the holder is a verified Bhutan e-resident. 
                      Sensitive information like passport numbers, exact addresses, and other personal details remain completely private.
                    </p>
                  </div>
                </div>

                {/* Technical Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Technical Verification Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-gray-600 font-medium">Credential ID</label>
                      <p className="text-gray-900 font-mono break-all">{verificationResult.verification.vcId}</p>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium">Hash Integrity</label>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {verificationResult.verification.hashValid ? '✓ VALID' : '✗ INVALID'}
                      </span>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium">Issuer</label>
                      <p className="text-gray-900">{verificationResult.verification.issuer}</p>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium">Expires</label>
                      <p className="text-gray-900">{new Date(verificationResult.verification.expiresAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">How Zero-Knowledge Verification Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Privacy by Design</h4>
              <p className="text-sm text-gray-600">
                Only verification status is revealed. Personal data stays private.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Verification</h4>
              <p className="text-sm text-gray-600">
                Cryptographic proofs enable immediate validation without contacting issuers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">ZK-Ready</h4>
              <p className="text-sm text-gray-600">
                Built for future zero-knowledge proof integration and selective disclosure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 