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
};

type VCCardProps = {
  vc: VerifiableCredential;
  metadata: {
    vcId: string;
    status: string;
    createdAt: string;
    hash: string;
  };
};

export default function VCCard({ vc, metadata }: VCCardProps) {
  const [showQR, setShowQR] = useState(false);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'revoked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Credential Card */}
      <div className="relative">
        {/* Card Background with Gradient */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 rounded-2xl p-8 text-white shadow-2xl transform perspective-1000 hover:scale-105 transition-transform duration-300">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🏔️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">KINGDOM OF BHUTAN</h2>
                <p className="text-blue-100 text-sm">Digital eResidency</p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-xs font-medium">VERIFIED</span>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-1">{vc.credentialSubject.name}</h3>
            <p className="text-blue-100 text-sm mb-2">{vc.credentialSubject.email}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-white/20 rounded-full px-2 py-1">
                {vc.credentialSubject.residencyStatus.toUpperCase()}
              </span>
              {vc.credentialSubject.kycVerified && (
                <span className="bg-green-500/80 rounded-full px-2 py-1 text-xs">
                  ✓ KYC VERIFIED
                </span>
              )}
              {vc.credentialSubject.zkReady && (
                <span className="bg-blue-500/80 rounded-full px-2 py-1 text-xs">
                  🛡️ ZK-Ready
                </span>
              )}
            </div>
          </div>

          {/* Credential Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-blue-200 mb-1">Issued Date</p>
              <p className="font-medium">{formatDate(vc.issuanceDate)}</p>
            </div>
            <div>
              <p className="text-blue-200 mb-1">Expires</p>
              <p className="font-medium">{formatDate(vc.expirationDate)}</p>
            </div>
            <div>
              <p className="text-blue-200 mb-1">Credential ID</p>
              <p className="font-mono text-xs">{metadata.vcId.slice(-12)}...</p>
            </div>
            <div>
              <p className="text-blue-200 mb-1">Issuer</p>
              <p className="font-medium">Bhutan Gov</p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-blue-200">Cryptographically Signed</p>
              <p className="text-xs font-mono">{metadata.hash.slice(0, 16)}...</p>
            </div>
            
            <button
              onClick={() => setShowQR(!showQR)}
              className="bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm rounded-lg p-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 opacity-10">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        {/* Verified Stamp */}
        <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full w-20 h-20 flex items-center justify-center transform rotate-12 shadow-lg">
          <div className="text-center">
            <div className="text-xs font-bold">VERIFIED</div>
            <div className="text-xs">BY BHUTAN</div>
          </div>
        </div>
      </div>

      {/* QR Code Modal/Expandable Section */}
      {showQR && (
        <div className="bg-white rounded-lg border shadow-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification QR Code</h3>
            
            {/* Mock QR Code */}
            <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center text-gray-500">
                <svg className="w-24 h-24 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <p className="text-sm">QR Code</p>
                <p className="text-xs">Verification Link</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Scan this QR code to verify the authenticity of this credential
            </p>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Verification URL:</p>
              <p className="text-xs font-mono text-gray-700 break-all">
                {`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/vc/verify/${metadata.vcId}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ZK Privacy Features */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Zero-Knowledge Privacy</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" disabled checked className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                <label className="text-sm text-gray-700">
                  Field-level privacy enabled (ZK-ready)
                </label>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                  🛡️ ZK-Proof Ready
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <input type="checkbox" disabled checked className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                <label className="text-sm text-gray-700">
                  Selective disclosure supported
                </label>
              </div>
              
              <div className="flex items-center gap-3">
                <input type="checkbox" disabled className="w-4 h-4 text-gray-400 bg-gray-100 border-gray-300 rounded" />
                <label className="text-sm text-gray-500">
                  Advanced ZK circuits (coming soon)
                </label>
              </div>
            </div>
            
            <div className="bg-white/60 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-2">
                <strong>Privacy-First Sharing:</strong> This credential supports selective disclosure. 
                Share only what's needed — prove you're a Bhutan e-resident without revealing personal details.
              </p>
              <p className="text-xs text-blue-600 font-medium">
                Zero-knowledge proofs ensure mathematical privacy guarantees.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Credential Details */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Credential Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Subject ID</label>
            <p className="mt-1 text-sm text-gray-900 font-mono break-all">{vc.credentialSubject.id}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(metadata.status)}`}>
                {metadata.status.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Proof Type</label>
            <p className="mt-1 text-sm text-gray-900">{vc.proof.type}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Verification Method</label>
            <p className="mt-1 text-sm text-gray-900 font-mono break-all">{vc.proof.verificationMethod}</p>
          </div>
          
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-500">Passport Number</label>
            <p className="mt-1 text-sm text-gray-900">
              {vc.credentialSubject.passportNumber ? 
                `****${vc.credentialSubject.passportNumber.slice(-4)}` : 
                'Not disclosed'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}