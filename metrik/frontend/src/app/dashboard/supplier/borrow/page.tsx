'use client';

import { useState, useEffect } from 'react';
import { useStaking } from '@/hooks/useStaking';
import { useInvoiceNFT } from '@/hooks/useInvoiceNFT';
import { useLendingPool } from '@/hooks/useLendingPool';
import { useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/config';

export default function BorrowPage() {
  const { address } = useAccount();
  const { stakedAmount } = useStaking();
  const { invoices, getInvoiceDetails, approveInvoice, isInvoiceApproved } = useInvoiceNFT();
  const { borrow, getMaxBorrowAmount } = useLendingPool();
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState<any | null>(null);
  const [selectedMaxBorrow, setSelectedMaxBorrow] = useState<string>('0');
  const [selectedBorrowInput, setSelectedBorrowInput] = useState<string>('');
  const [selectedLoading, setSelectedLoading] = useState<boolean>(false);
  const [selectedError, setSelectedError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Update debug info when relevant values change
  useEffect(() => {
    const selectedInvoiceData = invoices.find(inv => inv.id === selectedInvoice);
    console.log('Debug state update:', {
      selectedInvoice,
      selectedInvoiceData,
      invoices: invoices.map(inv => ({ id: inv.id, invoiceId: inv.invoiceId })),
      maxBorrowAmount: selectedMaxBorrow.toString(),
      borrowAmount: selectedBorrowInput
    });
  }, [invoices, selectedInvoice, selectedMaxBorrow, selectedBorrowInput]);

  // When an invoice is selected, fetch its details and max borrow amount
  useEffect(() => {
    if (selectedInvoice) {
      setSelectedLoading(true);
      setSelectedError(null);
      Promise.all([
        getInvoiceDetails(selectedInvoice),
        getMaxBorrowAmount(selectedInvoice)
      ]).then(([details, maxAmount]) => {
        setSelectedInvoiceDetails(details);
        setSelectedMaxBorrow(maxAmount);
      }).catch(() => {
        setSelectedError('Failed to fetch invoice details or max borrow amount');
      }).finally(() => {
        setSelectedLoading(false);
      });
    } else {
      setSelectedInvoiceDetails(null);
      setSelectedMaxBorrow('0');
      setSelectedBorrowInput('');
      setSelectedError(null);
    }
  }, [selectedInvoice]);

  useEffect(() => {
    if (!selectedLoading && invoices.length > 0) {
      setHasLoadedOnce(true);
    }
  }, [selectedLoading, invoices.length]);

  // Borrow handler for the selected invoice
  const handleSelectedBorrow = async () => {
    if (!selectedInvoice || !selectedBorrowInput) return;
    setSelectedLoading(true);
    setSelectedError(null);
    try {
      const invoiceDetails = await getInvoiceDetails(selectedInvoice);
      if (!invoiceDetails) throw new Error('Invoice not found');
      if (!invoiceDetails.isVerified) throw new Error('Invoice is not verified');
      if (invoiceDetails.supplier.toLowerCase() !== address?.toLowerCase()) throw new Error('You are not the supplier of this invoice');
      if (new Date(invoiceDetails.dueDate) <= new Date()) throw new Error('Invoice has expired');
      const borrowAmountWei = BigInt(selectedBorrowInput) * BigInt(1e6);
      const maxBorrowAmountWei = BigInt(selectedMaxBorrow || '0');
      if (borrowAmountWei > maxBorrowAmountWei) throw new Error(`Borrow amount exceeds maximum allowed (${(maxBorrowAmountWei / BigInt(1e6)).toString()} USDC)`);
      const isApproved = await isInvoiceApproved(selectedInvoice);
      if (!isApproved) {
        await approveInvoice(selectedInvoice);
        const isNowApproved = await isInvoiceApproved(selectedInvoice);
        if (!isNowApproved) throw new Error('Invoice approval failed. Please try again.');
      }
      await borrow(selectedInvoice, borrowAmountWei.toString());
      setSelectedInvoice(null);
      setSelectedInvoiceDetails(null);
      setSelectedMaxBorrow('0');
      setSelectedBorrowInput('');
    } catch (err: any) {
      setSelectedError(err.message || 'Error borrowing');
    } finally {
      setSelectedLoading(false);
    }
  };

  const inputAmount = Number(selectedBorrowInput);
const inputAmountInUSDC = !isNaN(inputAmount) ? BigInt(Math.floor(inputAmount * 1e6)) : BigInt(0);
const maxBorrow = BigInt(selectedMaxBorrow || '0');
const isInputValid = !isNaN(inputAmount) && inputAmount > 0 && inputAmountInUSDC <= maxBorrow;


  const isStaked = stakedAmount && parseFloat(stakedAmount) > 0;
  const hasVerifiedInvoices = invoices.length > 0;

  // Format max borrow for display (handles both 1e6 and 1e18 units)
  let maxBorrowDisplay = 0;
  if (Number(selectedMaxBorrow) > 1e12) {
    // Looks like 1e18 units (ETH-style)
    maxBorrowDisplay = Number(selectedMaxBorrow) / 1e18;
  } else {
    // Looks like 1e6 units (USDC-style)
    maxBorrowDisplay = Number(selectedMaxBorrow) / 1e6;
  }
  const maxBorrowDisplayFormatted = maxBorrowDisplay.toLocaleString(undefined, { maximumFractionDigits: 2 });

  // Validation for input exceeding max borrow (compare in user units)
  let inputError = '';
  if (
    selectedBorrowInput &&
    !isNaN(Number(selectedBorrowInput)) &&
    Number(selectedBorrowInput) > 0 &&
    Number(selectedBorrowInput) > maxBorrowDisplay
  ) {
    inputError = `Amount exceeds max borrow amount (${maxBorrowDisplayFormatted} USDC)`;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-full">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Borrow Against Invoice</h2>
          <p className="text-gray-500 mb-6">Select a verified invoice and borrow USDC against it. The platform will automatically handle NFT approval if needed.</p>
          {!isStaked ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    You need to stake METRIK tokens to borrow.
                  </p>
                </div>
              </div>
            </div>
          ) : !hasVerifiedInvoices ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    You need to have verified invoices to borrow.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {!selectedInvoice ? (
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Invoice ID</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Due Date</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {selectedLoading && !hasLoadedOnce ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center">
                            <div className="space-y-4">
                              {[1, 2].map((i) => (
                                <div key={i} className="animate-pulse">
                                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 mx-auto"></div>
                                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ) : invoices.filter(inv => inv.isVerified).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500">
                            No verified invoices found.
                          </td>
                        </tr>
                      ) : (
                        invoices.filter(inv => inv.isVerified).map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-indigo-50 transition">
                            <td className="px-4 py-2 font-mono font-medium">{invoice.invoiceId}</td>
                            <td className="px-4 py-2">{invoice.creditAmount} USDC</td>
                            <td className="px-4 py-2">{invoice.dueDate instanceof Date ? invoice.dueDate.toLocaleDateString() : invoice.dueDate}</td>
                            <td className="px-4 py-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Verified
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <button
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => setSelectedInvoice(invoice.id)}
                              >
                                Borrow
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : selectedInvoiceDetails && (
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                  <div className="relative w-full max-w-full mx-auto bg-white border border-gray-200 shadow-2xl rounded-xl p-8">
                    <button
                      className="absolute top-4 left-4 text-gray-400 hover:text-indigo-600 focus:outline-none"
                      onClick={() => setSelectedInvoice(null)}
                      disabled={selectedLoading}
                      aria-label="Back"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <h4 className="text-xl font-semibold text-gray-800 mb-4 text-center">Invoice Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500">Invoice ID</div>
                        <div className="font-mono text-sm">{selectedInvoiceDetails.invoiceId}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Credit Amount</div>
                        <div className="text-sm">{selectedInvoiceDetails.creditAmount} USDC</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Due Date</div>
                        <div className="text-sm">{selectedInvoiceDetails.dueDate instanceof Date ? selectedInvoiceDetails.dueDate.toLocaleDateString() : selectedInvoiceDetails.dueDate}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Status</div>
                        <div className="text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs text-gray-500">Max Borrow Amount</div>
                      <div className="text-lg font-bold text-indigo-700">{maxBorrowDisplayFormatted} USDC</div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 items-end mb-2">
                      <input
                        type="number"
                        className="block w-full max-w-xl rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-2 py-2 text-black"
                        placeholder="Enter amount"
                        min="0"
                        max={maxBorrowDisplay}
                        value={selectedBorrowInput}
                        onChange={e => setSelectedBorrowInput(e.target.value)}
                        disabled={selectedLoading}
                      />
                      <button
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        onClick={handleSelectedBorrow}
                        disabled={
                          selectedLoading ||
                          !selectedBorrowInput ||
                          isNaN(Number(selectedBorrowInput)) ||
                          Number(selectedBorrowInput) <= 0 ||
                          Number(selectedBorrowInput) > maxBorrowDisplay
                        }
                      >
                        {selectedLoading ? 'Processing...' : 'Borrow'}
                      </button>
                    </div>
                    {inputError && (
                      <div className="text-xs text-red-600 mt-2 text-center">{inputError}</div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 