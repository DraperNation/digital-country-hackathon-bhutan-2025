'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useLendingPool } from '@/hooks/useLendingPool';
import { useInvoiceNFT } from '@/hooks/useInvoiceNFT';

interface LoanDetails {
  amount: string;
  dueDate: Date;
  isRepaid: boolean;
  isLiquidated: boolean;
  interestAccrued: string;
}

export default function RepayPage() {
  const { address } = useAccount();
  const { repay, getUserActiveLoans, getUserLoanDetails, isLoading, error } = useLendingPool();
  const { getInvoiceDetails } = useInvoiceNFT();

  const [activeLoanIds, setActiveLoanIds] = useState<string[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<any | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [loanDetailsMap, setLoanDetailsMap] = useState<Record<string, LoanDetails | null>>({});

  const fetchActiveLoans = useCallback(async () => {
    if (address) {
      console.log('RepayPage: Fetching active loans...');
      const loans = await getUserActiveLoans(address);
      console.log('RepayPage: Fetched active loan IDs:', loans);
      setActiveLoanIds(loans);
    }
  }, [address, getUserActiveLoans]);

  useEffect(() => {
    fetchActiveLoans();
  }, [fetchActiveLoans]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (selectedInvoiceId && address) {
        console.log('RepayPage: Selected Invoice ID changed or address available.', { selectedInvoiceId, address });
        const details = await getUserLoanDetails(address, selectedInvoiceId);
        console.log('RepayPage: Fetched loan details:', details);
        setLoanDetails(details);

        const invDetails = await getInvoiceDetails(selectedInvoiceId);
        console.log('RepayPage: Fetched invoice details:', invDetails);
        setInvoiceDetails(invDetails);
      } else {
        console.log('RepayPage: No selected invoice ID or address, resetting details.');
        setLoanDetails(null);
        setInvoiceDetails(null);
      }
    };
    fetchDetails();
  }, [selectedInvoiceId, address, getUserLoanDetails, getInvoiceDetails]);

  useEffect(() => {
    if (!isLoading && activeLoanIds.length > 0) {
      setHasLoadedOnce(true);
    }
  }, [isLoading, activeLoanIds.length]);

  // Fetch loan details for all active loans in the background
  useEffect(() => {
    let isMounted = true;
    async function fetchAllLoanDetails() {
      if (activeLoanIds.length === 0 || !address) return;
      const detailsEntries = await Promise.all(
        activeLoanIds.map(async (loanId) => {
          try {
            const details = await getUserLoanDetails(address, loanId);
            return [loanId, details];
          } catch {
            return [loanId, null];
          }
        })
      );
      if (isMounted) {
        setLoanDetailsMap(Object.fromEntries(detailsEntries));
      }
    }
    fetchAllLoanDetails();
    return () => { isMounted = false; };
  }, [activeLoanIds, address, getUserLoanDetails]);

  const handleRepay = async () => {
    if (!selectedInvoiceId) {
      console.log('RepayPage: No invoice selected for repay.');
      return;
    }

    try {
      console.log('RepayPage: Initiating repay for invoice', selectedInvoiceId);
      await repay(selectedInvoiceId);
      console.log('RepayPage: Repay successful.');

      fetchActiveLoans();
      setSelectedInvoiceId('');
      setLoanDetails(null);
      setInvoiceDetails(null);
    } catch (err) {
      console.error('RepayPage: Error during repay:', err);
    }
  };

  // Helper to format USDC
  const formatUSDC = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? '0' : num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Helper to calculate total due
  const getTotalDue = (details: LoanDetails | null) =>
    details ? (parseFloat(details.amount) + parseFloat(details.interestAccrued)) : 0;

  // Add a row-level repay handler
  const handleRepayRow = async (loanId: string) => {
    setSelectedInvoiceId(loanId);
    await handleRepay();
  };

  // UI
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-full">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Repay Loan</h2>
          <p className="text-gray-500 mb-6">Select an outstanding invoice to view loan details and repay your loan. Only active, non-liquidated, non-repaid loans are shown.</p>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Invoice ID</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Principal</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Interest Accrued</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Total Due</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Due Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {isLoading && !hasLoadedOnce ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : activeLoanIds.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-400 py-6">No outstanding loans found.</td>
                  </tr>
                ) : (
                  activeLoanIds.map((loanId) => {
                    const details = loanDetailsMap[loanId];
                    const isRepaid = details?.isRepaid;
                    const isLiquidated = details?.isLiquidated;
                    const disabled = isRepaid || isLiquidated;
                    return (
                      <tr key={loanId} className="hover:bg-indigo-50 transition">
                        <td className="px-4 py-2 font-mono font-medium">{loanId}</td>
                        <td className="px-4 py-2">{details ? `${formatUSDC(details.amount)} USDC` : <span className="text-gray-400">--</span>}</td>
                        <td className="px-4 py-2">{details ? `${formatUSDC(details.interestAccrued)} USDC` : <span className="text-gray-400">--</span>}</td>
                        <td className="px-4 py-2">{details ? `${formatUSDC(getTotalDue(details))} USDC` : <span className="text-gray-400">--</span>}</td>
                        <td className="px-4 py-2">{details && details.dueDate ? (details.dueDate instanceof Date ? details.dueDate.toLocaleDateString() : details.dueDate) : <span className="text-gray-400">--</span>}</td>
                        <td className="px-4 py-2">
                          {isRepaid ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Repaid</span>
                          ) : isLiquidated ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Liquidated</span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Active</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            onClick={() => handleRepayRow(loanId)}
                            disabled={disabled}
                          >
                            Repay
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {error && (
            <div className="mt-2 text-sm text-red-600 text-center">
              {error.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 