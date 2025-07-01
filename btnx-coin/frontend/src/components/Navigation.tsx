
import React from 'react';
import { Bitcoin, Wallet, Activity, Shield } from 'lucide-react';
// import { Login } from './Login';
import ConnectButton from './ConnectButton';

interface NavigationProps {
  isLoggedIn: boolean;
  currentWallet?: string;
  onLogin: (walletId: string) => void;
  onLogout: () => void;
}

export const Navigation = ({ isLoggedIn, currentWallet, onLogin, onLogout }: NavigationProps) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Bitcoin className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">BTNX</span>
            <span className="text-sm text-gray-500">Bhutan Bitcoin Currency</span>
          </div>
          
          <div className="flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <button 
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={() => scrollToSection('transactions')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Activity className="h-4 w-4" />
                  <span>Transactions</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => scrollToSection('reserves')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Activity className="h-4 w-4" />
                  <span>Reserves</span>
                </button>
                <button 
                  onClick={() => scrollToSection('transparency')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <span>Transparency</span>
                </button>
              </>
            )}
            
            {/* <Login 
              onLogin={onLogin}
              isLoggedIn={isLoggedIn}
              onLogout={onLogout}
              currentWallet={currentWallet}
            /> */}
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
