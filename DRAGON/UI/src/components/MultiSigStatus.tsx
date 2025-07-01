
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Key, Users, CheckCircle, AlertCircle } from 'lucide-react';

const MultiSigStatus = () => {
  const wallets = [
    {
      id: 'treasury-main',
      name: 'Main Treasury Wallet',
      address: 'bc1q...7k8m',
      balance: '12962.4 BTC',
      threshold: '29-JUN -2025',
      status: 'active',
      signers: 3,
      pendingTxs: 0
    }
  ];

  return (
    <Card className="bhutan-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-saffron-500" />
          Multi-Signature Wallet Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {wallets.map((wallet) => (
            <div key={wallet.id} className="border rounded-lg p-4 bg-white/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-saffron-400 to-dragon-500 flex items-center justify-center">
                    <Key className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{wallet.name}</h3>
                    <p className="text-sm text-muted-foreground">{wallet.address}</p>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={wallet.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                >
                  {wallet.status === 'active' ? (
                    <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                  ) : (
                    <><AlertCircle className="w-3 h-3 mr-1" /> Pending</>
                  )}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="font-semibold">{wallet.balance}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Deposit</p>
                  <p className="font-semibold">{wallet.threshold}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Signers</p>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span className="font-semibold">{wallet.signers}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="font-semibold">{wallet.pendingTxs} tx</p>
                </div>
              </div>

              {wallet.pendingTxs > 0 && (
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    View Pending
                  </Button>
                  <Button size="sm" className="text-xs bg-saffron-500 hover:bg-saffron-600">
                    Sign Transaction
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiSigStatus;
