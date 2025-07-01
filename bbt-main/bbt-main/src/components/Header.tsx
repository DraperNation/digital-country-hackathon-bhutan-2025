import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Settings, Bell, User, ChevronDown, LogOut } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
  onConnect: () => Promise<boolean>;
  onDisconnect: () => Promise<void>;
  account?: string;
  loading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  isConnected, 
  onConnect, 
  onDisconnect, 
  account,
  loading = false 
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-bhutan-deep/90 backdrop-blur-xl border-b border-glass-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-bhutan-gold to-bhutan-amber flex items-center justify-center shadow-gold">
              <span className="text-bhutan-deep font-mono font-bold text-lg">BB</span>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-white">BBT Dashboard</h1>
              <p className="font-body text-xs text-gray-400 font-light">Bhutan Bitcoin Token</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden md:flex items-center space-x-8"
          >
            <a href="#dashboard" className="font-sans text-white hover:text-bhutan-gold transition-colors font-medium">
              Dashboard
            </a>
            <a href="#mint" className="font-sans text-gray-400 hover:text-white transition-colors font-medium">
              Mint
            </a>
            <a href="#burn" className="font-sans text-gray-400 hover:text-white transition-colors font-medium">
              Burn
            </a>
            <a href="#analytics" className="font-sans text-gray-400 hover:text-white transition-colors font-medium">
              Analytics
            </a>
          </motion.nav>

          {/* User Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center space-x-4"
          >
            {isConnected && (
              <>
                {/* Notifications */}
                <button className="p-2 rounded-lg bg-glass-white hover:bg-glass-hover transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-300" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-bhutan-crimson rounded-full"></span>
                </button>

                {/* Settings */}
                <button className="p-2 rounded-lg bg-glass-white hover:bg-glass-hover transition-colors">
                  <Settings className="w-5 h-5 text-gray-300" />
                </button>
              </>
            )}

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 bg-glass-white rounded-lg border border-glass-border hover:bg-glass-hover transition-colors"
                >
                  <div className="w-2 h-2 bg-status-success rounded-full animate-pulse"></div>
                  <User className="w-4 h-4 text-gray-300" />
                  <span className="text-white font-mono text-sm">
                    {account?.slice(0, 8)}...{account?.slice(-8)}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-300" />
                </button>

                {/* User Menu */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-bhutan-navy rounded-lg border border-glass-border shadow-bhutan overflow-hidden"
                  >
                    <div className="p-3 border-b border-glass-border">
                      <p className="text-white font-medium text-sm">Connected</p>
                      <p className="text-gray-400 font-mono text-xs truncate">{account}</p>
                    </div>
                    <button
                      onClick={() => {
                        onDisconnect();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-glass-white transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-body text-sm">Disconnect</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <button
                onClick={onConnect}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-bhutan-gold to-bhutan-amber rounded-lg font-sans font-medium text-bhutan-deep hover:from-bhutan-amber hover:to-bhutan-gold transition-all duration-200 shadow-gold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wallet className="w-4 h-4" />
                <span>{loading ? 'Connecting...' : 'Connect MetaMask'}</span>
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;