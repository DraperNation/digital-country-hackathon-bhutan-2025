'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VCCard from './components/VCCard';
import VCViewer from './components/VCViewer';
import VCActions from './components/VCActions';
import VCVerifier from './components/VCVerifier';
import ZKProofDemo from './components/ZKProofDemo';

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
  credentialStatus: {
    id: string;
    type: string;
  };
};

type VCData = {
  success: boolean;
  hasVC: boolean;
  vc: VerifiableCredential;
  metadata: {
    vcId: string;
    status: string;
    createdAt: string;
    hash: string;
  };
};

export default function VCWalletPage() {
  const [vcData, setVcData] = useState<VCData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'card' | 'json' | 'verify' | 'zkproof'>('card');
  const router = useRouter();

  useEffect(() => {
    const fetchVC = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.push('/');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vc/${userId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('No Verifiable Credential found. Please complete KYC verification first.');
          } else {
            setError('Failed to fetch Verifiable Credential');
          }
          return;
        }

        const data = await response.json();
        setVcData(data);
      } catch (error) {
        console.error('Error fetching VC:', error);
        setError('Failed to fetch Verifiable Credential');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVC();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your credential...</p>
        </div>
      </div>
    );
  }

  if (error || !vcData?.hasVC) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Credential Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full text-blue-600 py-2 px-4 rounded-md border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Complete KYC Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
                <span className="text-sm font-bold text-white">D</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Digital Credential Wallet</h1>
                <p className="text-sm text-gray-500">Kingdom of Bhutan</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('card')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'card'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Credential Card
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'json'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Raw Credential
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'verify'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🛡️ Verifier
            </button>
            <button
              onClick={() => setActiveTab('zkproof')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'zkproof'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔐 ZK Proof
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'card' && (
          <div className="space-y-6">
            <VCCard vc={vcData.vc} metadata={vcData.metadata} />
            <VCActions vc={vcData.vc} metadata={vcData.metadata} />
          </div>
        )}

        {activeTab === 'json' && (
          <div className="space-y-6">
            <VCViewer vc={vcData.vc} />
            <VCActions vc={vcData.vc} metadata={vcData.metadata} />
          </div>
        )}

        {activeTab === 'verify' && (
          <VCVerifier userVC={vcData.vc} userVCId={vcData.metadata.vcId} />
        )}

        {activeTab === 'zkproof' && (
          <ZKProofDemo />
        )}

        {/* Security Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-900">Security Notice</h3>
              <p className="text-sm text-blue-700 mt-1">
                This credential is cryptographically signed and can be independently verified. 
                Never share your private keys or credentials with unauthorized parties.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}