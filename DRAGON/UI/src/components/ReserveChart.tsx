import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis } from 'recharts';
import { Bitcoin, Shield, TrendingUp } from 'lucide-react';

interface ReserveChartProps {
  data?: {
    btc_reserves?: {
      btc: number;
    };
    reserve_ratio?: {
      target_percent: number;
      actual_percent: number;
    };
  };
  isLoading?: boolean;
}

const ReserveChart = ({ data, isLoading }: ReserveChartProps) => {
  const totalBtcReserves = data?.btc_reserves?.btc || 1;
  
  // Simulate distribution of reserves (in a real app, this would come from API)
  const reserveData = [
    { name: "Active Reserves", value: Math.round(totalBtcReserves * 0.6), color: "#f1b520" },
    { name: "Emergency Buffer", value: Math.round(totalBtcReserves * 0.25), color: "#ea9b0a" },
    { name: "Strategic Hold", value: Math.round(totalBtcReserves * 0.15), color: "#d47b20" },
  ];

  const ratioData = [
    { date: '2024-01', ratio: 118.5 },
    { date: '2024-02', ratio: 122.1 },
    { date: '2024-03', ratio: 119.8 },
    { date: '2024-04', ratio: 125.3 },
    { date: '2024-05', ratio: 123.7 },
    { date: '2024-06', ratio: data?.reserve_ratio?.target_percent || 150 },
  ];

  const currentRatio = data?.reserve_ratio?.target_percent || 150;
  const isHealthy = currentRatio >= 120;

  const totalReserves = reserveData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bhutan-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bitcoin className="w-5 h-5 text-saffron-500" />
            Bitcoin Reserve Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reserveData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {reserveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} BTC`, 'Amount']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #f1b520',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {reserveData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{item.value} BTC</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bhutan-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-dragon-500" />
            Reserve Ratio Trend
            <div className="flex items-center gap-1 ml-auto">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className={`text-sm font-medium ${isHealthy ? 'text-green-600' : 'text-yellow-600'}`}>
                {isLoading ? '...' : isHealthy ? 'Healthy' : 'Watch'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ratioData}>
                <XAxis dataKey="date" stroke="#8c470e" />
                <YAxis stroke="#8c470e" domain={[100, 150]} />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Ratio']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #f1b520',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ratio"
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
    </div>
  );
};

export default ReserveChart;
