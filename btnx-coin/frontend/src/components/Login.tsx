
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, UserCheck, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginProps {
  onLogin: (walletId: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  currentWallet?: string;
}

export const Login = ({ onLogin, isLoggedIn, onLogout, currentWallet }: LoginProps) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress || !passphrase) {
      toast({
        title: "Error",
        description: "Please enter both wallet address and passphrase",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const storedWallets = JSON.parse(localStorage.getItem('btnx-wallets') || '[]');
      const wallet = storedWallets.find((w: any) => 
        w.address === walletAddress && w.passphrase === passphrase
      );

      if (wallet) {
        onLogin(walletAddress);
        setIsOpen(false);
        setWalletAddress('');
        setPassphrase('');
        toast({
          title: "Login Successful",
          description: `Welcome back! Connected to wallet ${walletAddress.slice(0, 8)}...`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid wallet address or passphrase. Please check your credentials.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    // Simulate password reset
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Reset Email Sent",
      description: "If an account exists with this email, you'll receive reset instructions.",
    });
    
    setShowForgotPassword(false);
    setResetEmail('');
  };

  const connectMetaMask = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          toast({
            title: "MetaMask Connected",
            description: `Connected to ${accounts[0].slice(0, 8)}...`,
          });
          onLogin(accounts[0]);
          setIsOpen(false);
        }
      } else {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to use this feature.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <UserCheck className="h-4 w-4 text-green-500" />
          <span>Wallet: {currentWallet?.slice(0, 8)}...</span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onLogout}
          className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200">
          <LogIn className="h-4 w-4" />
          <span>Access Wallet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {showForgotPassword ? 'Reset Password' : 'Access Your BTNX Wallet'}
          </DialogTitle>
        </DialogHeader>
        
        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="focus:border-orange-500"
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
                Send Reset Link
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForgotPassword(false)}
                className="flex-1"
              >
                Back to Login
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallet-address">Wallet Address</Label>
                <Input
                  id="wallet-address"
                  type="text"
                  placeholder="Enter your wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passphrase">Passphrase</Label>
                <div className="relative">
                  <Input
                    id="passphrase"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your passphrase"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="focus:border-orange-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                {isLoading ? 'Accessing Wallet...' : 'Access Wallet'}
              </Button>
            </form>
            
            <div className="text-center">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-orange-600 hover:text-orange-700 underline"
              >
                Forgot your passphrase?
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or connect with</span>
              </div>
            </div>
            
            <Button 
              type="button"
              variant="outline"
              onClick={connectMetaMask}
              className="w-full hover:bg-gray-50"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                alt="MetaMask" 
                className="h-5 w-5 mr-2"
              />
              Connect MetaMask
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
