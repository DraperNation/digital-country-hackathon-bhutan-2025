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

type VCActionsProps = {
  vc: VerifiableCredential;
  metadata: {
    vcId: string;
    status: string;
    createdAt: string;
    hash: string;
  };
};

export default function VCActions({ vc, metadata }: VCActionsProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const downloadAsJSON = () => {
    const jsonString = JSON.stringify(vc, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Generate filename with date and name
    const date = new Date().toISOString().split('T')[0];
    const safeName = vc.credentialSubject.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `bhutan-eresidency-${safeName}-${date}.json`;
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAsPDF = () => {
    // This would typically generate a PDF using a library like jsPDF
    // For now, we'll show an alert
    alert('PDF download feature coming soon! For now, you can download the JSON version.');
  };

  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    const verificationUrl = `${baseUrl}/verify?vcId=${metadata.vcId}`;
    setShareUrl(verificationUrl);
    setShowShareModal(true);
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Share URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Bhutan eResidency Digital Credential');
    const body = encodeURIComponent(
      `I'm sharing my verified Bhutan eResidency digital credential with you.\n\n` +
      `Verification URL: ${shareUrl}\n\n` +
      `This credential can be independently verified using the link above.\n\n` +
      `Best regards,\n${vc.credentialSubject.name}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const verifyCredential = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vc/verify/${metadata.vcId}`);
      const data = await response.json();
      
      if (data.isValid) {
        alert('✅ Credential is valid and verified!');
      } else {
        alert('❌ Credential verification failed: ' + data.message);
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('❌ Failed to verify credential. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Actions */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Download JSON */}
          <button
            onClick={downloadAsJSON}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-sm font-medium text-gray-900">Download JSON</h4>
            <p className="text-xs text-gray-500 text-center mt-1">Raw credential data</p>
          </button>

          {/* Download PDF */}
          <button
            onClick={downloadAsPDF}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-red-200 transition-colors">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-sm font-medium text-gray-900">Download PDF</h4>
            <p className="text-xs text-gray-500 text-center mt-1">Printable certificate</p>
          </button>

          {/* Share */}
          <button
            onClick={generateShareUrl}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <h4 className="text-sm font-medium text-gray-900">Share</h4>
            <p className="text-xs text-gray-500 text-center mt-1">Generate share link</p>
          </button>

          {/* Verify */}
          <button
            onClick={verifyCredential}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-sm font-medium text-gray-900">Verify</h4>
            <p className="text-xs text-gray-500 text-center mt-1">Check authenticity</p>
          </button>
        </div>
      </div>

      {/* Credential Info */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Credential Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h4 className="text-sm font-medium text-gray-900">Security</h4>
            </div>
            <p className="text-xs text-gray-600">
              This credential is cryptographically signed and tamper-proof. 
              Any modifications will invalidate the signature.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
              <h4 className="text-sm font-medium text-gray-900">Portability</h4>
            </div>
            <p className="text-xs text-gray-600">
              W3C standard format ensures compatibility with other systems 
              and wallets supporting Verifiable Credentials.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h4 className="text-sm font-medium text-gray-900">Instant Verification</h4>
            </div>
            <p className="text-xs text-gray-600">
              Anyone can verify this credential instantly without contacting 
              the issuer, using cryptographic proof.
            </p>
          </div>
        </div>
      </div>

      {/* ZK Privacy Actions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Privacy-First Sharing</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white/80 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <input type="checkbox" disabled checked className="w-4 h-4 text-purple-600 rounded" />
                  <h5 className="text-sm font-medium text-gray-900">Selective Disclosure</h5>
                  <span className="bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5 rounded font-medium">
                    Ready
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Share only specific fields without revealing other personal data
                </p>
              </div>
              
              <div className="bg-white/80 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <input type="checkbox" disabled className="w-4 h-4 text-gray-400 rounded" />
                  <h5 className="text-sm font-medium text-gray-900">Zero-Knowledge Proofs</h5>
                  <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded font-medium">
                    Coming Soon
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Prove statements about your credential without revealing data
                </p>
              </div>
            </div>
            
            <div className="bg-white/60 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600">
                <strong>🛡️ Enhanced Privacy:</strong> This credential supports <strong>selective disclosure</strong>. 
                ZK field-level sharing coming soon — prove you're a verified e-resident without exposing personal details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share Credential</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Verification URL</label>
                <div className="mt-1 flex">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 block w-full rounded-l-md border-gray-300 bg-gray-50 text-sm"
                  />
                  <button
                    onClick={copyShareUrl}
                    className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-600 hover:bg-gray-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={shareViaEmail}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Share via Email
                </button>
                <button
                  onClick={copyShareUrl}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm"
                >
                  Copy Link
                </button>
              </div>

              {/* ZK Privacy Options in Share Modal */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-medium text-purple-900">Privacy-First Sharing</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" disabled checked className="w-3 h-3 text-purple-600 rounded" />
                    <span className="text-gray-700">Share only verification status (no personal data)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" disabled className="w-3 h-3 text-gray-400 rounded" />
                    <span className="text-gray-500">ZK-proof selective fields (coming soon)</span>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-3">
                This verification link reveals only that you're a verified Bhutan e-resident. 
                Personal details remain private and secure.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}