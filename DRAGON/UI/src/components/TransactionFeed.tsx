
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpCircle, ArrowDownCircle, Search, Filter, RefreshCw, Activity, TrendingUp, Coins } from 'lucide-react';

const TransactionFeed = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Function to run the Node.js script and fetch transactions
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call your real API endpoint
      const response = await fetch('http://localhost:3000/api/all-transactions?limit=5');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the contract events to match your transaction format
      const transformedTransactions = data.events.map((event) => {
        const baseTransaction = {
          id: `${event.transaction_hash}-${event.log_index}`,
          hash: event.transaction_hash,
          timestamp: new Date(event.timestamp).toLocaleString(),
          status: 'confirmed',
          blockNumber: event.block_number,
          logIndex: event.log_index,
          eventType: event.event_type
        };

        switch (event.event_type) {
          case 'Transfer': {
            const isMint = event.details.from === '0x0000000000000000000000000000000000000000';
            const isBurn = event.details.to === '0x0000000000000000000000000000000000000000';
            return {
              ...baseTransaction,
              type: isMint ? 'mint' : isBurn ? 'burn' : 'transfer',
              amount: `${event.details.amount_dgc.toLocaleString()} DRGC`,
              btcAmount: `${(event.details.amount_dgc * 0.0000213).toFixed(8)} BTC`,
              details: event.details
            };
          }
          case 'ReservesUpdated':
            return {
              ...baseTransaction,
              type: 'reserve_update',
              amount: `${event.details.new_reserves_btc.toLocaleString()} BTC`,
              btcAmount: `${event.details.new_reserves_satoshis.toLocaleString()} sats`,
              details: event.details
            };
          case 'CollateralRatioUpdated':
            return {
              ...baseTransaction,
              type: 'ratio_update',
              amount: `${event.details.new_ratio_percent}%`,
              btcAmount: `${event.details.new_ratio_basis_points} bps`,
              details: event.details
            };
          case 'ExchangeRateUpdated':
            return {
              ...baseTransaction,
              type: 'rate_update',
              amount: `$${event.details.btc_price_usd.toLocaleString()}`,
              btcAmount: `${event.details.new_rate_cents_per_satoshi} c/sat`,
              details: event.details
            };
          default:
            return {
              ...baseTransaction,
              type: 'unknown',
              amount: 'N/A',
              btcAmount: 'N/A'
            };
        }
      });

      // Instead of replacing all transactions, merge new ones with existing ones
      setTransactions(prevTransactions => {
        const existingIds = new Set(prevTransactions.map(tx => tx.id));
        const newTransactions = transformedTransactions.filter(tx => !existingIds.has(tx.id));
        
        // Combine existing and new transactions, keep the latest ones first
        const combined = [...newTransactions, ...prevTransactions];
        
        // Limit to 20 most recent transactions
        return combined.slice(0, 20);
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load transactions on component mount
  useEffect(() => {
    // Auto-fetch on component mount
    fetchTransactions();
  }, [fetchTransactions]);

  // Helper function to get transaction icon and color based on type
  const getTransactionIcon = (type, eventType) => {
    switch (type) {
      case 'mint':
        return { icon: ArrowUpCircle, color: 'bg-green-100 text-green-600' };
      case 'burn':
        return { icon: ArrowDownCircle, color: 'bg-red-100 text-red-600' };
      case 'transfer':
        return { icon: Activity, color: 'bg-blue-100 text-blue-600' };
      case 'reserve_update':
        return { icon: Coins, color: 'bg-indigo-100 text-indigo-600' };
      case 'ratio_update':
        return { icon: TrendingUp, color: 'bg-purple-100 text-purple-600' };
      case 'rate_update':
        return { icon: Activity, color: 'bg-orange-100 text-orange-600' };
      default:
        return { icon: Activity, color: 'bg-gray-100 text-gray-600' };
    }
  };

  // Helper function to get display name for transaction type
  const getTransactionTypeName = (type, eventType) => {
    switch (type) {
      case 'mint':
        return 'Mint';
      case 'burn':
        return 'Burn';
      case 'transfer':
        return 'Transfer';
      case 'reserve_update':
        return 'Reserve Update';
      case 'ratio_update':
        return 'Ratio Update';
      case 'rate_update':
        return 'Rate Update';
      default:
        return type || 'Unknown';
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.eventType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         tx.type === filterType || 
                         (filterType === 'mint' && tx.type === 'mint') ||
                         (filterType === 'burn' && tx.type === 'burn') ||
                         (filterType === 'transfer' && tx.type === 'transfer') ||
                         (filterType === 'system' && ['reserve_update', 'ratio_update', 'rate_update'].includes(tx.type));
    return matchesSearch && matchesFilter;
  });

  return (
    <Card className="bhutan-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Live Transaction Feed</span>
          <div className="flex items-center gap-2">
            <Button 
              onClick={fetchTransactions} 
              disabled={isLoading}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Syncing...' : 'Refresh'}
            </Button>
            <Badge variant="secondary" className={`${
              isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800 animate-pulse'
            }`}>
              {isLoading ? 'Syncing' : 'Live'}
            </Badge>
          </div>
        </CardTitle>
        
        {lastUpdated && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
            {isLoading && (
              <p className="text-sm text-blue-600 animate-pulse">
                Fetching latest transactions...
              </p>
            )}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">Error: {error}</p>
          </div>
        )}
        
        {/* Filters */}
        <div className="flex gap-4 pt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by hash or amount..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="mint">Mint Only</SelectItem>
              <SelectItem value="burn">Burn Only</SelectItem>
              <SelectItem value="transfer">Transfer Only</SelectItem>
              <SelectItem value="system">System Events</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Show loading overlay only for initial load when no data exists */}
        {isLoading && transactions.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-saffron-500" />
              <span className="text-lg">Fetching transactions from blockchain...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-2">No transactions loaded yet.</p>
                  <p className="text-sm">Click the refresh button to fetch the latest transactions.</p>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions found matching your criteria.
                </div>
              ) : (
                <>
                  {/* Show a subtle loading indicator at the top when refreshing with existing data */}
                  {isLoading && transactions.length > 0 && (
                    <div className="flex items-center justify-center py-2 border-b border-dashed border-blue-200">
                      <div className="flex items-center gap-2 text-blue-600">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Checking for new transactions...</span>
                      </div>
                    </div>
                  )}
                  
                  {filteredTransactions.map((tx) => {
                    const { icon: IconComponent, color } = getTransactionIcon(tx.type, tx.eventType);
                    return (
                      <div 
                        key={tx.id} 
                        className="flex items-center justify-between p-4 border rounded-lg bg-white/30 hover:bg-white/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${color}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {getTransactionTypeName(tx.type, tx.eventType)}
                              </span>
                              <Badge 
                                variant="secondary" 
                                className="bg-green-100 text-green-800"
                              >
                                {tx.status}
                              </Badge>
                              {tx.blockNumber && (
                                <Badge variant="outline" className="text-xs">
                                  Block {tx.blockNumber}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {tx.hash} • {tx.timestamp}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">{tx.amount}</p>
                          <p className="text-sm text-muted-foreground">{tx.btcAmount}</p>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </span>
              <Button variant="outline" size="sm" onClick={fetchTransactions}>
                Load More Transactions
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionFeed;
