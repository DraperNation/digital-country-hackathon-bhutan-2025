import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import BalanceCard from './components/BalanceCard';
import TransactionForm from './components/TransactionForm';
import SystemHealth from './components/SystemHealth';
import TransactionHistory from './components/TransactionHistory';
import { useWeb3 } from './hooks/useWeb3';
import { SystemMetrics, UserBalance } from './lib/web3-service';

function App() {
  const {
    isInitialized,
    isConnected,
    account,
    loading: authLoading,
    connectWallet,
    disconnectWallet,
    getUserBalances,
    getSystemMetrics,
    mintBBT,
    burnBBT,
    requestFaucetTokens,
  } = useWeb3();

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalSupply: 0,
    reserveBalance: 0,
    collateralizationRatio: 0,
    btcPrice: 65000,
    systemHealth: 'healthy',
    isPaused: false,
    circulatingSupply: 0,
  });

  const [userBalances, setUserBalances] = useState<UserBalance>({
    bbt: 0,
    reserve: 0,
  });

  const [dataLoading, setDataLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Fetch system metrics
  const fetchSystemMetrics = async () => {
    try {
      console.log('Fetching system metrics...');
      const metrics = await getSystemMetrics();
      console.log('System metrics received:', metrics);
      if (metrics) {
        setSystemMetrics(metrics);
      }
    } catch (error) {
      console.error('Error fetching system metrics:', error);
    }
  };

  // Fetch user balances
  const fetchUserBalances = async () => {
    if (!isConnected) {
      console.log('User not connected, skipping balance fetch');
      return;
    }
    
    try {
      console.log('Fetching user balances...');
      const balances = await getUserBalances();
      console.log('User balances received:', balances);
      if (balances) {
        setUserBalances(balances);
      }
    } catch (error) {
      console.error('Error fetching user balances:', error);
    }
  };

  // Refresh all data
  const refreshData = async () => {
    setDataLoading(true);
    await Promise.all([
      fetchSystemMetrics(),
      fetchUserBalances(),
    ]);
    setDataLoading(false);
    setLastUpdate(new Date());
  };

  // Initial data fetch
  useEffect(() => {
    if (isInitialized) {
      refreshData();
    }
  }, [isInitialized, isConnected]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [isInitialized, isConnected]);

  const totalValueUSD = (userBalances.bbt + userBalances.reserve) * systemMetrics.btcPrice;

  const handleMint = async (amount: number) => {
    const result = await mintBBT(amount);
    if (result.success) {
      // Refresh balances after successful mint
      await fetchUserBalances();
      await fetchSystemMetrics();
    }
    return result;
  };

  const handleBurn = async (amount: number) => {
    const result = await burnBBT(amount);
    if (result.success) {
      // Refresh balances after successful burn
      await fetchUserBalances();
      await fetchSystemMetrics();
    }
    return result;
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-bhutan-deep flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-bhutan-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-body">Initializing Avalanche connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-bhutan-deep">
      {/* Enhanced gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-bhutan-deep/80 via-bhutan-navy/60 to-bhutan-deep/90 z-20"></div>

      {/* Animated glow effects with Bhutan colors */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-30"
        style={{ opacity }}
      >
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-bhutan-gold/15 rounded-full blur-3xl"
          style={{ y: y1 }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-bhutan-saffron/10 rounded-full blur-3xl"
          style={{ y: y2 }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.25, 0.1]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>

      <Header 
        isConnected={isConnected}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        account={account}
        loading={authLoading}
      />

      <main className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16 relative"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="relative"
          >
            <h1 className="font-display text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
              <span className="bg-gradient-to-r from-bhutan-gold via-bhutan-amber to-bhutan-copper bg-clip-text text-transparent">
                BBT
              </span>
              <br />
              <span className="text-white font-sans font-light">Protocol</span>
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-bhutan-gold/20 to-bhutan-saffron/20 blur-2xl rounded-full opacity-50"></div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-body text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
          >
            The first Bitcoin-backed token protocol on Avalanche.
            <br className="hidden md:block" />
            <span className="text-bhutan-gold font-medium">Mint BBT with WAVAX</span> and participate in Bhutan's digital economy.
          </motion.p>

          {/* System Status Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8 mb-16"
          >
            <div className="text-center p-6 bg-glass-white backdrop-blur-xl rounded-2xl border border-glass-border">
              <div className="font-mono text-3xl font-bold text-bhutan-gold">
                ${(systemMetrics.reserveBalance * systemMetrics.btcPrice).toLocaleString()}
              </div>
              <div className="font-body text-gray-400 text-sm font-medium">Total Value Locked</div>
            </div>
            <div className="text-center p-6 bg-glass-white backdrop-blur-xl rounded-2xl border border-glass-border">
              <div className="font-mono text-3xl font-bold text-bhutan-saffron">
                {systemMetrics.collateralizationRatio.toFixed(1)}%
              </div>
              <div className="font-body text-gray-400 text-sm font-medium">Collateral Ratio</div>
            </div>
            <div className="text-center p-6 bg-glass-white backdrop-blur-xl rounded-2xl border border-glass-border">
              <div className="font-mono text-3xl font-bold text-bhutan-amber">
                {systemMetrics.circulatingSupply.toLocaleString()}
              </div>
              <div className="font-body text-gray-400 text-sm font-medium">BBT Supply</div>
            </div>
          </motion.div>
        </motion.section>

        {/* Metrics Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          <MetricCard
            title="Total BBT Supply"
            value={systemMetrics.totalSupply}
            change={5.2}
            changeType="positive"
            suffix="BBT"
            loading={dataLoading}
            delay={0}
          />
          <MetricCard
            title="WAVAX Reserves"
            value={systemMetrics.reserveBalance}
            change={2.1}
            changeType="positive"
            suffix="WAVAX"
            loading={dataLoading}
            delay={0.1}
          />
          <MetricCard
            title="Collateral Ratio"
            value={systemMetrics.collateralizationRatio}
            change={-0.5}
            changeType="negative"
            suffix="%"
            loading={dataLoading}
            delay={0.2}
          />
          <MetricCard
            title="BTC Price"
            value={systemMetrics.btcPrice}
            change={3.7}
            changeType="positive"
            suffix="USD"
            loading={dataLoading}
            delay={0.3}
          />
        </motion.section>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Balance Card */}
          <BalanceCard
            bbtBalance={userBalances.bbt}
            reserveBalance={userBalances.reserve}
            totalValueUSD={totalValueUSD}
            loading={dataLoading}
            delay={0.4}
            onRefresh={refreshData}
          />

          {/* System Health */}
          <SystemHealth
            collateralizationRatio={systemMetrics.collateralizationRatio}
            systemHealth={systemMetrics.systemHealth}
            btcPrice={systemMetrics.btcPrice}
            isPaused={systemMetrics.isPaused}
            delay={0.5}
          />

          {/* Transaction History */}
          <TransactionHistory />
        </div>

        {/* Transaction Forms */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-bhutan-gold to-bhutan-amber bg-clip-text text-transparent">
                  Core Protocol Actions
                </span>
              </h2>
              <p className="font-body text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                Mint BBT tokens by depositing WAVAX, or burn BBT to withdraw WAVAX.
                <br className="hidden md:block" />
                <span className="text-bhutan-gold font-medium">All transactions are 1:1 ratio</span> and processed on-chain.
              </p>
            </motion.div>
          </div>

          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="text-center p-12 bg-glass-white backdrop-blur-xl rounded-2xl border border-glass-border"
            >
              <h3 className="font-display text-2xl font-bold text-white mb-4">
                Connect Your Wallet
              </h3>
              <p className="font-body text-gray-400 mb-8">
                Connect with MetaMask to start minting and burning BBT tokens on Avalanche
              </p>
              <button
                onClick={connectWallet}
                disabled={authLoading}
                className="px-8 py-4 bg-gradient-to-r from-bhutan-gold to-bhutan-amber rounded-xl font-sans font-semibold text-bhutan-deep hover:from-bhutan-amber hover:to-bhutan-gold transition-all duration-200 shadow-gold hover:shadow-xl disabled:opacity-50"
              >
                {authLoading ? 'Connecting...' : 'Connect MetaMask'}
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
              <TransactionForm
                onMint={handleMint}
                onBurn={handleBurn}
                onFaucet={requestFaucetTokens}
                isConnected={isConnected}
                loading={dataLoading}
              />
            </div>
          )}
        </motion.section>

        {/* Last Update Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
          className="text-center text-gray-500 text-sm font-body"
        >
          Last updated: {lastUpdate.toLocaleTimeString()}
        </motion.div>
      </main>

      {/* Enhanced Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.4 }}
        className="relative z-40 mt-20 border-t border-glass-border bg-bhutan-deep/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 2.6 }}
              className="mb-6"
            >
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-bhutan-gold to-bhutan-amber bg-clip-text text-transparent">
                  BBT Protocol
                </span>
              </h3>
              <p className="font-body text-gray-400 text-lg font-light">
                Bhutan Bitcoin Token on Avalanche
              </p>
            </motion.div>
            <p className="font-body text-gray-500 text-sm font-light">
              Built on Avalanche • Secured by Bitcoin • Powered by WAVAX
            </p>
            <div className="mt-6 flex justify-center space-x-6 text-sm text-gray-400 font-body font-medium">
              <a href="#" className="hover:text-bhutan-gold transition-colors">Documentation</a>
              <a href="#" className="hover:text-bhutan-gold transition-colors">GitHub</a>
              <a href="#" className="hover:text-bhutan-gold transition-colors">Support</a>
              <a href="#" className="hover:text-bhutan-gold transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;