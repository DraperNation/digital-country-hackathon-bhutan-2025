import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useWallet } from '../hooks/useWallet';
import { NFTCard } from '../components/NFTCard';
import { 
  User, 
  FileText, 
  Building, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  Shield,
  Globe,
  Award,
  CreditCard,
  Download,
  Wallet,
  ExternalLink,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

interface KYCStatus {
  status: 'pending' | 'verified' | 'rejected' | null;
  submittedAt?: string;
  reviewedAt?: string;
}

interface CompanyInfo {
  name: string;
  type: string;
  incorporationDate: string;
  taxID: string;
}

interface NFTData {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { isConnected, address, isLoading, connectWallet, disconnectWallet, formatAddress } = useWallet();
  const [kycStatus, setKycStatus] = useState<KYCStatus>({ status: null });
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [userNFT, setUserNFT] = useState<NFTData | null>(null);

  // NFT collection data with corrected paths
  const nftCollection: NFTData[] = [
    {
      tokenId: 1001,
      name: "Dragon Kingdom Resident",
      description: "Official digital residency NFT for the Kingdom of Bhutan",
      image: "https://res.cloudinary.com/dpbvg2bgq/image/upload/v1751150629/n10_hzpfmi.jpg",
      rarity: "Legendary",
      attributes: [
        { trait_type: "Kingdom", value: "Bhutan" },
        { trait_type: "Status", value: "Resident" },
        { trait_type: "Year", value: "2024" },
        { trait_type: "Type", value: "Digital" }
      ]
    },
    {
      tokenId: 1002,
      name: "Thunder Dragon Guardian",
      description: "Mystical guardian of the Thunder Dragon realm",
      image: "https://res.cloudinary.com/dpbvg2bgq/image/upload/v1751150629/n9_ukcqw8.jpg",
      rarity: "Epic",
      attributes: [
        { trait_type: "Element", value: "Thunder" },
        { trait_type: "Power", value: "Guardian" },
        { trait_type: "Realm", value: "Himalayan" },
        { trait_type: "Spirit", value: "Dragon" }
      ]
    },
    {
      tokenId: 1003,
      name: "Himalayan Peaks Citizen",
      description: "Citizen of the majestic Himalayan peaks",
      image: "https://res.cloudinary.com/dpbvg2bgq/image/upload/v1751150629/n5_ba40up.jpg",
      rarity: "Rare",
      attributes: [
        { trait_type: "Mountain", value: "Himalaya" },
        { trait_type: "Elevation", value: "High" },
        { trait_type: "Climate", value: "Alpine" },
        { trait_type: "View", value: "Panoramic" }
      ]
    },
    {
      tokenId: 1004,
      name: "Monastery Wisdom Keeper",
      description: "Keeper of ancient monastery wisdom",
      image: "https://res.cloudinary.com/dpbvg2bgq/image/upload/v1751150629/n7_gzqjjw.jpg",
      rarity: "Epic",
      attributes: [
        { trait_type: "Wisdom", value: "Ancient" },
        { trait_type: "Location", value: "Monastery" },
        { trait_type: "Knowledge", value: "Sacred" },
        { trait_type: "Peace", value: "Inner" }
      ]
    },
    {
      tokenId: 1005,
      name: "Gross National Happiness Ambassador",
      description: "Ambassador of Bhutan's unique happiness philosophy",
      image: "n5.jpg",
      rarity: "Legendary",
      attributes: [
        { trait_type: "Philosophy", value: "GNH" },
        { trait_type: "Role", value: "Ambassador" },
        { trait_type: "Mission", value: "Happiness" },
        { trait_type: "Impact", value: "Global" }
      ]
    },
    {
      tokenId: 1006,
      name: "Digital Nomad Explorer",
      description: "Explorer of digital frontiers in the Dragon Kingdom",
      image: "https://res.cloudinary.com/dpbvg2bgq/image/upload/v1751150629/n6_yfbhfv.jpg",
      rarity: "Rare",
      attributes: [
        { trait_type: "Lifestyle", value: "Nomad" },
        { trait_type: "Technology", value: "Digital" },
        { trait_type: "Adventure", value: "Explorer" },
        { trait_type: "Freedom", value: "Unlimited" }
      ]
    },
    {
      tokenId: 1007,
      name: "Bhutanese Business Pioneer",
      description: "Pioneer of business innovation in Bhutan",
      image: "https://res.cloudinary.com/dpbvg2bgq/image/upload/v1751150629/n8_tsjkp6.jpg",
      rarity: "Epic",
      attributes: [
        { trait_type: "Business", value: "Pioneer" },
        { trait_type: "Innovation", value: "High" },
        { trait_type: "Market", value: "Emerging" },
        { trait_type: "Growth", value: "Exponential" }
      ]
    },
    {
      tokenId: 1008,
      name: "Cultural Heritage Guardian",
      description: "Guardian of Bhutan's rich cultural heritage",
      image: "https://res.cloudinary.com/dpbvg2bgq/image/upload/v1751150629/n3_dfhnpv.jpg",
      rarity: "Rare",
      attributes: [
        { trait_type: "Culture", value: "Traditional" },
        { trait_type: "Heritage", value: "Rich" },
        { trait_type: "Preservation", value: "Active" },
        { trait_type: "Legacy", value: "Eternal" }
      ]
    },
    {
      tokenId: 1009,
      name: "Sustainable Future Builder",
      description: "Builder of sustainable future in the Dragon Kingdom",
      image: "https://res.cloudinary.com/dpbvg2bgq/image/upload/v1751150629/n1_uterl0.jpg",
      rarity: "Epic",
      attributes: [
        { trait_type: "Sustainability", value: "Carbon Negative" },
        { trait_type: "Future", value: "Green" },
        { trait_type: "Environment", value: "Protected" },
        { trait_type: "Vision", value: "2050" }
      ]
    },
    {
      tokenId: 1010,
      name: "Enlightened Digital Citizen",
      description: "Enlightened citizen of the digital age",
      image: "https://res.cloudinary.com/dpbvg2bgq/image/upload/v1751150630/n2_ksl1fz.jpg",
      rarity: "Common",
      attributes: [
        { trait_type: "Enlightenment", value: "Digital" },
        { trait_type: "Citizenship", value: "Global" },
        { trait_type: "Awareness", value: "Mindful" },
        { trait_type: "Connection", value: "Universal" }
      ]
    }
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  // Award NFT when wallet is connected
  useEffect(() => {
    if (isConnected && !userNFT && !localStorage.getItem('userNFT')) {
      const randomIndex = Math.floor(Math.random() * nftCollection.length);
      const assignedNFT = nftCollection[randomIndex];
      setUserNFT(assignedNFT);
      localStorage.setItem('userNFT', JSON.stringify(assignedNFT));
      toast.success('🎉 Congratulations! You received an exclusive NFT for connecting your wallet!');
    } else if (localStorage.getItem('userNFT')) {
      const savedNFT = JSON.parse(localStorage.getItem('userNFT') || '{}');
      setUserNFT(savedNFT);
    }
  }, [isConnected, userNFT, nftCollection]);

  const fetchUserData = async () => {
    try {
      setTimeout(() => {
        // Check if user has submitted KYC
        const kycSubmitted = localStorage.getItem('kycSubmitted');
        const kycSubmissionTime = localStorage.getItem('kycSubmissionTime');
        
        if (kycSubmitted && kycSubmissionTime) {
          const submissionTime = parseInt(kycSubmissionTime);
          const currentTime = Date.now();
          const timeDiff = currentTime - submissionTime;
          
          // Auto-approve after 10 seconds
          if (timeDiff >= 10000) {
            setKycStatus({ 
              status: 'verified',
              submittedAt: new Date(submissionTime).toISOString(),
              reviewedAt: new Date().toISOString()
            });
          } else {
            setKycStatus({ 
              status: 'pending',
              submittedAt: new Date(submissionTime).toISOString()
            });
            
            // Set timeout to auto-approve
            const remainingTime = 10000 - timeDiff;
            setTimeout(() => {
              setKycStatus({ 
                status: 'verified',
                submittedAt: new Date(submissionTime).toISOString(),
                reviewedAt: new Date().toISOString()
              });
              toast.success('🎉 KYC Approved! Your identity has been verified.');
            }, remainingTime);
          }
        } else {
          setKycStatus({ status: null });
        }
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to fetch user data');
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Not Submitted';
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'verified':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'pending':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'rejected':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded mb-6"></div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="h-64 bg-white/20 rounded-lg"></div>
            <div className="h-64 bg-white/20 rounded-lg"></div>
          </div>
          <div className="h-48 bg-white/20 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className={`text-2xl sm:text-3xl font-display font-bold text-shadow-strong ${
          theme === 'dark' ? 'text-white' : 'text-black'
        }`}>
          Welcome, {currentUser?.displayName || 'Digital Resident'}
        </h1>
        <p className={`mt-2 ${
          theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
        }`}>
          Manage your Bhutan eResidency account and services.
        </p>
      </div>

      {/* Wallet Connection */}
      <div className="glass-card p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <Wallet className="h-6 w-6 text-purple-400 mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className={`text-lg font-display font-semibold text-shadow ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>Polygon Wallet</h3>
              <p className={`text-sm break-all ${
                theme === 'dark' ? 'text-white/80 text-shadow' : 'text-slate-600'
              }`}>
                {isConnected ? `Connected: ${formatAddress(address!)}` : 'Connect your MetaMask wallet to receive exclusive NFTs'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            {isConnected && (
              <button
                onClick={() => window.open(`https://polygonscan.com/address/${address}`, '_blank')}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
                title="View on PolygonScan"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={isConnected ? disconnectWallet : connectWallet}
              disabled={isLoading}
              className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors btn-mobile ${
                isConnected
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
              } disabled:opacity-50`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="hidden sm:inline">Connecting...</span>
                </div>
              ) : isConnected ? (
                'Disconnect'
              ) : (
                <span className="hidden sm:inline">Connect MetaMask</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
        {/* KYC Status Card */}
        <div className="glass-card p-4 sm:p-6 rounded-xl shadow-lg border border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className={`text-lg sm:text-xl font-display font-semibold flex items-center text-shadow ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              <Shield className="h-6 w-6 mr-3 text-orange-400 flex-shrink-0" />
              Identity Verification
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center border self-start sm:self-auto ${getStatusColor(kycStatus.status)}`}>
              {getStatusIcon(kycStatus.status)}
              <span className="ml-2">{getStatusText(kycStatus.status)}</span>
            </span>
          </div>

          <div className="space-y-4">
            {kycStatus.status === null ? (
              <>
                <div className="bg-blue-50/90 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-blue-900 mb-1">Complete Your Verification</h3>
                      <p className="text-blue-700 text-sm">
                        Submit your identity documents to access all eResidency features.
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  to="/kyc"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium shadow-lg btn-mobile"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Start Verification
                </Link>
              </>
            ) : kycStatus.status === 'pending' ? (
              <>
                <div className="bg-amber-50/90 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-amber-900 mb-1">Under Review</h3>
                      <p className="text-amber-700 text-sm">
                        Your documents are being reviewed. This typically takes 1-3 business days.
                      </p>
                    </div>
                  </div>
                </div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-white/80 text-shadow' : 'text-slate-600'
                }`}>
                  Submitted: {new Date(kycStatus.submittedAt!).toLocaleDateString()}
                </p>
              </>
            ) : (
              <>
                <div className="bg-green-50/90 p-4 rounded-lg border border-green-200">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-green-900 mb-1">Verification Complete</h3>
                      <p className="text-green-700 text-sm">
                        Your identity has been verified. You now have access to all eResidency features.
                      </p>
                    </div>
                  </div>
                </div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-white/80 text-shadow' : 'text-slate-600'
                }`}>
                  Verified: {new Date(kycStatus.reviewedAt!).toLocaleDateString()}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Digital Identity Card */}
        <div className="glass-card p-4 sm:p-6 rounded-xl shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg sm:text-xl font-display font-semibold flex items-center text-shadow ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              <CreditCard className="h-6 w-6 mr-3 text-orange-400 flex-shrink-0" />
              Digital Identity
            </h2>
          </div>

          <div className="space-y-4">
            {kycStatus.status !== 'verified' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-white/60" />
                </div>
                <h3 className={`text-lg font-medium mb-2 text-shadow ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>Verification Required</h3>
                <p className={`text-sm max-w-sm mx-auto ${
                  theme === 'dark' ? 'text-white/80 text-shadow' : 'text-slate-600'
                }`}>
                  Complete your identity verification to receive your digital residency card.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 rounded-lg border border-orange-300/30">
                  <div className="flex items-start">
                    <Award className="h-5 w-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className={`font-medium mb-1 text-shadow ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>Digital Residency Active</h3>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-700'
                      }`}>
                        Your NFT-based digital identity card is ready for download.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <Link
                    to="/identity"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium shadow-lg btn-mobile"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    View Identity
                  </Link>
                  <Link
                    to="/certificates"
                    className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg transition-colors font-medium border btn-mobile ${
                      theme === 'dark'
                        ? 'bg-white/20 text-white hover:bg-white/30 border-white/30'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                    }`}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Certificates
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* NFT Display */}
      {userNFT && isConnected && (
        <div className="glass-card p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className={`text-xl sm:text-2xl font-display font-bold text-shadow ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>Your Exclusive NFT</h2>
            <div className="flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium self-start sm:self-auto">
              <Zap className="h-4 w-4 mr-1" />
              Minted on Polygon
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <NFTCard {...userNFT} />
          </div>
        </div>
      )}

      {/* Business Registration Card */}
      <div className="glass-card p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg sm:text-xl font-display font-semibold flex items-center text-shadow ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            <Building className="h-6 w-6 mr-3 text-orange-400 flex-shrink-0" />
            Business Registration
          </h2>
        </div>

        <div className="space-y-4">
          {kycStatus.status !== 'verified' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-white/60" />
              </div>
              <h3 className={`text-lg font-medium mb-2 text-shadow ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>Verification Required</h3>
              <p className={`text-sm max-w-sm mx-auto ${
                theme === 'dark' ? 'text-white/80 text-shadow' : 'text-slate-600'
              }`}>
                Complete your identity verification to access business registration services.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-green-50/90 p-4 rounded-lg border border-green-200">
                <div className="flex items-start">
                  <Globe className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-green-900 mb-1">Ready to Register</h3>
                    <p className="text-green-700 text-sm">
                      You can now register your business in Bhutan and access global markets.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                to="/business"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium shadow-lg btn-mobile"
              >
                <Building className="h-4 w-4 mr-2" />
                Register Business
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Services Grid */}
      <div className="glass-card p-4 sm:p-6 rounded-xl shadow-lg border border-white/20">
        <h2 className={`text-xl sm:text-2xl font-display font-bold mb-6 text-shadow ${
          theme === 'dark' ? 'text-white' : 'text-black'
        }`}>Available Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Link
            to="/kyc"
            className="group p-4 sm:p-6 bg-white/10 border border-white/20 rounded-lg hover:border-orange-300/50 hover:bg-white/20 transition-all duration-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className={`font-display font-semibold mb-2 text-shadow ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>Update Documents</h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-white/80 text-shadow' : 'text-slate-600'
            }`}>Manage your verification documents and status</p>
          </Link>

          <Link
            to="/business-services"
            className="group p-4 sm:p-6 bg-white/10 border border-white/20 rounded-lg hover:border-orange-300/50 hover:bg-white/20 transition-all duration-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
            <h3 className={`font-display font-semibold mb-2 text-shadow ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>Business Services</h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-white/80 text-shadow' : 'text-slate-600'
            }`}>Access business registration and management tools</p>
          </Link>

          <Link
            to="/identity"
            className="group p-4 sm:p-6 bg-white/10 border border-white/20 rounded-lg hover:border-orange-300/50 hover:bg-white/20 transition-all duration-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <h3 className={`font-display font-semibold mb-2 text-shadow ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>Digital Identity</h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-white/80 text-shadow' : 'text-slate-600'
            }`}>Manage your digital identity and credentials</p>
          </Link>
        </div>
      </div>
    </div>
  );
};