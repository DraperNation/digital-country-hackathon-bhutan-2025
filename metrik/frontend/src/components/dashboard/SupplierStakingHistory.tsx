'use client';

import { useStakingHistory } from '@/hooks/useStakingHistory';
import { TrendingUp, History, CheckCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export function SupplierStakingHistory() {
  const { 
    activeStakes, 
    stakeHistory, 
    animatedStakeUsage,
    isLoading, 
    error 
  } = useStakingHistory();
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (!isLoading && (activeStakes.length > 0 || stakeHistory.length > 0)) {
      setHasLoadedOnce(true);
    }
  }, [isLoading, activeStakes.length, stakeHistory.length]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-500" />
          Staking Management
        </CardTitle>
        <CardDescription>
          Manage and view your METRIK staking activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Active Stakes ({activeStakes.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Stake History ({stakeHistory.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {isLoading && !hasLoadedOnce ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : activeStakes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No active stakes found.</p>
              </div>
            ) : (
              <div className="rounded-md border relative">
                {isLoading && hasLoadedOnce && (
                  <div className="absolute right-4 top-2 flex items-center text-xs text-gray-400">
                    <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                    Updating...
                  </div>
                )}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Points</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Start Date</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Duration</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {activeStakes.map((stake, idx) => (
                      <tr key={idx} className="hover:bg-blue-50 transition">
                        <td className="px-4 py-2 font-mono font-medium">{stake.amount.toLocaleString()}</td>
                        <td className="px-4 py-2 font-mono">{stake.points.toLocaleString()}</td>
                        <td className="px-4 py-2">{stake.startTime.toLocaleString()}</td>
                        <td className="px-4 py-2">{Math.floor(Number(stake.duration) / (24 * 60 * 60))} days</td>
                        <td className="px-4 py-2">{stake.lastUpdateTime.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {isLoading && !hasLoadedOnce ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : stakeHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No stake history found.</p>
              </div>
            ) : (
              <div className="rounded-md border relative">
                {isLoading && hasLoadedOnce && (
                  <div className="absolute right-4 top-2 flex items-center text-xs text-gray-400">
                    <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                    Updating...
                  </div>
                )}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Start Date</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Duration</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Used for Borrow</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {stakeHistory.map((stake, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50 transition">
                        <td className="px-4 py-2 font-mono font-medium">{stake.amount.toLocaleString()}</td>
                        <td className="px-4 py-2">{stake.startTime.toLocaleString()}</td>
                        <td className="px-4 py-2">{Math.floor(Number(stake.duration) / (24 * 60 * 60))} days</td>
                        <td className="px-4 py-2 font-mono">{stake.usedForBorrow.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 