"use client";

import React, { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExternalLink, Shield, Clock, Check, Copy } from 'lucide-react';
import { Dataset } from '@/types';

interface BlockchainVerificationProps {
  dataset: Dataset;
}

function getNetworkConfig(network: string) {
  const configs = {
    ethereum: {
      name: 'Ethereum',
      color: 'bg-blue-500',
      icon: '⟠',
      confirmationsRequired: 12,
    },
    polygon: {
      name: 'Polygon',
      color: 'bg-purple-500',
      icon: '⬟',
      confirmationsRequired: 128,
    },
    solana: {
      name: 'Solana',
      color: 'bg-green-500',
      icon: '◎',
      confirmationsRequired: 32,
    },
    avalanche: {
      name: 'Avalanche',
      color: 'bg-red-500',
      icon: '▲',
      confirmationsRequired: 35,
    },
    'binance-smart-chain': {
      name: 'BNB Chain',
      color: 'bg-yellow-500',
      icon: '⚡',
      confirmationsRequired: 20,
    },
  };
  return configs[network as keyof typeof configs] || configs.ethereum;
}

const formatTxId = (txId: string, length: number = 16) => {
  if (txId.length <= length) return txId;
  return `${txId.slice(0, length)}...${txId.slice(-8)}`;
};

export const BlockchainVerification = memo(function BlockchainVerification({ dataset }: BlockchainVerificationProps) {
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);
  
  if (!dataset.blockchain) {
    return (
      <Badge variant="outline" className="text-gray-500">
        <Clock className="h-3 w-3 mr-1" />
        Pending Verification
      </Badge>
    );
  }

  const { blockchain } = dataset;
  const networkConfig = getNetworkConfig(blockchain.network);
  const isFullyConfirmed = blockchain.confirmations >= networkConfig.confirmationsRequired;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto p-1">
          <Badge 
            variant={isFullyConfirmed ? "default" : "secondary"} 
            className="flex items-center gap-1 cursor-pointer hover:opacity-80"
          >
            {isFullyConfirmed ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Clock className="h-3 w-3 text-yellow-600" />
            )}
            <span className={`w-3 h-3 rounded-full ${networkConfig.color} flex items-center justify-center text-white text-xs font-bold`}>
              {networkConfig.icon}
            </span>
            {networkConfig.name}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Blockchain Verification Details
          </DialogTitle>
          <DialogDescription>
            Dataset "{dataset.name}" has been stored on the {networkConfig.name} blockchain
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Network Badge */}
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full ${networkConfig.color} flex items-center justify-center text-white text-lg font-bold`}>
              {networkConfig.icon}
            </span>
            <div>
              <div className="font-medium">{networkConfig.name} Network</div>
              <div className="text-sm text-muted-foreground">
                {isFullyConfirmed ? 'Fully Confirmed' : `${blockchain.confirmations}/${networkConfig.confirmationsRequired} confirmations`}
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm bg-muted px-2 py-1 rounded flex-1">
                    {formatTxId(blockchain.txId, 20)}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(blockchain.txId)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {blockchain.blockNumber && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Block Number</label>
                  <div className="text-sm mt-1">
                    #{blockchain.blockNumber.toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Confirmations</label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-sm">{blockchain.confirmations.toLocaleString()}</div>
                  {isFullyConfirmed ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                <div className="text-sm mt-1">
                  {blockchain.timestamp.toLocaleString()}
                </div>
              </div>
            </div>

            {blockchain.gasUsed && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gas Used</label>
                <div className="text-sm mt-1">
                  {blockchain.gasUsed.toLocaleString()} units
                </div>
              </div>
            )}
          </div>

          {/* Data Integrity */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="font-medium">Data Integrity</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>✓ Cryptographic hash stored on blockchain</div>
              <div>✓ Immutable timestamp verification</div>
              <div>✓ Decentralized verification network</div>
              <div>✓ Tamper-evident storage</div>
            </div>
          </div>

          {/* Explorer Link */}
          <div className="flex justify-center">
            <Button asChild className="w-full">
              <a 
                href={blockchain.explorerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View on {networkConfig.name} Explorer
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});