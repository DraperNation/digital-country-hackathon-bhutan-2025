'use client';

import { StakingInterface } from '@/components/contracts/StakingInterface';
import { SupplierStakingHistory } from '@/components/dashboard/SupplierStakingHistory';

export default function StakingPage() {
  return (
    <div className="space-y-6">
      <StakingInterface />
      <SupplierStakingHistory />
    </div>
  );
} 