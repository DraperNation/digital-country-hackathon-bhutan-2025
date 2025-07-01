
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWallet } from '@/contexts/WalletContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Shield, User, CheckCircle } from 'lucide-react';

const KYC = () => {
  const { isConnected, account, connectWallet, signMessage } = useWallet();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    countryCode: '+975'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleWalletConnect = async () => {
    setIsLoading(true);
    const success = await connectWallet();
    if (success) {
      // Generate nonce and sign
      const nonce = `Verify wallet ownership for Druk e-Residency: ${Date.now()}`;
      const signature = await signMessage(nonce);
      if (signature) {
        toast.success('Wallet verified successfully!');
        setStep(2);
      }
    }
    setIsLoading(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (!formData.fullName || !formData.phoneNumber || !formData.email) {
      toast.error('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // Simulate API call to store user data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create DID and sign
    const did = `did:bhutan:${account?.slice(2, 10).toLowerCase()}`;
    const signature = await signMessage(did);
    
    if (signature) {
      // Store in localStorage for demo (in real app, this would go to Supabase)
      localStorage.setItem('userData', JSON.stringify({
        ...formData,
        walletAddress: account,
        decentralizedId: did,
        didSignature: signature,
        createdAt: new Date().toISOString()
      }));
      
      setStep(3);
      toast.success('Your Decentralized ID has been created and securely linked to your wallet!');
    }
    
    setIsLoading(false);
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-4">
            Druk e-Residency Application
          </h1>
          <p className="text-gray-600">
            Secure your digital identity in the Land of the Thunder Dragon
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 1 ? 'bg-druk-blue text-white' : 'bg-gray-200'
            }`}>
              {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-druk-blue' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 2 ? 'bg-druk-blue text-white' : 'bg-gray-200'
            }`}>
              {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-druk-blue' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 3 ? 'bg-druk-blue text-white' : 'bg-gray-200'
            }`}>
              {step > 3 ? <CheckCircle className="w-5 h-5" /> : '3'}
            </div>
          </div>
        </div>

        {/* Step 1: Wallet Connection */}
        {step === 1 && (
          <Card className="card-druk">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-druk-blue" />
              <CardTitle className="text-2xl text-druk-red">Connect Your Wallet</CardTitle>
              <p className="text-gray-600">
                Secure your digital identity with MetaMask wallet verification
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isConnected ? (
                <Button
                  onClick={handleWalletConnect}
                  disabled={isLoading}
                  className="w-full btn-druk"
                >
                  {isLoading ? 'Connecting...' : 'Connect MetaMask Wallet'}
                </Button>
              ) : (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800">
                      ✓ Wallet Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
                    </p>
                  </div>
                  <Button onClick={() => setStep(2)} className="w-full btn-druk">
                    Continue to Personal Information
                  </Button>
                </div>
              )}
              
              <div className="text-sm text-gray-500 text-center">
                Don't have MetaMask? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-druk-blue hover:underline">Download here</a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Personal Information */}
        {step === 2 && (
          <Card className="card-druk">
            <CardHeader className="text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-druk-blue" />
              <CardTitle className="text-2xl text-druk-red">Personal Information</CardTitle>
              <p className="text-gray-600">
                Please provide your details for identity verification
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="countryCode">Country Code</Label>
                    <Select value={formData.countryCode} onValueChange={(value) => setFormData(prev => ({ ...prev, countryCode: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+975">+975 (Bhutan)</SelectItem>
                        <SelectItem value="+1">+1 (US/Canada)</SelectItem>
                        <SelectItem value="+44">+44 (UK)</SelectItem>
                        <SelectItem value="+91">+91 (India)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full btn-druk">
                  {isLoading ? 'Creating Digital Identity...' : 'Create Decentralized ID'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <Card className="card-druk">
            <CardHeader className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <CardTitle className="text-2xl text-druk-red">Welcome to Druk e-Residency!</CardTitle>
              <p className="text-gray-600">
                Your digital identity has been successfully created
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="p-6 bg-gradient-to-r from-druk-red/10 to-druk-gold/10 rounded-lg">
                <h3 className="font-semibold text-druk-red mb-2">Your Decentralized ID</h3>
                <p className="text-sm font-mono bg-white p-2 rounded border">
                  {`did:bhutan:${account?.slice(2, 10).toLowerCase()}`}
                </p>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Wallet connected and verified</p>
                <p>✓ Personal information secured</p>
                <p>✓ Decentralized ID created and signed</p>
                <p>✓ Ready to access e-Residency services</p>
              </div>

              <Button onClick={handleComplete} className="w-full btn-druk">
                Access Your Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KYC;
