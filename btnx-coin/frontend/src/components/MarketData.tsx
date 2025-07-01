import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Shield, RefreshCw } from 'lucide-react';

interface MarketData {
  bitcoinPrice: number;
  usdToBtn: number;
  lastUpdated: string;
}

export const MarketData = () => {
  const [marketData, setMarketData] = useState<MarketData>({
    bitcoinPrice: 0,
    usdToBtn: 0,
    lastUpdated: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Collateral ratio is fixed at 200%
  const collateralRatio = 200;

  const fetchMarketData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch Bitcoin price from CoinGecko API
      const btcResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      const btcData = await btcResponse.json();
      
      // Fetch USD to BTN exchange rate from ExchangeRate-API
      const exchangeResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const exchangeData = await exchangeResponse.json();

      setMarketData({
        bitcoinPrice: btcData.bitcoin.usd,
        usdToBtn: exchangeData.rates.BTN || 83.5, // Fallback rate if API fails
        lastUpdated: new Date().toLocaleTimeString()
      });
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to fetch market data');
      // Set fallback values
      setMarketData({
        bitcoinPrice: 45000, // Fallback BTC price
        usdToBtn: 83.5, // Fallback exchange rate
        lastUpdated: new Date().toLocaleTimeString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatBTN = (amount: number) => {
    return new Intl.NumberFormat('en-BT', {
      style: 'currency',
      currency: 'BTN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Bitcoin Price */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg text-orange-800">Bitcoin Price</CardTitle>
            </div>
            <button
              onClick={fetchMarketData}
              disabled={isLoading}
              className="p-1 hover:bg-orange-200 rounded transition-colors"
            >
              <RefreshCw className={`h-4 w-4 text-orange-600 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <CardDescription className="text-orange-700">
            Real-time BTC/USD
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-2xl font-bold text-orange-800">Loading...</div>
          ) : error ? (
            <div className="text-2xl font-bold text-orange-800">
              {formatCurrency(marketData.bitcoinPrice, 'USD')}
              <div className="text-sm text-orange-600 mt-1">Using fallback data</div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-orange-800">
              {formatCurrency(marketData.bitcoinPrice, 'USD')}
            </div>
          )}
          <div className="text-sm text-orange-600 mt-2">
            Last updated: {marketData.lastUpdated}
          </div>
        </CardContent>
      </Card>

      {/* USD to BTN Exchange Rate */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-800">USD to BTN</CardTitle>
            </div>
            <button
              onClick={fetchMarketData}
              disabled={isLoading}
              className="p-1 hover:bg-blue-200 rounded transition-colors"
            >
              <RefreshCw className={`h-4 w-4 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <CardDescription className="text-blue-700">
            Bhutanese Ngultrum Rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-2xl font-bold text-blue-800">Loading...</div>
          ) : error ? (
            <div className="text-2xl font-bold text-blue-800">
              {formatBTN(marketData.usdToBtn)}
              <div className="text-sm text-blue-600 mt-1">Using fallback data</div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-blue-800">
              {formatBTN(marketData.usdToBtn)}
            </div>
          )}
          <div className="text-sm text-blue-600 mt-2">
            Per 1 USD
          </div>
        </CardContent>
      </Card>

      {/* Collateral Ratio */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg text-green-800">Collateral Ratio</CardTitle>
            </div>
          </div>
          <CardDescription className="text-green-700">
            BTNX Backing Ratio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-800">
            {collateralRatio}%
          </div>
          <div className="text-sm text-green-600 mt-2">
            2 USD BTC = 1 USD BTNX
          </div>
          <div className="text-xs text-green-500 mt-1">
            Over-collateralized for stability
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 