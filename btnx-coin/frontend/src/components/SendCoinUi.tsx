import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Wallet, AlertCircle, CheckCircle, Copy } from 'lucide-react';

export const SendCoinUI = ({ address }) => {
  const [formData, setFormData] = useState({
    amount: '',
    address: '',
    coinType: 'BTNX',
    btcTx: '',
    ethAddress: address || '',
    btcAmount: ''
  });

  const [errors, setErrors] = useState<{
    amount?: string;
    address?: string;
    ethAddress?: string;
    btcTx?: string;
    btcAmount?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [userBalance, setUserBalance] = useState({ BTNX: 0, BTC: 0 });
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [bitcoinPrice, setBitcoinPrice] = useState(45000); // Fallback price

  const btcReceiveAddress = "tb1q6ef00ly3nh7ru3pyvd8vjwd3kasdmpvl4tpf6x"; // Updated to match server

  // Fetch BTNX balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) return;
      setIsLoadingBalance(true);

      try {
        const response = await fetch(`http://localhost:4000/api/balance/${address}`);
        const result = await response.json();

        if (result.success) {
          setUserBalance(prev => ({
            ...prev,
            BTNX: parseFloat(result.balance)
          }));
        } else {
          setUserBalance(prev => ({ ...prev, BTNX: 0 }));
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        setUserBalance(prev => ({ ...prev, BTNX: 0 }));
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchBalance();
  }, [address, formData.coinType]);

  // Fetch Bitcoin price
  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        setBitcoinPrice(data.bitcoin.usd);
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        // Keep fallback price
      }
    };

    fetchBitcoinPrice();
    // Refresh price every 5 minutes
    const interval = setInterval(fetchBitcoinPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const validateTransferForm = () => {
    const newErrors: {
      amount?: string;
      address?: string;
      ethAddress?: string;
      btcTx?: string;
      btcAmount?: string;
    } = {};

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(formData.amount) > userBalance.BTNX) {
      newErrors.amount = 'Insufficient balance';
    }

    if (!formData.address) {
      newErrors.address = 'Recipient address is required';
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.address)) {
      newErrors.address = 'Invalid Ethereum address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRedeemForm = () => {
    const newErrors: {
      amount?: string;
      address?: string;
      ethAddress?: string;
      btcTx?: string;
      btcAmount?: string;
    } = {};

    if (!formData.ethAddress) {
      newErrors.ethAddress = 'Ethereum address is required';
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.ethAddress)) {
      newErrors.ethAddress = 'Invalid Ethereum address';
    }

    if (!formData.btcTx) {
      newErrors.btcTx = 'Bitcoin transaction hash is required';
    } else if (!/^[a-fA-F0-9]{64}$/.test(formData.btcTx)) {
      newErrors.btcTx = 'Invalid Bitcoin transaction hash';
    }

    if (!formData.btcAmount) {
      newErrors.btcAmount = 'BTC amount is required';
    } else if (parseFloat(formData.btcAmount) <= 0) {
      newErrors.btcAmount = 'BTC amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const setMaxAmount = () => {
    setFormData(prev => ({
      ...prev,
      amount: userBalance.BTNX.toString()
    }));
  };

  const copyBtcReceiveAddress = () => {
    navigator.clipboard.writeText(btcReceiveAddress);
    setTransactionStatus({
      type: 'success',
      message: 'BTC receive address copied to clipboard!'
    });
  };

  // Calculate expected BTNX amount based on 200% collateral ratio
  const calculateExpectedBTNX = (btcAmount: string) => {
    if (!btcAmount || parseFloat(btcAmount) <= 0) return 0;
    
    // 200% collateral ratio: 2 BTC = 1 BTNX
    return parseFloat(btcAmount) / 2;
  };

  const handleTransfer = async () => {
    if (!validateTransferForm()) return;
    setIsSubmitting(true);
    setTransactionStatus(null);

    try {
      const response = await fetch('http://localhost:4000/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiver: formData.address,
          amt: parseFloat(formData.amount)
        })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setTransactionStatus({
          type: 'success',
          message: `Sent ${formData.amount} BTNX successfully!`,
          txId: result.txHash
        });
        setFormData(prev => ({ ...prev, amount: '', address: '' }));
      } else {
        setTransactionStatus({
          type: 'error',
          message: result.error || 'Failed to send BTNX.'
        });
      }
    } catch (error) {
      setTransactionStatus({
        type: 'error',
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBtcRedeem = async () => {
    if (!validateRedeemForm()) return;
    setIsSubmitting(true);
    setTransactionStatus(null);

    try {
      const response = await fetch('http://localhost:4000/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          btcTx: formData.btcTx,
          ethAddress: formData.ethAddress,
          btcAmount: parseFloat(formData.btcAmount)
        })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setTransactionStatus({
          type: 'success',
          message: `Received ${result.message.split(' ')[1]} BTNX for ${formData.btcAmount} BTC!`,
          txId: result.txHash
        });
        setFormData(prev => ({ ...prev, btcTx: '', ethAddress: address || '', btcAmount: '' }));
      } else {
        setTransactionStatus({
          type: 'error',
          message: result.error || 'Failed to redeem BTNX.'
        });
      }
    } catch (error) {
      setTransactionStatus({
        type: 'error',
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4">
      {/* Main Actions Grid - Send BTNX and Redeem BTNX side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: BTNX Transfer */}
        <Card className="bg-white/90 border hover:shadow-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="text-white w-6 h-6" />
            </div>
            <CardTitle className="text-2xl">Send BTNX</CardTitle>
            <CardDescription>Transfer BTNX to another wallet</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Available Balance</span>
                {isLoadingBalance ? (
                  <span className="text-sm">Loading...</span>
                ) : (
                  <span className="text-sm font-semibold">{userBalance.BTNX} BTNX</span>
                )}
              </div>
              <button
                onClick={setMaxAmount}
                className="text-sm text-blue-600 hover:underline"
              >
                Use Max
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                  placeholder="0.0000"
                  step="0.0001"
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Recipient Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                  placeholder="0x..."
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <button
                onClick={handleTransfer}
                disabled={isSubmitting}
                className="w-full py-3 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 transition disabled:bg-blue-400"
              >
                {isSubmitting ? 'Sending...' : 'Send BTNX'}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: BTC to BTNX Redemption */}
        <Card className="bg-yellow-50 border border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800 text-lg">Redeem BTNX with BTC</CardTitle>
            <CardDescription className="text-sm text-yellow-700">
              Send testnet BTC to{' '}
              <code className="bg-yellow-100 px-1 py-0.5 rounded">{btcReceiveAddress}</code>{' '}
              <button
                onClick={copyBtcReceiveAddress}
                className="inline-flex items-center text-blue-600 hover:underline"
              >
                <Copy className="w-4 h-4 mr-1" /> Copy
              </button>
              <br />
              Enter the transaction hash and amount below to receive BTNX (200% collateral ratio: 2 BTC = 1 BTNX).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Ethereum Address</label>
              <input
                type="text"
                value={formData.ethAddress}
                onChange={(e) => handleInputChange('ethAddress', e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                placeholder="0x..."
              />
              {errors.ethAddress && <p className="text-red-500 text-sm mt-1">{errors.ethAddress}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">BTC Transaction Hash</label>
              <input
                type="text"
                value={formData.btcTx}
                onChange={(e) => handleInputChange('btcTx', e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                placeholder="e.g., 488da69aa7b7a03670f3532fd145c3981328f32a4fd24aa7226cca33f105cce9"
              />
              {errors.btcTx && <p className="text-red-500 text-sm mt-1">{errors.btcTx}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">BTC Amount Sent</label>
              <input
                type="number"
                value={formData.btcAmount}
                onChange={(e) => handleInputChange('btcAmount', e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                placeholder="0.0001"
                step="0.00000001"
              />
              {errors.btcAmount && <p className="text-red-500 text-sm mt-1">{errors.btcAmount}</p>}
            </div>
            
            {/* Expected BTNX Amount Display */}
            {formData.btcAmount && parseFloat(formData.btcAmount) > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-800">Expected BTNX:</span>
                  <span className="text-lg font-bold text-blue-800">
                    {calculateExpectedBTNX(formData.btcAmount).toFixed(4)} BTNX
                  </span>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Based on 200% collateral ratio: 2 BTC = 1 BTNX
                </div>
              </div>
            )}

            <button
              onClick={handleBtcRedeem}
              disabled={isSubmitting}
              className="w-full py-3 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition disabled:bg-yellow-400"
            >
              {isSubmitting ? 'Processing...' : 'Redeem BTNX'}
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Status - moved below both sections */}
      {transactionStatus && (
        <div className={`p-4 border rounded-md flex space-x-2 ${
          transactionStatus.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          {transactionStatus.type === 'success' ? (
            <CheckCircle className="text-green-600 w-5 h-5 mt-0.5" />
          ) : (
            <AlertCircle className="text-red-600 w-5 h-5 mt-0.5" />
          )}
          <div>
            <p className={`font-medium ${
              transactionStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>{transactionStatus.message}</p>
            {transactionStatus.txId && (
              <p className="text-sm mt-1">
                TX Hash: <code className="break-all">{transactionStatus.txId}</code>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};