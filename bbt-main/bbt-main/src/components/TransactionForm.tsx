import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ArrowUpDown, Zap } from 'lucide-react';

interface TransactionFormProps {
  onMint: (amount: number) => Promise<{ success: boolean; error?: string }>;
  onBurn: (amount: number) => Promise<{ success: boolean; error?: string }>;
  onFaucet: () => Promise<{ success: boolean; error?: string }>;
  isConnected: boolean;
  loading?: boolean;
}

export default function TransactionForm({ 
  onMint, 
  onBurn, 
  onFaucet, 
  isConnected, 
  loading = false 
}: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState<'mint' | 'burn'>('mint');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      let result;
      if (transactionType === 'mint') {
        result = await onMint(numAmount);
      } else {
        result = await onBurn(numAmount);
      }

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `${transactionType === 'mint' ? 'Minted' : 'Burned'} ${numAmount} BBT successfully!` 
        });
        setAmount('');
      } else {
        setMessage({ type: 'error', text: result.error || 'Transaction failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Transaction failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFaucet = async () => {
    if (!isConnected) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const result = await onFaucet();
      if (result.success) {
        setMessage({ type: 'success', text: 'Faucet tokens requested successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Faucet request failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Faucet request failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card p-6"
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <ArrowUpDown className="w-5 h-5 text-bhutan-gold" />
        Token Operations
      </h3>

      {/* Message Display */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
              : 'bg-red-500/20 border border-red-500/30 text-red-300'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Transaction Type Toggle */}
      <div className="flex bg-bhutan-navy/30 rounded-lg p-1 mb-6">
        <button
          type="button"
          onClick={() => setTransactionType('mint')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            transactionType === 'mint'
              ? 'bg-bhutan-gold text-bhutan-deep shadow-lg'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Mint BBT
        </button>
        <button
          type="button"
          onClick={() => setTransactionType('burn')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            transactionType === 'burn'
              ? 'bg-bhutan-gold text-bhutan-deep shadow-lg'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Burn BBT
        </button>
      </div>

      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-white/80 mb-2">
            Amount (BBT)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full bg-bhutan-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-bhutan-gold/50 focus:border-transparent transition-all"
            disabled={isProcessing || loading}
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isProcessing || loading || !isConnected}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
            isProcessing || loading || !isConnected
              ? 'bg-gray-600/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-bhutan-gold to-bhutan-saffron hover:from-bhutan-saffron hover:to-bhutan-gold shadow-lg hover:shadow-xl'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {transactionType === 'mint' ? 'Mint BBT' : 'Burn BBT'}
            </>
          )}
        </motion.button>
      </form>

      {/* Faucet Section */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-sm font-medium text-white/80 mb-3">Get Test Tokens</h4>
        <motion.button
          onClick={handleFaucet}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isProcessing || loading || !isConnected}
          className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            isProcessing || loading || !isConnected
              ? 'bg-gray-600/30 text-white/50 cursor-not-allowed'
              : 'bg-bhutan-saffron/20 text-bhutan-saffron hover:bg-bhutan-saffron/30 border border-bhutan-saffron/30'
          }`}
        >
          <Zap className="w-4 h-4" />
          Request Faucet Tokens
        </motion.button>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-300 text-sm">
            Connect your wallet to perform transactions
          </p>
        </div>
      )}
    </motion.div>
  );
}