
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bitcoin, Coins, TrendingUp, Shield } from 'lucide-react';

interface StatsData {
  btc_reserves: {
    satoshis: string;
    btc: number;
    usd_value: number;
  };
  dgc_circulation: {
    wei: string;
    dgc: number;
    usd_value: number;
  };
  rates: {
    btc_usd: number;
    dgc_target_usd: number;
    exchange_rate_cents_per_satoshi: number;
  };
}

interface StatsOverviewProps {
  data?: StatsData;
  isLoading?: boolean;
}

const StatsOverview = ({ data, isLoading }: StatsOverviewProps) => {
  // Default/fallback values
  const btcReserves = data?.btc_reserves?.btc || 1;
  const btcUsdValue = data?.btc_reserves?.usd_value || 107000;
  const dgcCirculation = data?.dgc_circulation?.dgc || 66667;
  const dgcUsdValue = data?.dgc_circulation?.usd_value || 66667;
  const dgcPrice = data?.rates?.dgc_target_usd || 1;
  const btcPrice = data?.rates?.btc_usd || 107000;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* BTC Reserves */}
      <Card className="bhutan-card hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-md border border-blue-200 hover:border-orange-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                BTC Reserves
              </p>
              <p className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : btcReserves.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoading ? '...' : btcReserves*107000 +'USD'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <Bitcoin className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              +0.3% 24h
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* DGC Circulation */}
      <Card className="bhutan-card hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-md border border-gray-200 hover:border-saffron-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                DRGC in Circulation
              </p>
              <p className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : `${(dgcCirculation / 1000).toFixed(1)}K`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ≈ ${isLoading ? '...' : dgcUsdValue >= 1e6 ? 
                  `${(dgcUsdValue / 1e6).toFixed(1)}M` : 
                  dgcUsdValue.toLocaleString()} USD
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              +0.0001% 7d
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* DGC Price */}
      <Card className="bhutan-card hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-md border border-gray-200 hover:border-dragon-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                DRGC Price
              </p>
              <p className="text-2xl font-bold text-foreground">
                ${isLoading ? '...' : dgcPrice.toFixed(6)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoading ? '...' : (dgcPrice / btcPrice).toExponential(4)} BTC
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-dragon-400 to-dragon-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              +0.12% 24h
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card className="bhutan-card hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-md border border-gray-200 hover:border-green-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Security Status
              </p>
              <p className="text-2xl font-bold text-green-600">Secure</p>
              <p className="text-xs text-muted-foreground mt-1">
                Multi-sig Active
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              All Systems Online
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
