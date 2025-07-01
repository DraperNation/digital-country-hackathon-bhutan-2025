
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/WalletContext';
import { useNavigate } from 'react-router-dom';
import { Building, ArrowLeft, CreditCard, CheckCircle, Clock, AlertCircle, Banknote, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface BusinessRegistration {
  id: string;
  business_id: string;
  business_name: string;
  business_type: string;
  business_email: string;
  business_address: string | null;
  license_type: string | null;
  annual_revenue_range: string | null;
  employee_count: number;
  business_sector: string | null;
  verification_status: string;
  registration_fee_paid: number;
  license_fee_paid: number;
  total_fees_paid: number;
  total_gnh_contributions: number;
  created_at: string;
  wallet_address: string;
}

interface BusinessTransaction {
  id: string;
  transaction_id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
  payment_method: string | null;
  created_at: string;
}

const BusinessResidency = () => {
  const { isConnected, account, signMessage } = useWallet();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'register' | 'manage' | 'transactions'>('register');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [businesses, setBusinesses] = useState<BusinessRegistration[]>([]);
  const [transactions, setTransactions] = useState<BusinessTransaction[]>([]);
  const [paymentStep, setPaymentStep] = useState<'form' | 'payment' | 'success'>('form');
  const [pendingRegistration, setPendingRegistration] = useState<any>(null);

  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessType: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    licenseType: '',
    annualRevenueRange: '',
    employeeCount: 0,
    businessSector: ''
  });

  const businessTypes = [
    { value: 'sole_proprietorship', label: 'Sole Proprietorship', registrationFee: 5000, description: 'Individual ownership' },
    { value: 'partnership', label: 'Partnership', registrationFee: 10000, description: 'Two or more partners' },
    { value: 'corporation', label: 'Corporation', registrationFee: 25000, description: 'Corporate entity' },
    { value: 'ngo', label: 'NGO', registrationFee: 2500, description: 'Non-profit organization' }
  ];

  const licenseTypes = [
    { value: 'trade', label: 'Trade License', fee: 3000, description: 'General trading activities' },
    { value: 'manufacturing', label: 'Manufacturing License', fee: 15000, description: 'Production and manufacturing' },
    { value: 'tourism', label: 'Tourism License', fee: 8000, description: 'Tourism and hospitality' },
    { value: 'technology', label: 'Technology License', fee: 12000, description: 'IT and technology services' },
    { value: 'financial', label: 'Financial Services License', fee: 50000, description: 'Banking and financial services' }
  ];

  const revenueRanges = [
    'Under BTN 100,000',
    'BTN 100,000 - 500,000',
    'BTN 500,000 - 1,000,000',
    'BTN 1,000,000 - 5,000,000',
    'Above BTN 5,000,000'
  ];

  const businessSectors = [
    'Agriculture', 'Tourism', 'Technology', 'Manufacturing', 'Services',
    'Healthcare', 'Education', 'Finance', 'Retail', 'Construction'
  ];

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
      return;
    }
    fetchBusinesses();
    fetchTransactions();
  }, [isConnected, navigate]);

  const fetchBusinesses = async () => {
    if (!account) return;
    
    try {
      const { data, error } = await supabase
        .from('business_registrations')
        .select('*')
        .eq('wallet_address', account)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching businesses:', error);
        return;
      }
      
      setBusinesses(data || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  const fetchTransactions = async () => {
    if (!account) return;
    
    try {
      // First get business IDs for this wallet
      const { data: businessData, error: businessError } = await supabase
        .from('business_registrations')
        .select('id')
        .eq('wallet_address', account);

      if (businessError) {
        console.error('Error fetching business IDs:', businessError);
        return;
      }
      
      if (businessData && businessData.length > 0) {
        const businessIds = businessData.map(b => b.id);
        
        const { data, error } = await supabase
          .from('business_transactions')
          .select('*')
          .in('business_id', businessIds)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching transactions:', error);
          return;
        }
        
        setTransactions(data || []);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const calculateFees = () => {
    const businessType = businessTypes.find(bt => bt.value === businessData.businessType);
    const licenseType = licenseTypes.find(lt => lt.value === businessData.licenseType);
    
    const registrationFee = businessType?.registrationFee || 0;
    const licenseFee = licenseType?.fee || 0;
    const complianceFee = Math.floor(registrationFee * 0.1);
    
    return { registrationFee, licenseFee, complianceFee, total: registrationFee + licenseFee };
  };

  const handleBusinessRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessData.businessName || !businessData.businessType || !businessData.businessEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    const fees = calculateFees();
    const businessDid = `did:bhutan:business:${account?.slice(2, 10).toLowerCase()}:${Date.now()}`;
    
    setPendingRegistration({
      ...businessData,
      businessDid,
      fees
    });
    
    setPaymentStep('payment');
  };

  const simulatePayment = async () => {
    setIsProcessingPayment(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Sign the DID for digital verification
      const signature = await signMessage(pendingRegistration.businessDid);
      if (!signature) {
        throw new Error('Digital signature required for business registration');
      }

      console.log('Creating business registration with wallet address:', account);

      // Generate unique business ID
      const businessId = `BHU-BIZ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Create business registration - use a generated UUID for owner_user_id and store wallet separately
      const tempUserId = crypto.randomUUID(); // Generate a proper UUID for the owner_user_id field
      
      const { data: businessData, error: businessError } = await supabase
        .from('business_registrations')
        .insert({
          owner_user_id: tempUserId, // Use generated UUID for database requirement
          business_id: businessId,
          business_name: pendingRegistration.businessName,
          business_type: pendingRegistration.businessType,
          business_email: pendingRegistration.businessEmail,
          business_phone: pendingRegistration.businessPhone || null,
          business_address: pendingRegistration.businessAddress || null,
          license_type: pendingRegistration.licenseType || null,
          annual_revenue_range: pendingRegistration.annualRevenueRange || null,
          employee_count: pendingRegistration.employeeCount || 0,
          business_sector: pendingRegistration.businessSector || null,
          business_did: pendingRegistration.businessDid,
          did_signature: signature,
          registration_fee_paid: pendingRegistration.fees.registrationFee,
          license_fee_paid: pendingRegistration.fees.licenseFee,
          annual_compliance_fee: pendingRegistration.fees.complianceFee,
          total_fees_paid: pendingRegistration.fees.total,
          wallet_address: account || '', // Store wallet address separately
          verification_status: 'active'
        })
        .select()
        .single();

      if (businessError) {
        console.error('Business registration error:', businessError);
        throw new Error(`Failed to register business: ${businessError.message}`);
      }

      console.log('Business registered successfully:', businessData);

      // Generate unique transaction IDs
      const regTxnId = `TXN-${Date.now()}-REG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const licTxnId = `TXN-${Date.now()}-LIC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Create registration fee transaction
      const { error: regTxnError } = await supabase.from('business_transactions').insert({
        transaction_id: regTxnId,
        business_id: businessData.id,
        transaction_type: 'registration_fee',
        amount: pendingRegistration.fees.registrationFee,
        currency: 'BTN',
        description: `Business registration fee for ${pendingRegistration.businessName}`,
        payment_method: 'wallet',
        status: 'completed'
      });

      if (regTxnError) {
        console.error('Registration transaction error:', regTxnError);
      }

      // Create license fee transaction if applicable
      if (pendingRegistration.fees.licenseFee > 0) {
        const { error: licTxnError } = await supabase.from('business_transactions').insert({
          transaction_id: licTxnId,
          business_id: businessData.id,
          transaction_type: 'license_fee',
          amount: pendingRegistration.fees.licenseFee,
          currency: 'BTN',
          description: `${pendingRegistration.licenseType} license fee`,
          payment_method: 'wallet',
          status: 'completed'
        });

        if (licTxnError) {
          console.error('License transaction error:', licTxnError);
        }
      }

      // Create initial business analytics record
      const { error: analyticsError } = await supabase.from('business_analytics').insert({
        business_id: businessData.id,
        reporting_year: new Date().getFullYear(),
        employees_count: pendingRegistration.employeeCount || 0,
        compliance_score: 85,
        sustainability_score: 75
      });

      if (analyticsError) {
        console.error('Analytics error:', analyticsError);
      }

      setPaymentStep('success');
      toast.success('Business registered successfully!');
      
      // Refresh data
      await fetchBusinesses();
      await fetchTransactions();
      
    } catch (error) {
      console.error('Error registering business:', error);
      toast.error(`Failed to register business: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setPaymentStep('form');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const resetRegistration = () => {
    setPaymentStep('form');
    setPendingRegistration(null);
    setBusinessData({
      businessName: '',
      businessType: '',
      businessEmail: '',
      businessPhone: '',
      businessAddress: '',
      licenseType: '',
      annualRevenueRange: '',
      employeeCount: 0,
      businessSector: ''
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><AlertCircle className="w-3 h-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <Card className="card-druk max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-bold text-druk-crimson mb-4">Authentication Required</h2>
            <p className="text-slate-300 mb-6">Please connect your wallet to access business residency services.</p>
            <Button onClick={() => navigate('/')} className="btn-druk">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-druk-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="mr-4 text-white hover:bg-druk-gold/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gradient">Business e-Residency</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'register'
                ? 'bg-druk-gold text-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Register Business
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'manage'
                ? 'bg-druk-gold text-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Manage Businesses ({businesses.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'bg-druk-gold text-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Transaction History
          </button>
        </div>

        {/* Register Business Tab */}
        {activeTab === 'register' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="card-druk">
                <CardHeader>
                  <CardTitle className="flex items-center text-druk-crimson">
                    <Building className="w-6 h-6 mr-2" />
                    {paymentStep === 'form' && 'Register Your Business'}
                    {paymentStep === 'payment' && 'Complete Payment'}
                    {paymentStep === 'success' && 'Registration Successful!'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentStep === 'form' && (
                    <form onSubmit={handleBusinessRegistration} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="businessName" className="text-druk-gold">Business Name *</Label>
                          <Input
                            id="businessName"
                            value={businessData.businessName}
                            onChange={(e) => setBusinessData(prev => ({ ...prev, businessName: e.target.value }))}
                            placeholder="Enter business name"
                            className="bg-slate-800/50 border-slate-600 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="businessType" className="text-druk-gold">Business Type *</Label>
                          <Select
                            value={businessData.businessType}
                            onValueChange={(value) => setBusinessData(prev => ({ ...prev, businessType: value }))}
                          >
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {businessTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label} - BTN {type.registrationFee.toLocaleString()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="businessEmail" className="text-druk-gold">Business Email *</Label>
                          <Input
                            id="businessEmail"
                            type="email"
                            value={businessData.businessEmail}
                            onChange={(e) => setBusinessData(prev => ({ ...prev, businessEmail: e.target.value }))}
                            placeholder="business@example.com"
                            className="bg-slate-800/50 border-slate-600 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="businessPhone" className="text-druk-gold">Business Phone</Label>
                          <Input
                            id="businessPhone"
                            value={businessData.businessPhone}
                            onChange={(e) => setBusinessData(prev => ({ ...prev, businessPhone: e.target.value }))}
                            placeholder="+975 XXXXXXXX"
                            className="bg-slate-800/50 border-slate-600 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="licenseType" className="text-druk-gold">License Type</Label>
                          <Select
                            value={businessData.licenseType}
                            onValueChange={(value) => setBusinessData(prev => ({ ...prev, licenseType: value }))}
                          >
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                              <SelectValue placeholder="Select license" />
                            </SelectTrigger>
                            <SelectContent>
                              {licenseTypes.map(license => (
                                <SelectItem key={license.value} value={license.value}>
                                  {license.label} - BTN {license.fee.toLocaleString()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="businessSector" className="text-druk-gold">Business Sector</Label>
                          <Select
                            value={businessData.businessSector}
                            onValueChange={(value) => setBusinessData(prev => ({ ...prev, businessSector: value }))}
                          >
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                              <SelectValue placeholder="Select sector" />
                            </SelectTrigger>
                            <SelectContent>
                              {businessSectors.map(sector => (
                                <SelectItem key={sector} value={sector.toLowerCase()}>
                                  {sector}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="businessAddress" className="text-druk-gold">Business Address</Label>
                        <Input
                          id="businessAddress"
                          value={businessData.businessAddress}
                          onChange={(e) => setBusinessData(prev => ({ ...prev, businessAddress: e.target.value }))}
                          placeholder="Enter business address in Bhutan"
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="annualRevenue" className="text-druk-gold">Annual Revenue Range</Label>
                          <Select
                            value={businessData.annualRevenueRange}
                            onValueChange={(value) => setBusinessData(prev => ({ ...prev, annualRevenueRange: value }))}
                          >
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                              {revenueRanges.map(range => (
                                <SelectItem key={range} value={range}>
                                  {range}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="employeeCount" className="text-druk-gold">Employee Count</Label>
                          <Input
                            id="employeeCount"
                            type="number"
                            min="0"
                            value={businessData.employeeCount}
                            onChange={(e) => setBusinessData(prev => ({ ...prev, employeeCount: parseInt(e.target.value) || 0 }))}
                            className="bg-slate-800/50 border-slate-600 text-white"
                          />
                        </div>
                      </div>

                      <Button type="submit" disabled={isRegistering} className="w-full btn-druk">
                        Proceed to Payment
                      </Button>
                    </form>
                  )}

                  {paymentStep === 'payment' && (
                    <div className="space-y-6">
                      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-600">
                        <h3 className="text-lg font-semibold text-white mb-4">Payment Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-300">Registration Fee:</span>
                            <span className="text-white">BTN {pendingRegistration?.fees.registrationFee.toLocaleString()}</span>
                          </div>
                          {pendingRegistration?.fees.licenseFee > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-300">License Fee:</span>
                              <span className="text-white">BTN {pendingRegistration?.fees.licenseFee.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="border-t border-slate-600 pt-2 mt-2">
                            <div className="flex justify-between text-lg font-semibold">
                              <span className="text-white">Total Amount:</span>
                              <span className="text-druk-gold">BTN {pendingRegistration?.fees.total.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 rounded-lg border border-blue-500/30">
                        <div className="flex items-center mb-4">
                          <Wallet className="w-6 h-6 text-blue-400 mr-2" />
                          <h3 className="text-lg font-semibold text-white">Mock Payment Gateway</h3>
                        </div>
                        <p className="text-slate-300 text-sm mb-4">
                          This is a simulated payment process. In production, this would integrate with real payment providers.
                        </p>
                        <div className="flex gap-4">
                          <Button
                            onClick={simulatePayment}
                            disabled={isProcessingPayment}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            {isProcessingPayment ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing Payment...
                              </>
                            ) : (
                              'Complete Payment'
                            )}
                          </Button>
                          <Button
                            onClick={() => setPaymentStep('form')}
                            variant="outline"
                            disabled={isProcessingPayment}
                          >
                            Back to Form
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentStep === 'success' && (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Registration Complete!</h3>
                      <p className="text-slate-300">
                        Your business has been successfully registered and is now active in the Druk e-Residency system.
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button
                          onClick={() => setActiveTab('manage')}
                          className="btn-druk"
                        >
                          View My Businesses
                        </Button>
                        <Button
                          onClick={resetRegistration}
                          variant="outline"
                        >
                          Register Another Business
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Fee Calculator Sidebar */}
            <div className="space-y-6">
              <Card className="card-druk">
                <CardHeader>
                  <CardTitle className="text-druk-crimson">Fee Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  {(businessData.businessType || businessData.licenseType) && paymentStep === 'form' ? (
                    <div className="space-y-3">
                      {businessData.businessType && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">Registration:</span>
                          <span className="text-druk-gold font-semibold">
                            BTN {calculateFees().registrationFee.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {businessData.licenseType && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">License:</span>
                          <span className="text-druk-gold font-semibold">
                            BTN {calculateFees().licenseFee.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-slate-600 pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span className="text-white">Total:</span>
                          <span className="text-druk-gold">
                            BTN {calculateFees().total.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          + BTN {calculateFees().complianceFee.toLocaleString()} annual compliance fee
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-center py-4">
                      Select business type and license to calculate fees
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Manage Businesses Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            {businesses.length === 0 ? (
              <Card className="card-druk text-center">
                <CardContent className="p-12">
                  <Building className="w-16 h-16 text-druk-gold mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Businesses Registered</h3>
                  <p className="text-slate-400 mb-6">
                    Register your first business to start managing your commercial presence in Bhutan
                  </p>
                  <Button onClick={() => setActiveTab('register')} className="btn-druk">
                    Register Business
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {businesses.map((business) => (
                  <Card key={business.id} className="card-druk">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white">{business.business_name}</CardTitle>
                          <p className="text-slate-400">ID: {business.business_id}</p>
                          <p className="text-slate-400 text-sm">{business.business_type.replace('_', ' ').toUpperCase()}</p>
                        </div>
                        {getStatusBadge(business.verification_status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold text-druk-gold mb-2">Business Details</h4>
                          <div className="space-y-1 text-sm text-slate-300">
                            <p><strong>Email:</strong> {business.business_email}</p>
                            <p><strong>Sector:</strong> {business.business_sector || 'Not specified'}</p>
                            <p><strong>Employees:</strong> {business.employee_count}</p>
                            <p><strong>Revenue:</strong> {business.annual_revenue_range || 'Not specified'}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-druk-gold mb-2">Financial Summary</h4>
                          <div className="space-y-1 text-sm text-slate-300">
                            <p><strong>Registration Fee:</strong> BTN {business.registration_fee_paid.toLocaleString()}</p>
                            <p><strong>License Fee:</strong> BTN {business.license_fee_paid.toLocaleString()}</p>
                            <p><strong>Total Paid:</strong> BTN {business.total_fees_paid.toLocaleString()}</p>
                            <p><strong>GNH Contributions:</strong> BTN {business.total_gnh_contributions.toLocaleString()}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-druk-gold mb-2">Registration Info</h4>
                          <div className="space-y-1 text-sm text-slate-300">
                            <p><strong>Registered:</strong> {new Date(business.created_at).toLocaleDateString()}</p>
                            <p><strong>Wallet:</strong> {business.wallet_address.slice(0, 6)}...{business.wallet_address.slice(-4)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <Card className="card-druk">
            <CardHeader>
              <CardTitle className="flex items-center text-druk-crimson">
                <Banknote className="w-6 h-6 mr-2" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-16 h-16 text-druk-gold mx-auto mb-4" />
                  <p className="text-slate-400">No transactions yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-druk-gold">Transaction ID</TableHead>
                      <TableHead className="text-druk-gold">Type</TableHead>
                      <TableHead className="text-druk-gold">Amount</TableHead>
                      <TableHead className="text-druk-gold">Method</TableHead>
                      <TableHead className="text-druk-gold">Status</TableHead>
                      <TableHead className="text-druk-gold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="text-white font-mono text-xs">{transaction.transaction_id}</TableCell>
                        <TableCell className="text-white capitalize">{transaction.transaction_type.replace('_', ' ')}</TableCell>
                        <TableCell className="text-white">
                          {transaction.currency} {transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-slate-300 capitalize">{transaction.payment_method}</TableCell>
                        <TableCell>
                          <Badge className={transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BusinessResidency;
