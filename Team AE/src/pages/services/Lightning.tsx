
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, QrCode, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Lightning = () => {
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState({
    amount: '',
    description: ''
  });
  const [generatedInvoice, setGeneratedInvoice] = useState<string>('');
  const [qrCodeData, setQrCodeData] = useState<string>('');

  // Simulated Lightning transactions
  const recentTransactions = [
    {
      id: '1',
      description: 'E-Residency Fee',
      amount: '0.0001 BTC',
      status: 'Completed',
      date: '2024-01-15',
      type: 'Payment'
    },
    {
      id: '2',
      description: 'Business License Fee',
      amount: '0.0005 BTC',
      status: 'Completed',
      date: '2024-01-10',
      type: 'Payment'
    },
    {
      id: '3',
      description: 'Contribution to Local Project',
      amount: '0.0002 BTC',
      status: 'Pending',
      date: '2024-01-12',
      type: 'Donation'
    }
  ];

  const handleGenerateInvoice = () => {
    if (!invoiceData.amount || !invoiceData.description) {
      toast.error('Please fill in both amount and description');
      return;
    }

    // Generate simulated Lightning invoice
    const simulatedInvoice = `lnbc${invoiceData.amount.replace('.', '')}u1pw${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedInvoice(simulatedInvoice);
    setQrCodeData(simulatedInvoice);
    
    toast.success('Lightning invoice generated successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-50';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'Failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              onClick={() => navigate('/dashboard/services')}
              variant="ghost"
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
            <h1 className="text-2xl font-bold text-gradient">Lightning Network Integration</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-druk-red mb-4">
            Fast & Efficient Payments via Lightning Network
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience instant, low-cost Bitcoin transactions for global payments in Bhutan's digital economy
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Generate Invoice */}
          <Card className="card-druk">
            <CardHeader>
              <CardTitle className="flex items-center text-druk-red">
                <Zap className="w-6 h-6 mr-2 text-yellow-500" />
                Generate Lightning Invoice
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Create an instant payment request for Bitcoin via Lightning Network
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="amount">Amount (BTC)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.0001"
                  placeholder="0.0001"
                  value={invoiceData.amount}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="E-Residency Fee"
                  value={invoiceData.description}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <Button
                onClick={handleGenerateInvoice}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate Invoice
              </Button>

              {generatedInvoice && (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-900 mb-2">Lightning Invoice Generated</h4>
                    <p className="text-xs font-mono bg-white p-2 rounded border break-all">
                      {generatedInvoice}
                    </p>
                  </div>

                  <div className="text-center p-6 bg-white rounded-lg border-2 border-dashed border-yellow-300">
                    <QrCode className="w-24 h-24 mx-auto text-yellow-500 mb-4" />
                    <p className="text-sm text-gray-600">QR Code would be displayed here</p>
                    <p className="text-xs text-gray-500 mt-2">Scan this with your Lightning wallet to pay</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="card-druk">
            <CardHeader>
              <CardTitle className="flex items-center text-druk-red">
                <Clock className="w-6 h-6 mr-2" />
                Recent Lightning Transactions
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Your Lightning Network payment history
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                        <span className="font-semibold text-gray-900">{transaction.amount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{transaction.date}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lightning Network Benefits */}
        <Card className="card-druk mt-8">
          <CardHeader>
            <CardTitle className="text-druk-red text-center">Why Lightning Network?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-yellow-500 text-black rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Instant Payments</h3>
                <p className="text-sm text-gray-600">Transactions complete in milliseconds, not minutes</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto">₿</div>
                <h3 className="font-semibold">Micro Fees</h3>
                <p className="text-sm text-gray-600">Pay fractions of a penny for any transaction size</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto">🌍</div>
                <h3 className="font-semibold">Global Reach</h3>
                <p className="text-sm text-gray-600">Send payments anywhere in the world instantly</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Note */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a demonstration of Lightning Network integration. 
            In production, this would connect to actual Lightning Network nodes and process real Bitcoin transactions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lightning;
