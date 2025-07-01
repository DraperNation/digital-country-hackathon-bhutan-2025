import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Bitcoin, TrendingUp, TrendingDown } from 'lucide-react';

const PriceChart = () => {
  // Initialize with current time and base price around 107k
  const getInitialData = (basePrice: number, multiplier: number = 1) => {
    const now = new Date();
    const data = [];
    for (let i = 19; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3000); // 3 second intervals for last 20 points
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      data.push({
        time: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        price: basePrice * multiplier * (1 + variation),
        timestamp: time.getTime()
      });
    }
    return data;
  };

  const [btcData, setBtcData] = useState(() => getInitialData(107000));
  const [dgcBtcData, setDgcBtcData] = useState(() => getInitialData(107000, 0.0000213 / 107000));
  const [dgcUsdData, setDgcUsdData] = useState(() => getInitialData(107000, 0.998 / 107000));
  const [priceChanges, setPriceChanges] = useState({
    btc: 0,
    dgcBtc: 0,
    dgcUsd: 0
  });

  // Update prices every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      // BTC price updates (around 107k with ±2% variation)
      setBtcData(prevData => {
        const lastPrice = prevData[prevData.length - 1].price;
        const variation = (Math.random() - 0.5) * 0.04; // ±2% variation
        const newPrice = Math.max(104000, Math.min(110000, lastPrice * (1 + variation))); // Keep between 104k-110k
        const change = ((newPrice - prevData[0].price) / prevData[0].price) * 100;
        
        setPriceChanges(prev => ({ ...prev, btc: change }));
        
        const newData = [...prevData.slice(1), {
          time: timeString,
          price: newPrice,
          timestamp: now.getTime()
        }];
        return newData;
      });

      // DRGC/BTC price updates
      setDgcBtcData(prevData => {
        const lastPrice = prevData[prevData.length - 1].price;
        const variation = (Math.random() - 0.5) * 0.06; // ±3% variation
        const newPrice = Math.max(0.0000180, Math.min(0.0000250, lastPrice * (1 + variation)));
        const change = ((newPrice - prevData[0].price) / prevData[0].price) * 100;
        
        setPriceChanges(prev => ({ ...prev, dgcBtc: change }));
        
        const newData = [...prevData.slice(1), {
          time: timeString,
          price: newPrice,
          timestamp: now.getTime()
        }];
        return newData;
      });

      // DRGC/USD price updates
      setDgcUsdData(prevData => {
        const lastPrice = prevData[prevData.length - 1].price;
        const variation = (Math.random() - 0.5) * 0.03; // ±1.5% variation
        const newPrice = Math.max(0.90, Math.min(1.10, lastPrice * (1 + variation)));
        const change = ((newPrice - prevData[0].price) / prevData[0].price) * 100;
        
        setPriceChanges(prev => ({ ...prev, dgcUsd: change }));
        
        const newData = [...prevData.slice(1), {
          time: timeString,
          price: newPrice,
          timestamp: now.getTime()
        }];
        return newData;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="btc-usd" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm">
          <TabsTrigger value="btc-usd">BTC/USD</TabsTrigger>
          <TabsTrigger value="dgc-btc">DRGC/BTC</TabsTrigger>
          <TabsTrigger value="dgc-usd">DRGC/USD</TabsTrigger>
        </TabsList>

        <TabsContent value="btc-usd">
          <Card className="bhutan-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="w-5 h-5 text-saffron-500" />
                Bitcoin Price (USD)
                <div className="flex items-center gap-1 ml-auto">
                  {priceChanges.btc >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${priceChanges.btc >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceChanges.btc >= 0 ? '+' : ''}{priceChanges.btc.toFixed(2)}%
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={btcData}>
                    <XAxis dataKey="time" stroke="#8c470e" fontSize={12} />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #f1b520',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#f1b520"
                      strokeWidth={3}
                      dot={{ fill: '#f1b520', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#f1b520', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dgc-btc">
          <Card className="bhutan-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="w-5 h-5 text-dragon-500" />
                DRGC Price (BTC)
                <div className="flex items-center gap-1 ml-auto">
                  {priceChanges.dgcBtc >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${priceChanges.dgcBtc >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceChanges.dgcBtc >= 0 ? '+' : ''}{priceChanges.dgcBtc.toFixed(2)}%
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dgcBtcData}>
                    <XAxis dataKey="time" stroke="#8c470e" fontSize={12} />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(value: number) => [value.toFixed(7), 'Price']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #ea9b0a',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#ea9b0a"
                      strokeWidth={3}
                      dot={{ fill: '#ea9b0a', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#ea9b0a', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dgc-usd">
          <Card className="bhutan-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-dragon-500" />
                DRGC Price (USD Secondary Markets)
                <div className="flex items-center gap-1 ml-auto">
                  {priceChanges.dgcUsd >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${priceChanges.dgcUsd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceChanges.dgcUsd >= 0 ? '+' : ''}{priceChanges.dgcUsd.toFixed(2)}%
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dgcUsdData}>
                    <XAxis dataKey="time" stroke="#8c470e" fontSize={12} />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(3)}`, 'Price']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #d47b20',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#d47b20"
                      strokeWidth={3}
                      dot={{ fill: '#d47b20', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#d47b20', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PriceChart;
