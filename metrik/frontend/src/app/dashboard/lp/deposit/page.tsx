'use client';

import { LendingInterface } from '@/components/contracts/LendingInterface';
import { LPDepositHistory } from '@/components/dashboard/LPDepositHistory';

export default function LPDepositPage() {
  return (
    <div className="space-y-6">
      <LendingInterface />
      <LPDepositHistory />
    </div>
  );
} 