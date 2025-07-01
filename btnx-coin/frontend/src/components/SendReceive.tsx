
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, QrCode, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SendReceiveProps {
  walletAddress: string;
}

export const SendReceive = ({ walletAddress }: SendReceiveProps) => {
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendOpen, setSendOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sendAmount || !recipientAddress) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(sendAmount) <= 0) {
      toast({
        title: "Error",
        description: "Amount must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would normally interact with the blockchain
      toast({
        title: "Transaction Initiated",
        description: `Sending ${sendAmount} BTNX to ${recipientAddress.slice(0, 8)}... (Pending approval)`,
      });

      setSendAmount('');
      setRecipientAddress('');
      setSendOpen(false);
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to send transaction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: "Wallet address copied successfully",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const generateQRCode = (address: string) => {
    // Using a simple QR code service - in production, you'd use a proper QR library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Send Dialog */}
      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogTrigger asChild>
          <Button className="h-12 text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            <ArrowUpRight className="h-5 w-5 mr-2" />
            Send BTNX
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send BTNX</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="Enter recipient wallet address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (BTNX)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="focus:border-orange-500"
              />
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This transaction requires approval from {Math.ceil(3/2)} out of 3 signers for your multi-signature wallet.
              </p>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? 'Processing...' : 'Send Transaction'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Receive Dialog */}
      <Dialog open={receiveOpen} onOpenChange={setReceiveOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-12 text-lg border-orange-200 hover:bg-orange-50">
            <ArrowDownLeft className="h-5 w-5 mr-2" />
            Receive BTNX
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Receive BTNX</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg">Your Wallet Address</CardTitle>
                <CardDescription>Share this address to receive BTNX</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <img 
                    src={generateQRCode(walletAddress)}
                    alt="Wallet QR Code"
                    className="border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Wallet Address</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={walletAddress}
                      readOnly
                      className="bg-gray-50 text-sm"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(walletAddress)}
                      className="px-3 hover:bg-gray-50"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <QrCode className="h-4 w-4 inline mr-1" />
                    <strong>Tip:</strong> Others can scan this QR code to send you BTNX quickly and securely.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
