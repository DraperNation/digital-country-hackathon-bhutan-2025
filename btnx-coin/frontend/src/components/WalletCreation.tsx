
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Wallet, Users, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletCreationProps {
  onWalletCreated: (walletAddress: string) => void;
}

export const WalletCreation = ({ onWalletCreated }: WalletCreationProps) => {
  const [signers, setSigners] = useState([3]);
  const [threshold, setThreshold] = useState([2]);
  const [walletName, setWalletName] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const generateWalletAddress = () => {
    return 'btnx' + Math.random().toString(36).substr(2, 34);
  };

  const handleCreateWallet = async () => {
    if (!walletName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a wallet name",
        variant: "destructive"
      });
      return;
    }

    if (!passphrase || passphrase.length < 8) {
      toast({
        title: "Error",
        description: "Please enter a passphrase with at least 8 characters",
        variant: "destructive"
      });
      return;
    }

    if (passphrase !== confirmPassphrase) {
      toast({
        title: "Error",
        description: "Passphrases do not match",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      // Simulate wallet creation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const walletAddress = generateWalletAddress();
      const walletData = {
        address: walletAddress,
        name: walletName,
        passphrase: passphrase,
        signers: signers[0],
        threshold: threshold[0],
        balance: '0.00',
        createdAt: new Date().toISOString()
      };

      // Store wallet in localStorage
      const existingWallets = JSON.parse(localStorage.getItem('btnx-wallets') || '[]');
      existingWallets.push(walletData);
      localStorage.setItem('btnx-wallets', JSON.stringify(existingWallets));

      toast({
        title: "Wallet Created Successfully",
        description: `Multi-signature wallet "${walletName}" created with address: ${walletAddress.slice(0, 8)}...`
      });

      // Reset form
      setWalletName('');
      setPassphrase('');
      setConfirmPassphrase('');
      setSigners([3]);
      setThreshold([2]);

      onWalletCreated(walletAddress);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-orange-200 hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
          <Wallet className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Create Multi-Sig Wallet</CardTitle>
        <CardDescription className="text-gray-600">
          Secure Bitcoin-backed currency wallet with multi-signature protection
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="wallet-name">Wallet Name</Label>
          <Input
            id="wallet-name"
            placeholder="Enter wallet name"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            className="border-gray-300 focus:border-orange-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passphrase">Passphrase (min 8 characters)</Label>
          <Input
            id="passphrase"
            type="password"
            placeholder="Enter secure passphrase"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="border-gray-300 focus:border-orange-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-passphrase">Confirm Passphrase</Label>
          <Input
            id="confirm-passphrase"
            type="password"
            placeholder="Confirm your passphrase"
            value={confirmPassphrase}
            onChange={(e) => setConfirmPassphrase(e.target.value)}
            className="border-gray-300 focus:border-orange-500"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-orange-500" />
            <Label>Number of Signers: {signers[0]}</Label>
          </div>
          <Slider
            value={signers}
            onValueChange={setSigners}
            max={10}
            min={2}
            step={1}
            className="w-full"
          />
          <p className="text-sm text-gray-500">Choose how many people will control this wallet</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <Label>Required Approvals: {threshold[0]} of {signers[0]}</Label>
          </div>
          <Slider
            value={threshold}
            onValueChange={setThreshold}
            max={signers[0]}
            min={Math.ceil(signers[0] / 2)}
            step={1}
            className="w-full"
          />
          <p className="text-sm text-gray-500">
            Majority approval required ({Math.ceil(signers[0] / 2)} minimum for security)
          </p>
        </div>

        <Button 
          onClick={handleCreateWallet}
          disabled={isCreating}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          {isCreating ? 'Creating Wallet...' : 'Create Secure Wallet'}
        </Button>
      </CardContent>
    </Card>
  );
};
