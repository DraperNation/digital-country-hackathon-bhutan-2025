import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  CreditCard, 
  Download, 
  Share2, 
  QrCode, 
  Shield, 
  Award, 
  Globe,
  Copy,
  ExternalLink,
  CheckCircle,
  Mountain,
  Building2,
  Star,
  Calendar,
  MapPin,
  User,
  Hash
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Identity: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const identityData = {
    id: `BHU-${Date.now().toString().slice(-8)}`,
    issueDate: new Date().toLocaleDateString(),
    expiryDate: 'Lifetime',
    status: 'Active',
    blockchainHash: '0x' + Math.random().toString(16).substr(2, 40),
    nftTokenId: Math.floor(Math.random() * 10000)
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(identityData.blockchainHash);
    setCopied(true);
    toast.success('Blockchain hash copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCard = () => {
    // Create a canvas to generate the ID card
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 500;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f97316');
    gradient.addColorStop(0.5, '#dc2626');
    gradient.addColorStop(1, '#f97316');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add Bhutan flag colors accent
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(0, 0, canvas.width, 20);
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    
    // Add text content
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('KINGDOM OF BHUTAN', 50, 80);
    
    ctx.font = '20px Arial';
    ctx.fillText('Digital Residency Card', 50, 110);
    
    ctx.font = 'bold 28px Arial';
    ctx.fillText(currentUser?.displayName || 'Digital Resident', 50, 180);
    
    ctx.font = '18px Arial';
    ctx.fillText(`ID: ${identityData.id}`, 50, 220);
    ctx.fillText(`Issued: ${identityData.issueDate}`, 50, 250);
    ctx.fillText(`Status: ${identityData.status}`, 50, 280);
    ctx.fillText(`Valid: ${identityData.expiryDate}`, 50, 310);
    
    // Add QR code placeholder
    ctx.fillStyle = 'white';
    ctx.fillRect(600, 150, 150, 150);
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText('QR CODE', 640, 235);
    
    // Add Bhutan emblem placeholder
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(650, 80, 40, 0, 2 * Math.PI);
    ctx.fill();
    
    // Download the image
    const link = document.createElement('a');
    link.download = `bhutan-eresidency-${identityData.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast.success('Digital residency card downloaded successfully!');
  };

  const handleShareLinkedIn = () => {
    const text = `Proud to be a digital resident of the Kingdom of Bhutan! 🇧🇹 Embracing Gross National Happiness and global entrepreneurship. #BhutanEResidency #DigitalNomad #GrossNationalHappiness`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareTwitter = () => {
    const text = `Just became a digital resident of Bhutan! 🇧🇹 Excited to be part of the world's happiest nation and explore global business opportunities. #BhutanEResidency #DigitalResident #ThunderDragon`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center px-6 py-3 glass-card rounded-full text-sm font-medium mb-8 border border-white/30 ${
            theme === 'dark' ? 'text-white' : 'text-slate-800'
          }`}>
            <CreditCard className="h-4 w-4 mr-2 text-orange-400" />
            Digital Identity Credentials
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-display font-bold mb-8 text-shadow-strong ${
            theme === 'dark' ? 'text-white' : 'text-slate-800'
          }`}>
            Your <span className="text-saffron">Digital Identity</span>
          </h1>
          
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
          }`}>
            Your official digital residency card and NFT-based credentials for the Kingdom of Bhutan.
          </p>
        </div>

        {/* Stunning NFT-Style Digital ID Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            {/* Card Container with 3D Effect */}
            <div className="relative transform hover:scale-105 transition-all duration-500 perspective-1000">
              {/* Holographic Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl blur-sm opacity-75 animate-pulse"></div>
              
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 border border-white/20 overflow-hidden shadow-2xl">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 animate-pulse"></div>
                  <Mountain className="absolute top-4 right-4 h-32 w-32 text-white/10 transform rotate-12" />
                  <Building2 className="absolute bottom-4 left-4 h-24 w-24 text-white/10 transform -rotate-12" />
                </div>
                
                {/* Card Header */}
                <div className="relative z-10 flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">KINGDOM OF BHUTAN</h3>
                        <p className="text-orange-300 text-sm font-medium">Digital Residency Card</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-xs font-medium mb-2">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      VERIFIED
                    </div>
                    <div className="text-white/60 text-xs">NFT ID: #{identityData.nftTokenId}</div>
                  </div>
                </div>
                
                {/* User Information */}
                <div className="relative z-10 mb-8">
                  <div className="flex items-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mr-6 shadow-xl">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {currentUser?.displayName || 'Digital Resident'}
                      </h2>
                      <p className="text-orange-300 font-medium">Digital Resident</p>
                      <p className="text-white/60 text-sm">{currentUser?.email}</p>
                    </div>
                  </div>
                </div>
                
                {/* Card Details Grid */}
                <div className="relative z-10 grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 text-orange-400 mr-2" />
                      <div>
                        <p className="text-white/60 text-xs">ID Number</p>
                        <p className="text-white font-mono text-sm">{identityData.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-orange-400 mr-2" />
                      <div>
                        <p className="text-white/60 text-xs">Issued</p>
                        <p className="text-white text-sm">{identityData.issueDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-orange-400 mr-2" />
                      <div>
                        <p className="text-white/60 text-xs">Status</p>
                        <p className="text-green-300 text-sm font-medium">{identityData.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-orange-400 mr-2" />
                      <div>
                        <p className="text-white/60 text-xs">Validity</p>
                        <p className="text-white text-sm">{identityData.expiryDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* QR Code and Blockchain Info */}
                <div className="relative z-10 flex justify-between items-end">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                      <QrCode className="h-10 w-10 text-slate-800" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Blockchain Verified</p>
                      <p className="text-orange-300 text-xs font-mono">
                        {identityData.blockchainHash.slice(0, 12)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-xs">Powered by</p>
                    <p className="text-orange-300 text-sm font-bold">Thunder Dragon Tech</p>
                  </div>
                </div>
                
                {/* Holographic Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={handleDownloadCard}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-colors font-medium shadow-lg group"
            >
              <Download className="h-5 w-5 mr-2 group-hover:animate-bounce" />
              Download Card
            </button>
            
            <button
              onClick={handleShareLinkedIn}
              className={`flex items-center justify-center px-6 py-4 rounded-xl transition-colors font-medium border ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'
                  : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'
              }`}
            >
              <Share2 className="h-5 w-5 mr-2" />
              LinkedIn
            </button>
            
            <button
              onClick={handleShareTwitter}
              className={`flex items-center justify-center px-6 py-4 rounded-xl transition-colors font-medium border ${
                theme === 'dark'
                  ? 'bg-sky-500 hover:bg-sky-600 text-white border-sky-400'
                  : 'bg-sky-500 hover:bg-sky-600 text-white border-sky-400'
              }`}
            >
              <Share2 className="h-5 w-5 mr-2" />
              Twitter
            </button>
          </div>
        </div>

        {/* Verification Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="glass-card p-6 rounded-xl border border-white/20">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-green-400 mr-3" />
              <h3 className={`text-lg font-display font-semibold ${
                theme === 'dark' ? 'text-white text-shadow' : 'text-slate-800'
              }`}>Verification Status</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-700'}>Identity Verified</span>
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className={theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-700'}>Biometric Confirmed</span>
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className={theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-700'}>Blockchain Secured</span>
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className={theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-700'}>Government Approved</span>
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl border border-white/20">
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-blue-400 mr-3" />
              <h3 className={`text-lg font-display font-semibold ${
                theme === 'dark' ? 'text-white text-shadow' : 'text-slate-800'
              }`}>Blockchain Details</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-white/70 text-shadow' : 'text-slate-500'
                }`}>Transaction Hash</p>
                <div className="flex items-center">
                  <p className={`font-mono text-xs truncate mr-2 ${
                    theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-700'
                  }`}>
                    {identityData.blockchainHash}
                  </p>
                  <button
                    onClick={handleCopyHash}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className={`h-4 w-4 ${theme === 'dark' ? 'text-white/60' : 'text-slate-400'}`} />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-white/70 text-shadow' : 'text-slate-500'
                }`}>Network</p>
                <p className={theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-700'}>Polygon Mainnet</p>
              </div>
              
              <div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-white/70 text-shadow' : 'text-slate-500'
                }`}>Token Standard</p>
                <p className={theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-700'}>ERC-721 (NFT)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="glass-card p-8 rounded-xl border border-white/20">
          <h2 className={`text-2xl font-display font-bold mb-6 ${
            theme === 'dark' ? 'text-white text-shadow' : 'text-slate-800'
          }`}>Your Digital Residency Benefits</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h3 className={`font-semibold mb-2 ${
                theme === 'dark' ? 'text-white text-shadow' : 'text-slate-800'
              }`}>Business Formation</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
              }`}>Register companies and access global markets</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className={`font-semibold mb-2 ${
                theme === 'dark' ? 'text-white text-shadow' : 'text-slate-800'
              }`}>International Banking</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
              }`}>Access global banking and payment systems</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className={`font-semibold mb-2 ${
                theme === 'dark' ? 'text-white text-shadow' : 'text-slate-800'
              }`}>Tax Optimization</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
              }`}>Benefit from Bhutan's favorable tax policies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};