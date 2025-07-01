
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { useNavigate } from 'react-router-dom';
import { Shield, User, FileText, CreditCard, Download, Settings, LogOut, Award, Building2, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UserData {
  fullName: string;
  phoneNumber: string;
  email: string;
  walletAddress: string;
  decentralizedId: string;
  createdAt: string;
}

interface BusinessSummary {
  totalBusinesses: number;
  activeBusinesses: number;
  totalFeesSpent: number;
  totalGnhContributions: number;
  recentBusinesses: Array<{
    id: string;
    business_id: string;
    business_name: string;
    business_type: string;
    verification_status: string;
    created_at: string;
  }>;
}

const Dashboard = () => {
  const { isConnected, account, disconnectWallet } = useWallet();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [attestationCount, setAttestationCount] = useState(0);
  const [businessSummary, setBusinessSummary] = useState<BusinessSummary>({
    totalBusinesses: 0,
    activeBusinesses: 0,
    totalFeesSpent: 0,
    totalGnhContributions: 0,
    recentBusinesses: []
  });

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
      return;
    }

    // Load user data from localStorage (in real app, this would be from Supabase)
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
      fetchAttestationCount();
      fetchBusinessSummary();
    } else {
      navigate('/kyc');
    }
  }, [isConnected, navigate]);

  const fetchAttestationCount = async () => {
    try {
      const { count, error } = await supabase
        .from('digital_attestations')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setAttestationCount(count || 0);
    } catch (error) {
      console.error('Error fetching attestation count:', error);
    }
  };

  const fetchBusinessSummary = async () => {
    try {
      // Fetch businesses
      const { data: businesses, error: businessError } = await supabase
        .from('business_registrations')
        .select('id, business_id, business_name, business_type, verification_status, total_fees_paid, total_gnh_contributions, created_at')
        .order('created_at', { ascending: false });

      if (businessError) throw businessError;

      if (businesses) {
        const totalBusinesses = businesses.length;
        const activeBusinesses = businesses.filter(b => b.verification_status === 'active').length;
        const totalFeesSpent = businesses.reduce((sum, b) => sum + (b.total_fees_paid || 0), 0);
        const totalGnhContributions = businesses.reduce((sum, b) => sum + (b.total_gnh_contributions || 0), 0);
        const recentBusinesses = businesses.slice(0, 3);

        setBusinessSummary({
          totalBusinesses,
          activeBusinesses,
          totalFeesSpent,
          totalGnhContributions,
          recentBusinesses
        });
      }
    } catch (error) {
      console.error('Error fetching business summary:', error);
    }
  };

  const handleLogout = () => {
    disconnectWallet();
    localStorage.removeItem('userData');
    navigate('/');
  };

  const handleDownloadCertificate = () => {
    // In a real app, this would call an API to generate and download a PDF
    toast.success('Certificate download feature will be available soon!');
  };

  const handleContributeGNH = async () => {
    try {
      // Simulate a small transaction to GNH Fund
      toast.success('Thank you for contributing to Gross National Happiness Fund!');
    } catch (error) {
      toast.error('Transaction failed. Please try again.');
    }
  };

  const handleViewAttestations = () => {
    navigate('/dashboard/attestations');
  };

  if (!userData) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-druk-gold mx-auto mb-4"></div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-druk-gold/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gradient">Druk e-Residency</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-300">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </span>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {userData.fullName}!
          </h2>
          <p className="text-slate-300">
            Manage your digital identity and access exclusive e-Residency services
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* DID Card */}
            <Card className="card-druk">
              <CardHeader>
                <CardTitle className="flex items-center text-druk-crimson">
                  <Shield className="w-6 h-6 mr-2" />
                  Your Decentralized Identity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-druk-crimson via-druk-ruby to-druk-gold p-6 rounded-lg text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-lg font-semibold mb-2">Digital ID Card</h3>
                    <p className="text-sm opacity-90 mb-4">Druk e-Residency Certificate</p>
                    
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {userData.fullName}</p>
                      <p><strong>DID:</strong> {userData.decentralizedId}</p>
                      <p><strong>Issued:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> <span className="text-green-300">Active</span></p>
                    </div>
                  </div>
                  
                  {/* Decorative Pattern */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 border-2 border-white/20 rounded-full"></div>
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 border border-white/10 rounded-full"></div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={handleDownloadCertificate} variant="outline" className="border-druk-gold text-druk-gold hover:bg-druk-gold hover:text-black">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                  <Button onClick={() => navigate('/dashboard/upgrade-profile')} variant="outline" className="border-druk-sapphire text-druk-sapphire hover:bg-druk-sapphire hover:text-black">
                    <Settings className="w-4 h-4 mr-2" />
                    Upgrade Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Business Summary */}
            {businessSummary.totalBusinesses > 0 && (
              <Card className="card-druk">
                <CardHeader>
                  <CardTitle className="flex items-center text-druk-crimson">
                    <Building2 className="w-6 h-6 mr-2" />
                    Your Business Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm">Total Businesses</p>
                          <p className="text-2xl font-bold text-white">{businessSummary.totalBusinesses}</p>
                        </div>
                        <Building2 className="w-8 h-8 text-druk-gold" />
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm">Active</p>
                          <p className="text-2xl font-bold text-green-400">{businessSummary.activeBusinesses}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm">Total Fees Paid</p>
                          <p className="text-xl font-bold text-druk-amber">BTN {businessSummary.totalFeesSpent.toLocaleString()}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-druk-amber" />
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm">GNH Contributions</p>
                          <p className="text-xl font-bold text-druk-emerald">BTN {businessSummary.totalGnhContributions.toLocaleString()}</p>
                        </div>
                        <Award className="w-8 h-8 text-druk-emerald" />
                      </div>
                    </div>
                  </div>

                  {businessSummary.recentBusinesses.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-druk-gold mb-3">Recent Businesses</h4>
                      <div className="space-y-2">
                        {businessSummary.recentBusinesses.map((business) => (
                          <div key={business.id} className="flex items-center justify-between bg-slate-800/30 p-3 rounded-lg">
                            <div>
                              <p className="font-medium text-white">{business.business_name}</p>
                              <p className="text-sm text-slate-400">ID: {business.business_id}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                business.verification_status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {business.verification_status}
                              </span>
                              <p className="text-xs text-slate-400 mt-1">
                                {new Date(business.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button 
                        onClick={() => navigate('/business-residency')} 
                        className="w-full mt-4 btn-druk"
                      >
                        Manage All Businesses
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Web3 Features */}
            <Card className="card-druk">
              <CardHeader>
                <CardTitle className="text-druk-crimson">Web3 Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button
                    onClick={handleContributeGNH}
                    className="bg-druk-emerald hover:bg-druk-emerald/80 text-white"
                  >
                    Contribute to GNH Fund
                  </Button>
                  <Button 
                    onClick={handleViewAttestations}
                    variant="outline"
                    className="border-druk-amber text-druk-amber hover:bg-druk-amber hover:text-black"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    View Attestations ({attestationCount})
                  </Button>
                </div>
                
                <div className="bg-druk-sapphire/20 border border-druk-sapphire/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-druk-sapphire mb-2">Your e-Residency Status</h4>
                  <p className="text-slate-300 text-sm">
                    ✓ Active since {new Date(userData.createdAt).toLocaleDateString()}
                  </p>
                  {businessSummary.totalBusinesses > 0 && (
                    <p className="text-slate-300 text-sm">
                      ✓ Business operator with {businessSummary.totalBusinesses} registered {businessSummary.totalBusinesses === 1 ? 'business' : 'businesses'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Panel */}
          <div className="space-y-6">
            <Card className="card-druk">
              <CardHeader>
                <CardTitle className="text-druk-crimson">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => navigate('/dashboard/services')}
                  variant="outline"
                  className="w-full justify-start border-druk-gold text-druk-gold hover:bg-druk-gold hover:text-black"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Services
                </Button>
                <Button
                  onClick={() => navigate('/business-residency')}
                  variant="outline"
                  className="w-full justify-start border-druk-emerald text-druk-emerald hover:bg-druk-emerald hover:text-black"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Business Residency
                  {businessSummary.totalBusinesses > 0 && (
                    <span className="ml-auto bg-druk-emerald text-white text-xs px-2 py-1 rounded-full">
                      {businessSummary.totalBusinesses}
                    </span>
                  )}
                </Button>
                <Button
                  onClick={() => navigate('/dashboard/upgrade-profile')}
                  variant="outline"
                  className="w-full justify-start border-druk-sapphire text-druk-sapphire hover:bg-druk-sapphire hover:text-black"
                >
                  <User className="w-4 h-4 mr-2" />
                  Upgrade Profile
                </Button>
              </CardContent>
            </Card>

            {/* User Info */}
            <Card className="card-druk">
              <CardHeader>
                <CardTitle className="text-druk-crimson">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-druk-gold">Email:</span>
                  <p className="text-slate-300">{userData.email}</p>
                </div>
                <div>
                  <span className="font-medium text-druk-gold">Phone:</span>
                  <p className="text-slate-300">{userData.phoneNumber}</p>
                </div>
                <div>
                  <span className="font-medium text-druk-gold">Wallet:</span>
                  <p className="text-slate-300 font-mono text-xs">
                    {userData.walletAddress}
                  </p>
                </div>
                {businessSummary.totalGnhContributions > 0 && (
                  <div>
                    <span className="font-medium text-druk-gold">GNH Impact:</span>
                    <p className="text-druk-emerald font-semibold">
                      BTN {businessSummary.totalGnhContributions.toLocaleString()} contributed
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
