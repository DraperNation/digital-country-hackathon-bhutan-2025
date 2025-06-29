'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useNFTMint } from '@/hooks/useNFTMint';
import { useCompanyRegistry } from '@/hooks/useCompanyRegistry';

type KycStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected' | 'in_review';

type KycData = {
  hasKyc: boolean;
  status: KycStatus;
  submittedAt?: string;
  reviewedAt?: string | null;
  comments?: string | null;
  user?: {
    fullName: string;
    email: string;
  } | null;
};

type UserData = {
  id: string;
  fullName: string;
  email: string;
  passportNumber?: string;
  kycStatus: KycStatus;
  nftTokenId?: string;
  nftContract?: string;
  applicationDate?: string;
  approvalDate?: string;
  residencyId?: string;
};

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [kycData, setKycData] = useState<KycData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isKycLoading, setIsKycLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Wallet and NFT minting
  const { 
    address, 
    isConnected, 
    connectWallet, 
    disconnect,
    saveWalletAddress,
    mintNFT, 
    checkMintStatus, 
    isLoading: isMinting, 
    mintStatus,
    setMintStatus 
  } = useNFTMint();

  // Company blockchain registry
  const { 
    registerOnChain, 
    isRegistering, 
    contractAddress 
  } = useCompanyRegistry();

  // Save wallet address when connected
  const handleWalletConnect = async () => {
    try {
      await connectWallet();
      
      // Save wallet address to database after connection
      setTimeout(async () => {
        const userId = localStorage.getItem('userId');
        if (userId && address) {
          try {
            await saveWalletAddress(userId, address);
            console.log('Wallet address saved to database');
          } catch (error) {
            console.error('Failed to save wallet address:', error);
          }
        }
      }, 1000); // Small delay to ensure address is available
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };
  // Entity registration state
  const [showCompanyForm, setShowCompanyForm] = useState(false)
  const [currentFormStep, setCurrentFormStep] = useState(1)
  const [companyFormData, setCompanyFormData] = useState({
    // Section 1: Basic Company Info
    companyName: '',
    companyType: '',
    businessActivity: '',
    jurisdiction: 'Bhutan',
    virtualOfficeOptIn: false,
    // Section 2: Ownership & Control
    ownerDirector: '', // Will be auto-filled from user data
    coFounders: [] as Array<{id: number, name: string, email: string}>,
    governanceModel: '',
    // Section 3: Documentation
    bylawsFile: null as File | null,
    termsAccepted: false,
    // Section 4: Payment
    bitcoinAddress: '',
    paymentConfirmed: false
  })
  const [newCoFounder, setNewCoFounder] = useState({ name: '', email: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [companyData, setCompanyData] = useState<{
    id?: string;
    _id?: string;
    registrationNumber: string;
    taxId: string;
    registrationDate: string;
    status: string;
    companyName: string;
    companyType: string;
    businessActivity: string;
    jurisdiction: string;
    virtualOfficeOptIn: boolean;
    ownerDirector: string;
    coFounders: Array<{id: number, name: string, email: string}>;
    governanceModel: string;
    bylawsFile: File | null;
    termsAccepted: boolean;
    bitcoinAddress: string;
    paymentConfirmed: boolean;
  } | null>(null)

  const fetchKycStatus = async (userId: string) => {
    try {
      setIsKycLoading(true);
              const response = await fetch(`http://localhost:8000/api/kyc/status/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch KYC status');
      }
      const data = await response.json();
      if (data.success && data.data) {
        setKycData(data.data);
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    } finally {
      setIsKycLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.push('/');
          return;
        }

        // Fetch user data
        const userResponse = await fetch(`http://localhost:8000/api/auth/me/${userId}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        setUserData(userData.data);
        
        // Auto-fill owner/director name from user data
        setCompanyFormData(prev => ({
          ...prev,
          ownerDirector: userData.data.fullName
        }));
        
        // Fetch KYC status
        await fetchKycStatus(userId);
        
        // Check NFT mint status
        const status = await checkMintStatus(userId);
        if (status) {
          setMintStatus(status);
        }

        // Check if user has existing company registration
        try {
          const companyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company/user/${userId}`);
          console.log('Fetching company data for user:', userId);
          console.log('Company response status:', companyResponse.status);
          
          if (companyResponse.ok) {
            const companyResult = await companyResponse.json();
            console.log('Company result:', companyResult);
            
            if (companyResult.success && companyResult.data) {
              console.log('Setting company data:', companyResult.data);
              setCompanyData(companyResult.data);
              setIsSubmitted(true);
            } else {
              console.log('No company data found in response');
            }
          } else {
            console.log('Company response not ok:', companyResponse.status);
          }
        } catch (error) {
          console.error('Error fetching company data:', error);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setError(errorMessage);
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]); // Removed the function dependencies that cause infinite loop

  // Click outside handler for menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleCompanyFormChange = (field: string, value: string | boolean | File | null) => {
    setCompanyFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addCoFounder = () => {
    if (newCoFounder.name && newCoFounder.email) {
      setCompanyFormData(prev => ({
        ...prev,
        coFounders: [...prev.coFounders, { ...newCoFounder, id: Date.now() }]
      }))
      setNewCoFounder({ name: '', email: '' })
    }
  }

  const removeCoFounder = (id: number) => {
    setCompanyFormData(prev => ({
      ...prev,
      coFounders: prev.coFounders.filter(cf => cf.id !== id)
    }))
  }

  const handleFormSubmit = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID not found. Please refresh the page.');
      return;
    }

    try {
      // Prepare form data for API call
      const registrationData = {
        companyName: companyFormData.companyName,
        companyType: companyFormData.companyType,
        businessActivity: companyFormData.businessActivity,
        jurisdiction: companyFormData.jurisdiction,
        virtualOfficeOptIn: companyFormData.virtualOfficeOptIn,
        owner: userId,
        ownerDirector: companyFormData.ownerDirector,
        coFounders: companyFormData.coFounders,
        governanceModel: companyFormData.governanceModel,
        bylawsFile: companyFormData.bylawsFile?.name || null,
        termsAccepted: companyFormData.termsAccepted,
        bitcoinAddress: companyFormData.bitcoinAddress,
        paymentConfirmed: companyFormData.paymentConfirmed
      };

      const response = await fetch('http://localhost:8000/api/company/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      if (result.success) {
        setCompanyData(result.data);
        setIsSubmitted(true);
        setShowCompanyForm(false);
        
        // Register on blockchain if wallet is connected
                 if (isConnected && contractAddress !== '0x1234567890123456789012345678901234567890') {
          try {
            console.log('Registering company on blockchain...');
            const blockchainResult = await registerOnChain({
              ...registrationData,
              registrationNumber: result.data.registrationNumber,
              taxId: result.data.taxId,
              registrationDate: result.data.registrationDate,
              status: result.data.status
            });
            
            if (blockchainResult.success) {
              alert(`Company registered successfully! 
              
Database: ✅ Saved
Blockchain: ✅ Hash stored on-chain
Transaction: ${blockchainResult.transactionHash}

View on PolygonScan: ${blockchainResult.explorerUrl}`);
            } else {
              alert(`Company registered successfully in database! 
              
⚠️ Blockchain registration failed: ${blockchainResult.error}
You can try again later from the company details page.`);
            }
          } catch (blockchainError) {
            console.error('Blockchain registration error:', blockchainError);
            alert(`Company registered successfully in database! 
            
⚠️ Blockchain registration failed: ${blockchainError instanceof Error ? blockchainError.message : 'Unknown error'}
You can try again later from the company details page.`);
          }
        } else {
          let message = 'Company registered successfully!';
          if (!isConnected) {
            message += '\n\n💡 Connect your wallet to also store the company hash on blockchain.';
                     } else if (contractAddress === '0x1234567890123456789012345678901234567890') {
            message += '\n\n⚠️ Smart contract not deployed yet. Blockchain registration unavailable.';
          }
          alert(message);
        }
      } else {
        throw new Error(result.message || 'Registration failed');
      }

    } catch (error) {
      console.error('Company registration error:', error);
      alert(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const downloadCertificate = async () => {
    const companyId = companyData?.id || companyData?._id;
    if (!companyId) {
      alert('No company found to download certificate for');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company/certificate/${companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the filename from the response headers or create a default one
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'incorporation-certificate.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Convert response to blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Certificate download error:', error);
      alert(`Failed to download certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error || 'User data not found'}</div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'kyc', label: 'KYC Status', icon: 'check', count: kycData?.status === 'pending' ? '!' : undefined },
    { id: 'vc', label: 'Digital Wallet', icon: 'wallet' },
    { id: 'nft', label: 'Residency NFT', icon: 'badge' },
    { id: 'company', label: 'Entities', icon: 'building' },
    { id: 'documents', label: 'Documents', icon: 'document' }
  ];

  const getStatusBadge = (status: KycStatus) => {
    const statusConfig = {
      not_submitted: { label: 'Not Submitted', color: 'bg-gray-100 text-gray-800' },
      pending: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Approved', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
      in_review: { label: 'In Review', color: 'bg-blue-100 text-blue-800' },
    };
    const config = statusConfig[status] || statusConfig.not_submitted;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const renderIcon = (iconType: string, count?: string) => {
    const iconProps = "w-4 h-4 text-current"
    
    switch(iconType) {
      case 'home':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )
      case 'check':
        return (
          <div className="relative">
            <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {count && (
              <span className="absolute -top-1 -right-1 h-3 w-3 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-medium">
                {count}
              </span>
            )}
          </div>
        )
      case 'wallet':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
      case 'badge':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        )
      case 'building':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
      case 'document':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'globe':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
          </svg>
        )
      default:
        return null
    }
  }

  const renderKycStatus = () => {
    if (isKycLoading) {
      return (
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      );
    }

    if (!kycData) return null;

    if (kycData.status === 'approved') {
      return (
        <div className="space-y-6">
          {/* Verification Success Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Identity Verified</h3>
                  <p className="text-sm text-gray-500">Your identity has been successfully verified</p>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{kycData.user?.fullName || userData?.fullName || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{kycData.user?.email || userData?.email || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Verification Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {kycData.reviewedAt ? new Date(kycData.reviewedAt).toLocaleDateString() : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-800 mb-4">Next Steps</h3>
            <ul role="list" className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-100">
                    <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </div>
                </div>
                <p className="ml-3 text-sm text-blue-700">
                  <span className="font-medium">Mint your Digital Residency NFT</span> to complete your verification process
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-100">
                    <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </div>
                </div>
                <p className="ml-3 text-sm text-blue-700">
                  <span className="font-medium">Explore services</span> available to verified residents
                </p>
              </li>
            </ul>
            <div className="mt-6">
              {!mintStatus?.hasMinted ? (
                <div className="space-y-3">
                  {!isConnected ? (
                    <button
                      onClick={handleWalletConnect}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Connect Wallet
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <span>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
                        <button 
                          onClick={() => disconnect()}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          Disconnect
                        </button>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            const userId = localStorage.getItem('userId');
                            if (!userId) return;
                            const result = await mintNFT(userId);
                            if (result.synced) {
                              alert(`NFT data synced successfully! Your existing NFT (Token ID: ${result.tokenId}) has been synchronized from the blockchain.`);
                            } else {
                              alert('NFT minted successfully!');
                            }
                          } catch (error) {
                            alert(error instanceof Error ? error.message : 'Failed to mint NFT');
                          }
                        }}
                        disabled={isMinting}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isMinting ? 'Minting...' : 'Mint Your Residency NFT'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setActiveSection('nft')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  View Your NFT
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // For other statuses (pending, rejected, not_submitted)
    return (
      <div className="space-y-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">KYC Status</h3>
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Current Status</p>
                  <div className="mt-1">
                    {getStatusBadge(kycData.status)}
                  </div>
                </div>
                {kycData.status === 'pending' && kycData.submittedAt && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">Submitted On</p>
                    <p className="text-sm text-gray-900">
                      {new Date(kycData.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {kycData.status === 'rejected' && kycData.reviewedAt && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">Rejected On</p>
                    <p className="text-sm text-gray-900">
                      {new Date(kycData.reviewedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {kycData.status === 'rejected' && kycData.comments && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Reason for Rejection</p>
                  <p className="mt-1 text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                    {kycData.comments}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => router.push('/')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Resubmit KYC
                    </button>
                  </div>
                </div>
              )}

              {kycData.status === 'pending' && (
                <div className="mt-6">
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          Your KYC application is under review. This process typically takes 1-2 business days. 
                          You&apos;ll receive an email notification once your verification is complete.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {kycData.status === 'not_submitted' && (
                <div className="mt-6">
                  <div className="rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Verification Required</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>You need to complete the KYC verification process to access all features.</p>
                        </div>
                        <div className="mt-4">
                          <div className="-mx-2 -my-1.5 flex">
                            <button
                              type="button"
                              onClick={() => router.push('/')}
                              className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600"
                            >
                              Start Verification
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Grey dots gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white opacity-30"></div>
      <div 
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      ></div>

      {/* Header */}
      <header className="absolute top-0 left-0 z-10 p-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
            <span className="text-xs font-bold text-white">D</span>
          </div>
          <span className="text-base font-medium text-gray-900">Druk e-Portal</span>
        </div>
      </header>

      {/* Menu button - top right */}
      <div className="absolute top-6 right-6 z-20">
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
              <a
                href="/directory"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18v-9" />
                  </svg>
                  Public Directory
                </div>
              </a>
              <a
                href="/vc"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Digital Wallet
                </div>
              </a>
              <a
                href="/admin"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin Panel
                </div>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Main Container - centered with bordered card */}
      <div className="min-h-screen flex items-center justify-center p-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 overflow-hidden flex w-full max-w-5xl h-auto min-h-[600px] max-h-[80vh]">
          {/* Left side - Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200/60 flex-shrink-0">
            <div className="p-5 h-full">
              {/* User Profile */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200/60">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                    OS
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">Oliur Sahin</p>
                    </div>
                    <p className="text-xs text-gray-500 truncate">oliursahin@gmail.com</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                        e-Resident
                        {userData.kycStatus === 'approved' && (
                          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="h-px bg-gray-200/60 mb-6"></div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                      activeSection === item.id
                        ? 'bg-gray-100 text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <span className="text-sm">{renderIcon(item.icon, 'count' in item ? (item as { count?: string }).count : undefined)}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right side - Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30">
              {activeSection === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                      Overview
                    </h1>
                    <p className="text-sm text-gray-600">
                      Your digital residency status and recent activity.
                    </p>
                  </div>

                  {/* Status Cards */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white rounded-lg p-5 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Identity Verification</p>
                              <p className={`text-sm mt-1 ${
                                userData.kycStatus === 'approved' ? 'text-green-600' : 
                                userData.kycStatus === 'pending' ? 'text-amber-600' : 
                                userData.kycStatus === 'rejected' ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {userData.kycStatus.split('_').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </p>
                            </div>
                            <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              userData.kycStatus === 'approved' ? 'bg-green-50 text-green-700' : 
                              userData.kycStatus === 'pending' ? 'bg-amber-50 text-amber-700' : 
                              userData.kycStatus === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
                            }`}>
                              {userData.kycStatus === 'approved' ? 'Verified' : 
                               userData.kycStatus === 'pending' ? 'Pending' : 
                               userData.kycStatus === 'rejected' ? 'Rejected' : 'Not Started'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-5 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Digital Identity NFT</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {mintStatus?.hasMinted 
                                  ? `Token #${mintStatus.tokenId || userData.nftTokenId}`
                                  : isConnected 
                                    ? `Wallet: ${address?.slice(0, 6)}...${address?.slice(-4)}`
                                    : 'Not connected'
                                }
                              </p>
                            </div>
                            <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              mintStatus?.hasMinted 
                                ? 'bg-green-50 text-green-700' 
                                : isConnected 
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-gray-50 text-gray-700'
                            }`}>
                              {mintStatus?.hasMinted ? 'Minted' : isConnected ? 'Connected' : 'Disconnected'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-50 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Complete KYC</h3>
                          <p className="text-xs text-gray-500 mb-4">Verify your identity</p>
                          <button
                            onClick={() => setActiveSection('kyc')}
                            className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors"
                          >
                            Start KYC →
                          </button>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-50 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Mint NFT</h3>
                          <p className="text-xs text-gray-500 mb-4">Get digital identity</p>
                          <button
                            onClick={() => setActiveSection('nft')}
                            className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                          >
                            Mint Now →
                          </button>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-teal-50 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Register Company</h3>
                          <p className="text-xs text-gray-500 mb-4">Incorporate business</p>
                          <button
                            onClick={() => setActiveSection('company')}
                            className="text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors"
                          >
                            Register →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'kyc' && renderKycStatus()}

              {activeSection === 'vc' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                      Digital Credential Wallet
                    </h1>
                    <p className="text-sm text-gray-600">
                      Manage your verified digital credentials and certificates.
                    </p>
                  </div>

                  {/* Check if user is verified */}
                  {kycData?.status === 'approved' ? (
                    <div className="space-y-6">
                      {/* Credential Status */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: '#DDEEE9'}}>
                            <svg className="w-6 h-6" style={{color: '#42976A'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">Verifiable Credential Available</h3>
                            <p className="text-sm text-gray-600">Your Bhutan eResidency credential is ready to use</p>
                          </div>
                          <div className="text-right">
                            <div className="text-white text-xs px-3 py-1.5 rounded-lg font-medium" style={{backgroundColor: '#42976A'}}>
                              ACTIVE
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg mx-auto mb-4 flex items-center justify-center">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">View Credential</h3>
                            <p className="text-xs text-gray-500 mb-4">Access your digital wallet</p>
                            <button
                              onClick={() => window.open('/vc', '_blank')}
                              className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                            >
                              Open Wallet →
                            </button>
                          </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg mx-auto mb-4 flex items-center justify-center">
                              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Download</h3>
                            <p className="text-xs text-gray-500 mb-4">Save as JSON file</p>
                            <button
                              onClick={() => {
                                alert('Download feature will be available in the full wallet interface');
                              }}
                              className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors"
                            >
                              Download →
                            </button>
                          </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-amber-50 rounded-lg mx-auto mb-4 flex items-center justify-center">
                              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                              </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Share</h3>
                            <p className="text-xs text-gray-500 mb-4">Generate verification link</p>
                            <button
                              onClick={() => {
                                const verifyUrl = `${window.location.origin}/verify?user=${userData.id}`;
                                navigator.clipboard.writeText(verifyUrl);
                                alert('Verification link copied to clipboard!');
                              }}
                              className="text-amber-600 text-sm font-medium hover:text-amber-700 transition-colors"
                            >
                              Copy Link →
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Credential Info */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Credential Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          <div>
                            <label className="text-gray-500 font-medium text-xs uppercase tracking-wide">Credential Type</label>
                            <p className="text-gray-900 font-medium mt-1">Bhutan eResidency Certificate</p>
                          </div>
                          <div>
                            <label className="text-gray-500 font-medium text-xs uppercase tracking-wide">Issued By</label>
                            <p className="text-gray-900 font-medium mt-1">Kingdom of Bhutan</p>
                          </div>
                          <div>
                            <label className="text-gray-500 font-medium text-xs uppercase tracking-wide">Issue Date</label>
                            <p className="text-gray-900 font-medium mt-1">{kycData?.reviewedAt ? new Date(kycData.reviewedAt).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-gray-500 font-medium text-xs uppercase tracking-wide">Status</label>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#42976A'}}></div>
                              <span className="text-gray-900 font-medium">Verified & Active</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Technology Info */}
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">W3C Standards Compliance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700 font-medium">Verifiable Credentials Data Model v1.1</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-700 font-medium">JSON-LD Linked Data</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#42976A'}}></div>
                            <span className="text-gray-700 font-medium">Ed25519 Digital Signatures</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-gray-700 font-medium">Decentralized Identifiers (DID)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L4.064 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Verification Required</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Complete your KYC verification to access your digital credential wallet.
                          </p>
                          <button
                            onClick={() => setActiveSection('kyc')}
                            className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                          >
                            Complete Verification
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'nft' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                      E-Residency NFT
                    </h1>
                    <p className="text-sm text-gray-600">
                      Your digital residency certificate as an NFT.
                    </p>
                  </div>

                  {/* Wallet Connection and NFT Minting */}
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Wallet Connection</h3>
                        <p className="text-sm text-gray-600">Connect your wallet to mint your NFT</p>
                      </div>
                      {isConnected ? (
                        <div className="text-right">
                          <p className="text-sm text-green-600 font-medium">
                            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                          </p>
                          <button
                            onClick={() => disconnect()}
                            className="text-xs text-red-600 hover:text-red-800 mt-1"
                          >
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleWalletConnect}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Connect Wallet
                        </button>
                      )}
                    </div>

                    {isConnected && (
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-md font-medium text-gray-900">Mint Your NFT</h4>
                            <p className="text-sm text-gray-600">
                              {mintStatus?.hasMinted 
                                ? 'Your NFT has been minted!' 
                                : kycData?.status === 'approved' 
                                  ? 'Ready to mint your e-Residency NFT'
                                  : 'Complete KYC verification first'
                              }
                            </p>
                          </div>
                          {!mintStatus?.hasMinted && (
                            <button
                              onClick={async () => {
                                const userId = localStorage.getItem('userId');
                                if (!userId) {
                                  alert('User ID not found. Please refresh the page.');
                                  return;
                                }
                                if (kycData?.status !== 'approved') {
                                  alert('Please complete KYC verification first.');
                                  return;
                                }
                                try {
                                  const result = await mintNFT(userId);
                                  if (result.synced) {
                                    alert(`NFT data synced successfully! Your existing NFT (Token ID: ${result.tokenId}) has been synchronized from the blockchain.`);
                                  } else {
                                    alert(`NFT minted successfully! Token ID: ${result.tokenId}`);
                                  }
                                } catch (error) {
                                  console.error('Minting failed:', error);
                                  alert(`Minting failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                                }
                              }}
                              disabled={isMinting || kycData?.status !== 'approved'}
                              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                                isMinting || kycData?.status !== 'approved'
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {isMinting ? 'Minting...' : 'Mint Your Residency NFT'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* NFT Display */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-center mb-4">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-2xl mb-1">🏔️</div>
                          <div className="text-xs font-medium">DRUK</div>
                          <div className="text-xs opacity-80">{mintStatus?.tokenId || userData?.nftTokenId || 'N/A'}</div>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Druk Digital Residency</h3>
                      <p className="text-sm text-gray-600">Kingdom of Bhutan • 2024</p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Token ID:</span>
                        <span className="text-gray-900 font-medium">{mintStatus?.tokenId || userData?.nftTokenId || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Contract:</span>
                        <span className="text-gray-900 font-mono text-xs">{mintStatus?.contractAddress || userData?.nftContract || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Network:</span>
                        <span className="text-gray-900 font-medium">Polygon Amoy</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className="text-green-600 font-medium">{mintStatus?.hasMinted ? 'Minted' : 'Not Minted'}</span>
                      </div>
                      {mintStatus?.hasMinted && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">View NFT:</span>
                          <a 
                            href={`https://amoy.polygonscan.com/token/${mintStatus.contractAddress}?a=${mintStatus.tokenId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs underline"
                          >
                            PolygonScan →
                          </a>
                        </div>
                      )}
                      {mintStatus?.transactionHash && mintStatus.transactionHash !== '' && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tx Hash:</span>
                          <a 
                            href={`https://amoy.polygonscan.com/tx/${mintStatus.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-mono text-xs underline"
                          >
                            {mintStatus.transactionHash.slice(0, 10)}...
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Only show OpenSea button for real networks, not localhost */}
                    {mintStatus?.hasMinted && mintStatus?.transactionHash && !mintStatus?.contractAddress?.includes('0x5FbDB2315678afecb367f032d93F642f64180aa3') && (
                      <div className="mt-4 pt-4 border-t">
                        <button 
                          onClick={() => {
                            const contractAddress = mintStatus?.contractAddress || userData?.nftContract;
                            const tokenId = mintStatus?.tokenId || userData?.nftTokenId;
                            if (contractAddress && tokenId) {
                              window.open(`https://testnets.opensea.io/assets/amoy/${contractAddress}/${tokenId}`, '_blank');
                            }
                          }}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          View on OpenSea
                        </button>
                      </div>
                    )}

                    {/* Show local blockchain info for localhost */}
                    {mintStatus?.hasMinted && mintStatus?.contractAddress?.includes('0x5FbDB2315678afecb367f032d93F642f64180aa3') && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                          <p className="text-xs text-yellow-800 font-medium">
                            🧪 Development Mode
                          </p>
                          <p className="text-xs text-yellow-700 mt-1">
                            This NFT is on your local Hardhat network. Deploy to a real network (Polygon, Ethereum) to view on OpenSea.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* NFT Benefits */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">NFT Benefits:</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Proof of digital residency ownership</li>
                      <li>• Transferable digital asset</li>
                      <li>• Access to exclusive Druk community</li>
                      <li>• Voting rights in governance</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === 'company' && (
                <div className="space-y-6">

                  
                  {!showCompanyForm && !isSubmitted && (
                    <div className="ml-8">
                      <h1 className="text-xl font-semibold text-gray-900 mb-2">
                        Entity Information
                      </h1>
                      <p className="text-sm text-gray-600 mb-6">
                        Register your digital entity in Bhutan's innovative business environment.
                      </p>
                      
                      <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Why Register in Bhutan?</h3>
                        <ul className="text-sm text-gray-700 space-y-2">
                          <li>• Full digital incorporation process</li>
                          <li>• Blockchain-verified certificates</li>
                          <li>• Crypto-friendly regulations</li>
                          <li>• International market access</li>
                          <li>• Virtual office solutions</li>
                        </ul>
                      </div>

                      <button
                        onClick={() => {
                          // Ensure owner/director is auto-filled when opening the form
                          if (userData?.fullName) {
                            setCompanyFormData(prev => ({
                              ...prev,
                              ownerDirector: userData.fullName
                            }));
                          }
                          setShowCompanyForm(true);
                        }}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
                      >
                        Apply for Entity Registration
                      </button>
                    </div>
                  )}

                  {showCompanyForm && (
                    <div className="ml-8">
                      <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl font-semibold text-gray-900">
                          Entity Registration
                        </h1>
                        <button
                          onClick={() => setShowCompanyForm(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Progress Steps */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between">
                          {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                currentFormStep >= step 
                                  ? 'bg-gray-900 text-white' 
                                  : 'bg-gray-200 text-gray-500'
                              }`}>
                                {step}
                              </div>
                              {step < 4 && (
                                <div className={`w-12 h-0.5 mx-2 ${
                                  currentFormStep > step ? 'bg-gray-900' : 'bg-gray-200'
                                }`} />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-600">
                          <span>Basic Info</span>
                          <span>Ownership</span>
                          <span>Documentation</span>
                          <span>Payment</span>
                        </div>
                      </div>

                      {/* Step 1: Basic Company Info */}
                      {currentFormStep === 1 && (
                        <div className="space-y-4">
                          <h2 className="text-lg font-medium text-gray-900">Section 1: Basic Company Info</h2>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company Name *
                            </label>
                            <input
                              type="text"
                              value={companyFormData.companyName}
                              onChange={(e) => handleCompanyFormChange('companyName', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                              placeholder="Enter your company name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company Type *
                            </label>
                            <select
                              value={companyFormData.companyType}
                              onChange={(e) => handleCompanyFormChange('companyType', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                            >
                              <option value="">Select company type</option>
                              <option value="LLC">LLC</option>
                              <option value="DAO">DAO</option>
                              <option value="SoloOp">SoloOp</option>
                              <option value="Co-operative">Co-operative</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Business Activity *
                            </label>
                            <textarea
                              value={companyFormData.businessActivity}
                              onChange={(e) => handleCompanyFormChange('businessActivity', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                              placeholder="Describe what your company does"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Jurisdiction
                            </label>
                            <select
                              value={companyFormData.jurisdiction}
                              onChange={(e) => handleCompanyFormChange('jurisdiction', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                            >
                              <option value="Bhutan">Bhutan</option>
                              <option value="Future">Future Jurisdictions</option>
                            </select>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="virtualOffice"
                              checked={companyFormData.virtualOfficeOptIn}
                              onChange={(e) => handleCompanyFormChange('virtualOfficeOptIn', e.target.checked)}
                              className="mr-2"
                            />
                            <label htmlFor="virtualOffice" className="text-sm text-gray-700">
                              Opt-in for Virtual Office Address
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Ownership & Control */}
                      {currentFormStep === 2 && (
                        <div className="space-y-4">
                          <h2 className="text-lg font-medium text-gray-900">Section 2: Ownership & Control</h2>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Owner/Director
                            </label>
                            <input
                              type="text"
                              value={companyFormData.ownerDirector}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                            />
                            <p className="text-xs text-gray-500 mt-1">Auto-filled from your e-Residency profile</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Co-founders (Optional)
                            </label>
                            
                            {companyFormData.coFounders.map((coFounder) => (
                              <div key={coFounder.id} className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-700 flex-1">
                                  {coFounder.name} ({coFounder.email})
                                </span>
                                <button
                                  onClick={() => removeCoFounder(coFounder.id)}
                                  className="text-red-500 hover:text-red-700 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}

                            <div className="space-y-2 mt-2">
                              <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                  type="text"
                                  placeholder="Co-founder name"
                                  value={newCoFounder.name}
                                  onChange={(e) => setNewCoFounder(prev => ({...prev, name: e.target.value}))}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                                />
                                <input
                                  type="email"
                                  placeholder="Co-founder email"
                                  value={newCoFounder.email}
                                  onChange={(e) => setNewCoFounder(prev => ({...prev, email: e.target.value}))}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                                />
                              </div>
                              <button
                                onClick={addCoFounder}
                                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
                              >
                                Add Co-founder
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Governance Model *
                            </label>
                            <select
                              value={companyFormData.governanceModel}
                              onChange={(e) => handleCompanyFormChange('governanceModel', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                            >
                              <option value="">Select governance model</option>
                              <option value="Centralized">Centralized</option>
                              <option value="Multi-sig">Multi-sig</option>
                              <option value="Token Voting">Token Voting (for DAOs)</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Documentation */}
                      {currentFormStep === 3 && (
                        <div className="space-y-4">
                          <h2 className="text-lg font-medium text-gray-900">Section 3: Documentation</h2>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Upload Bylaws / Charter (Optional)
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => handleCompanyFormChange('bylawsFile', e.target.files?.[0] || null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX files only</p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start">
                              <input
                                type="checkbox"
                                id="termsAccepted"
                                checked={companyFormData.termsAccepted}
                                onChange={(e) => handleCompanyFormChange('termsAccepted', e.target.checked)}
                                className="mt-1 mr-3"
                              />
                              <label htmlFor="termsAccepted" className="text-sm text-gray-700">
                                I agree to Bhutan's digital incorporation rules and understand that this registration will be recorded on the blockchain for transparency and verification purposes.
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 4: Payment */}
                      {currentFormStep === 4 && (
                        <div className="space-y-6">
                          <h2 className="text-lg font-medium text-gray-900">Section 4: Payment</h2>
                          
                          {/* Pricing Summary */}
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Entity Registration Fee</span>
                                <span className="text-gray-900">$299.00</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Processing Fee</span>
                                <span className="text-gray-900">$9.00</span>
                              </div>
                              {companyFormData.virtualOfficeOptIn && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Virtual Office (Annual)</span>
                                  <span className="text-gray-900">$120.00</span>
                                </div>
                              )}
                              <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-medium">
                                  <span className="text-gray-900">Total (USD)</span>
                                  <span className="text-gray-900">
                                    ${companyFormData.virtualOfficeOptIn ? '428.00' : '308.00'}
                                  </span>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-gray-600 text-xs">Bitcoin Amount</span>
                                  <span className="text-gray-900 text-xs font-mono">
                                    ≈ {companyFormData.virtualOfficeOptIn ? '0.00614' : '0.00442'} BTC
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Bitcoin Payment Details */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Your Bitcoin Address
                              </label>
                              <input
                                type="text"
                                value={companyFormData.bitcoinAddress}
                                onChange={(e) => handleCompanyFormChange('bitcoinAddress', e.target.value)}
                                placeholder="e.g. bc1q..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                              />
                            </div>
                            <div className="flex items-start gap-2">
                              <input
                                type="checkbox"
                                id="paymentConfirmed"
                                checked={companyFormData.paymentConfirmed}
                                onChange={(e) => handleCompanyFormChange('paymentConfirmed', e.target.checked)}
                                className="mt-1"
                              />
                              <label htmlFor="paymentConfirmed" className="text-sm text-gray-700">
                                I have sent the BTC payment and confirm the transaction.
                              </label>
                            </div>
                            {/* Fake payment helper for demo */}
                            {!companyFormData.paymentConfirmed && (
                              <button
                                onClick={() => {
                                  handleCompanyFormChange('bitcoinAddress', 'FAKE_BTC_ADDRESS_DEMO');
                                  handleCompanyFormChange('paymentConfirmed', true);
                                }}
                                className="text-xs text-blue-600 underline"
                              >
                                Auto-fill demo payment
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Form Navigation */}
                      <div className="flex justify-between pt-6 border-t">
                        <button
                          onClick={() => currentFormStep > 1 ? setCurrentFormStep(currentFormStep - 1) : setShowCompanyForm(false)}
                          className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                        >
                          {currentFormStep > 1 ? '← Previous' : 'Cancel'}
                        </button>
                        
                        <button
                          onClick={() => {
                            if (currentFormStep < 4) {
                              setCurrentFormStep(currentFormStep + 1)
                            } else {
                              handleFormSubmit()
                            }
                          }}
                          disabled={
                            (currentFormStep === 1 && (!companyFormData.companyName || !companyFormData.companyType || !companyFormData.businessActivity)) ||
                            (currentFormStep === 2 && !companyFormData.governanceModel) ||
                            (currentFormStep === 3 && !companyFormData.termsAccepted) ||
                            (currentFormStep === 4 && !companyFormData.paymentConfirmed) ||
                            isRegistering
                          }
                          className="bg-gray-900 text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          {currentFormStep === 4 ? (isRegistering ? 'Registering...' : 'Submit Registration') : 'Continue →'}
                        </button>
                      </div>
                    </div>
                  )}

                  {isSubmitted && companyData && (
                    <div className="ml-8 space-y-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          Entity Registered Successfully!
                        </h2>
                        <p className="text-sm text-gray-600">
                          Your entity has been incorporated in Bhutan's digital registry.
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Company Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Company Name:</span>
                            <span className="text-gray-900 font-medium">{companyData.companyName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Registration Number:</span>
                            <span className="text-gray-900 font-medium">{companyData.registrationNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tax ID:</span>
                            <span className="text-gray-900 font-medium">{companyData.taxId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Registration Date:</span>
                            <span className="text-gray-900 font-medium">{companyData.registrationDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Status:</span>
                            <span className="text-green-600 font-medium">{companyData.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={downloadCertificate}
                          className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          Download Digital Certificate
                        </button>
                        <button
                          onClick={() => {
                            setIsSubmitted(false)
                            setCompanyData(null)
                            setCompanyFormData({
                              companyName: '',
                              companyType: '',
                              businessActivity: '',
                              jurisdiction: 'Bhutan',
                              virtualOfficeOptIn: false,
                              ownerDirector: '',
                              coFounders: [],
                              governanceModel: '',
                              bylawsFile: null,
                              termsAccepted: false,
                              bitcoinAddress: '',
                              paymentConfirmed: false
                            })
                            setCurrentFormStep(1)
                          }}
                          className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          Register Another Company
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'documents' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                      Documents
                    </h1>
                    <p className="text-sm text-gray-600">
                      Download your certificates and official documents.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 