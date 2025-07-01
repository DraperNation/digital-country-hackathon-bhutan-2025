
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bitcoin, Coins, TrendingUp, TrendingDown, Shield, Users, RefreshCw, Eye } from 'lucide-react';
import ReserveChart from '@/components/ReserveChart';
import PriceChart from '@/components/PriceChart';
import TransactionFeed from '@/components/TransactionFeed';
import StatsOverview from '@/components/StatsOverview';
import MultiSigStatus from '@/components/MultiSigStatus';

const Index = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const [statusData, setStatusData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch status data
  const fetchStatusData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/status');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStatusData(data);
      setLastUpdated(new Date());
      setIsLive(true);
    } catch (err) {
      setError(err.message);
      setIsLive(false);
      console.error('Error fetching status data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchStatusData();
  }, [fetchStatusData]);

  // Simulated real-time data updates (optional - you can remove this if you only want manual refresh)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        setLastUpdated(new Date());
      }
    }, 30000); // Update timestamp every 30 seconds

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleRefresh = () => {
    fetchStatusData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-saffron-50/30 to-dragon-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br flex items-center justify-center p-1">
                <img 
                  src="/lovable-uploads/fbdc7794-3168-4711-b65e-cb31f7d10381.png" 
                  alt="Dragon Coin" 
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dragon Coin</h1>
                <p className="text-sm text-muted-foreground">Royal Government of Bhutan • Digital Currency Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm text-muted-foreground">
                  {isLive ? 'Live' : 'Offline'} • Updated {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Loading...' : 'Refresh'}
              </Button>
              
              <Button variant="outline" size="sm" asChild className="gap-2">
                <a href="/">
                  <Eye className="w-4 h-4" />
                  Landing
                </a>
              </Button>

              <Button variant="outline" size="sm" asChild className="gap-2">
                <a href="http://localhost:4200" target="_blank" rel="noopener noreferrer">
                  <Eye className="w-4 h-4" />
                  Hedging
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">Error fetching data: {error}</p>
          </div>
        )}

        {/* Key Metrics Overview */}
        <StatsOverview data={statusData} isLoading={isLoading} />

        {/* Multi-sig Wallet Status */}
        <div className="mb-8">
          <MultiSigStatus />
        </div>

        {/* Charts and Analytics */}
        <Tabs defaultValue="reserves" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="reserves" className="gap-2">
              <Bitcoin className="w-4 h-4" />
              Reserves
            </TabsTrigger>
            <TabsTrigger value="prices" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Price Charts
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <Eye className="w-4 h-4" />
              Live Feed
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <Shield className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reserves" className="space-y-6">
            <ReserveChart data={statusData} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="prices" className="space-y-6">
            <PriceChart />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <TransactionFeed />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bhutan-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-saffron-500" />
                    Stability Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Reserve Ratio</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {isLoading ? '...' : statusData?.reserve_ratio?.target_percent ? `${statusData.reserve_ratio.target_percent}%` : '150%'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Collateralization</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {isLoading ? '...' : statusData?.reserve_ratio?.is_overcollateralized ? 'Over-collateralized' : 'Under-collateralized'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Supply</span>
                      <Badge variant="secondary" className="bg-saffron-100 text-saffron-800">
                        {isLoading ? '...' : statusData?.supply_info?.current_supply_dgc ? 
                          `${(statusData.supply_info.current_supply_dgc / 1000).toFixed(1)}K DRGC` : '66.7K DRGC'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Max Mintable</span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {isLoading ? '...' : statusData?.supply_info?.max_mintable_dgc ? 
                          `${(statusData.supply_info.max_mintable_dgc / 1000).toFixed(1)}K DRGC` : '66.7K DRGC'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bhutan-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-dragon-500" />
                    User Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Wallets</span>
                      <span className="font-semibold">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Daily Volume</span>
                      <span className="font-semibold">$66.4K DRGC</span>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
