'use client';

import { usePlatformFees } from '@/hooks/usePlatformFees';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export function OwnerPlatformFees() {
  const { platformFees, isLoading, error, withdrawPlatformFees, refetch } = usePlatformFees();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdrawFees = async () => {
    setIsWithdrawing(true);
    try {
      await withdrawPlatformFees();
      // Background refresh (optional, since hook may already do it)
      refetch();
    } catch (err) {
      // Error is handled in the hook
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Fee Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-purple-500" />
            Platform Fees
          </CardTitle>
          <CardDescription>
            Accumulated fees from loan interest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{platformFees} USDC</p>
              <p className="text-sm text-gray-500">Available for withdrawal</p>
            </div>
            {/* No global spinner here */}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error loading platform fees: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Withdrawal Action */}
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Platform Fees</CardTitle>
          <CardDescription>
            Withdraw accumulated platform fees to your wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Platform fees are collected as 2% of the total interest paid on loans.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Only the contract owner can withdraw accumulated platform fees.
              </p>
            </div>
            <Button
              onClick={handleWithdrawFees}
              disabled={isWithdrawing || Number(platformFees) === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isWithdrawing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                'Withdraw Fees'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 