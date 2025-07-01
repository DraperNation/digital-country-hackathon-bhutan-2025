'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isConnected } = useAccount();
  const pathname = usePathname();

  // Derive role from pathname
  const role = pathname.includes('/dashboard/supplier') ? 'supplier' 
    : pathname.includes('/dashboard/lp') ? 'lp'
    : pathname.includes('/dashboard/owner') ? 'owner'
    : null;

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }
    // If a role can't be determined from the pathname and the path is within /dashboard, redirect to home
    if (!role && pathname.startsWith('/dashboard')) {
      router.push('/');
      return;
    }
  }, [isConnected, role, router, pathname]);

  if (!isConnected || !role) {
    return null;
  }

  const supplierNavItems = [
    { name: 'Staking', href: '/dashboard/supplier/staking' },
    { name: 'Invoice', href: '/dashboard/supplier/invoice' },
    { name: 'Borrow', href: '/dashboard/supplier/borrow' },
    { name: 'Repay', href: '/dashboard/supplier/repay' },
  ];

  const lpNavItems = [
    { name: 'Deposit', href: '/dashboard/lp/deposit' },
    { name: 'Withdraw', href: '/dashboard/lp/withdraw' },
  ];

  const ownerNavItems = [
    { name: 'Verify Invoices', href: '/dashboard/owner' },
  ];

  const navItems = role === 'supplier' ? supplierNavItems 
    : role === 'lp' ? lpNavItems 
    : ownerNavItems;
  const activePath = pathname;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-indigo-600">
                  Metrik
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      activePath === item.href
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 