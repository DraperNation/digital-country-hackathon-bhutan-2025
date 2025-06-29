import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Download
} from 'lucide-react';

export const TransactionHistory = ({ address }) => {
  const [transfers, setTransfers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('sent');

  useEffect(() => {
    const fetchTransfers = async () => {
      if (!address) {
        setError('No address provided');
        return;
      } 

      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching transfers for address:', address);
        const response = await fetch(`http://localhost:4000/transfers`);
        const data = await response.json();
        console.log('API response:', data);

        if (response.ok) {
          if (Array.isArray(data)) {
            setTransfers(data);
          } else {
            setError('Unexpected response format: Expected an array');
          }
        } else {
          setError(data.error || 'Failed to fetch transactions');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Network error. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransfers();
  }, [address]);

  // Filter transfers based on sender and receiver
  const sentTransfers = transfers.filter(
    transfer => transfer.sender?.toLowerCase() === address?.toLowerCase()
  );
  const receivedTransfers = transfers.filter(
    transfer => transfer.receiver?.toLowerCase() === address?.toLowerCase()
  );

  console.log('Address:', address);
  console.log('Sent transfers:', sentTransfers);
  console.log('Received transfers:', receivedTransfers);
  console.log('All transfers:', transfers);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(parseInt(timestamp.$date.$numberLong));
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Format amount (assuming amount is in wei-like units, converting to ether-like units)
  const formatAmount = (amount) => {
    try {
      const etherAmount = parseFloat(amount) / 1e18;
      return etherAmount.toFixed(8);
    } catch {
      return 'Invalid amount';
    }
  };

  // Truncate transaction hash for display
  const truncateTxHash = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-green-200 hover:shadow-xl transition-shadow duration-300  mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Transaction History
        </CardTitle>
        <CardDescription className="text-gray-600">
          View your sent and received transactions
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tabs for Sent/Received */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium text-center transition-colors ${
              activeTab === 'sent'
                ? 'border-b-2 border-green-500 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('sent')}
          >
            Deposits Sent
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium text-center transition-colors ${
              activeTab === 'received'
                ? 'border-b-2 border-green-500 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('received')}
          >
            Deposits Received
          </button>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading transactions...</span>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Transaction List */}
        {!isLoading && !error && (
          <div className="space-y-4">
            {(activeTab === 'sent' ? sentTransfers : receivedTransfers).length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No {activeTab === 'sent' ? 'sent' : 'received'} transactions found.
                {transfers.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Note: {transfers.length} total transactions found, but none match the {activeTab} criteria.
                  </p>
                )}
              </div>
            ) : (
              (activeTab === 'sent' ? sentTransfers : receivedTransfers).map(transfer => (
                <div
                  key={transfer._id?.$oid || transfer.txHash}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {activeTab === 'sent' ? (
                        <Send className="h-5 w-5 text-red-500" />
                      ) : (
                        <Download className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatAmount(transfer.amount)} BTNX
                        </p>
                        <p className="text-sm text-gray-600">
                          {activeTab === 'sent' ? 'To' : 'From'}: {truncateTxHash(activeTab === 'sent' ? transfer.receiver : transfer.sender)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      Confirmed
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTimestamp(transfer.timestamp)}</span>
                    </div>
                    <a
                      href={`https://etherscan.io/tx/${transfer.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {truncateTxHash(transfer.txHash)}
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Debug Raw Data */}
        {!isLoading && !error && transfers.length > 0 && (sentTransfers.length === 0 && receivedTransfers.length === 0) && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Debug: Raw Transaction Data</p>
                <p>No transactions matched the current address. Below is the raw data fetched:</p>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(transfers, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};