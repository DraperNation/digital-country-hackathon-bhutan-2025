'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useStaking } from '@/hooks/useStaking';
import { useInvoiceNFT } from '@/hooks/useInvoiceNFT';
import { useLendingPool } from '@/hooks/useLendingPool';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock } from 'lucide-react';

export default function InvoicePage() {
  const { address } = useAccount();
  const { stakedAmount } = useStaking();
  const { 
    createInvoice, 
    invoices, 
    fetchInvoices,
    isLoading, 
    error 
  } = useInvoiceNFT();
  const { getUserLoans, getUserLoanDetails } = useLendingPool();
  
  const [creditAmount, setCreditAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loanHistory, setLoanHistory] = useState<{
    tokenId: string;
    amount: string;
    dueDate: Date;
    isRepaid: boolean;
    isLiquidated: boolean;
    interestAccrued: string;
  }[]>([]);

  useEffect(() => {
    if (address) {
      fetchInvoices(address);
    }
  }, [address, fetchInvoices]);

  useEffect(() => {
    const fetchLoanHistory = async () => {
      if (!address) return;
      try {
        const loanIds = await getUserLoans(address);
        const details = await Promise.all(
          loanIds.map(async (tokenId: string) => {
            try {
              const d = await getUserLoanDetails(address, tokenId);
              return d ? { ...d, tokenId } : null;
            } catch (err) {
              return null;
            }
          })
        );
        setLoanHistory(details.filter(Boolean) as any);
      } catch (e) {
        setLoanHistory([]);
        toast.error('Error fetching loan history.');
      }
    };
    fetchLoanHistory();
  }, [address, getUserLoans, getUserLoanDetails]);

  const generateInvoiceId = () => {
    if (!address) return '';
    // Get last 6 characters of wallet address
    const shortAddress = address.slice(-6);
    // Generate random 4 digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    // Combine them with a hyphen
    return `INV-${shortAddress}-${randomNum}`;
  };

  const handleCreateClick = () => {
    const newInvoiceId = generateInvoiceId();
    setInvoiceId(newInvoiceId);
    setShowCreateForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size exceeds 10MB limit');
        return;
      }
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Invalid file type. Only PDF, JPEG, and PNG files are allowed');
        return;
      }
      setUploadError(null);
      setInvoiceFile(file);
    }
  };

  const uploadToIPFS = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload-to-ipfs', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload to IPFS');
      }
      const data = await response.json();
      return {
        ipfsHash: data.ipfsHash,
        gatewayUrl: data.gatewayUrl
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload to IPFS';
      setUploadError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!creditAmount || !dueDate || !invoiceFile || !invoiceId) return;
    try {
      if (!address) throw new Error('No wallet address found');
      const { ipfsHash } = await uploadToIPFS(invoiceFile);
      await createInvoice(
        creditAmount,
        new Date(dueDate),
        address,
        invoiceId,
        ipfsHash
      );
      await fetchInvoices(address);
      setCreditAmount('');
      setDueDate('');
      setInvoiceFile(null);
      setInvoiceId('');
      setUploadError(null);
      setShowCreateForm(false);
      toast.success('Invoice created successfully!');
    } catch (err) {
      console.error('Error creating invoice:', err);
      toast.error('Error creating invoice. Please try again.');
    }
  };

  const isStaked = stakedAmount && parseFloat(stakedAmount) > 0;

  const sortedPending = invoices.filter(i => !i.isVerified).sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime());
  const sortedVerified = invoices.filter(i => i.isVerified).sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime());

  return (
    <div className="space-y-6">
      {!isStaked ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need to stake METRIK tokens to create invoices.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {!showCreateForm ? (
              <div className="text-center">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Invoice</h3>
                <div className="mt-5">
                  <button
                    onClick={handleCreateClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create New Invoice
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Invoice</h3>
                <div className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="invoiceId" className="block text-sm font-medium text-gray-700">
                      Invoice ID
                    </label>
                    <input
                      type="text"
                      id="invoiceId"
                      value={invoiceId}
                      readOnly
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-2 py-3 text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="creditAmount" className="block text-sm font-medium text-gray-700">
                      Credit Amount
                    </label>
                    <input
                      type="number"
                      id="creditAmount"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-2 py-3 text-black"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-2 py-3 text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="invoiceFile" className="block text-sm font-medium text-gray-700">
                      Invoice Document
                    </label>
                    <input
                      type="file"
                      id="invoiceFile"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="mt-1 block text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
                    />
                    {uploadError && (
                      <p className="mt-2 text-sm text-red-600">
                        {uploadError}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCreateInvoice}
                      disabled={isLoading || isUploading || !creditAmount || !dueDate || !invoiceFile}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isLoading || isUploading ? 'Creating...' : 'Create Invoice'}
                    </button>
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">
                      {error.message}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-500" />
            Your Invoices
          </CardTitle>
          <CardDescription>
            View and track your invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending ({invoices.filter(i => !i.isVerified).length})
              </TabsTrigger>
              <TabsTrigger value="verified" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Verified ({invoices.filter(i => i.isVerified).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : sortedPending.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No pending invoices found.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Invoice ID</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Due Date</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Document</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {sortedPending.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-yellow-50 transition">
                          <td className="px-4 py-2 font-mono font-medium">{invoice.invoiceId}</td>
                          <td className="px-4 py-2">{invoice.creditAmount}</td>
                          <td className="px-4 py-2">{invoice.dueDate.toLocaleDateString()}</td>
                          <td className="px-4 py-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <a 
                              href={invoice.gatewayUrl || `https://gateway.pinata.cloud/ipfs/${invoice.ipfsHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-500"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="verified">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : sortedVerified.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No verified invoices found.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Invoice ID</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Due Date</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Document</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {sortedVerified.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-green-50 transition">
                          <td className="px-4 py-2 font-mono font-medium">{invoice.invoiceId}</td>
                          <td className="px-4 py-2">{invoice.creditAmount}</td>
                          <td className="px-4 py-2">{invoice.dueDate.toLocaleDateString()}</td>
                          <td className="px-4 py-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Verified
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <a 
                              href={invoice.gatewayUrl || `https://gateway.pinata.cloud/ipfs/${invoice.ipfsHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-500"
                            >
                              View
                            </a>
                          </td>
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

      {/* Invoice History Section */}
      {/* <div className="bg-white shadow sm:rounded-lg mt-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Invoice History</h3>
          <div className="mt-5">
            {loanHistory.length === 0 ? (
              <p className="text-gray-500">No past invoices found.</p>
            ) : (
              <ul className="-my-5 divide-y divide-gray-200">
                {loanHistory.map((loan) => (
                  <li key={loan.tokenId} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Invoice #{loan.tokenId}
                        </p>
                        <p className="text-sm text-gray-500">
                          Amount: {loan.amount} | Interest: {loan.interestAccrued}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {loan.isRepaid ? 'Repaid' : loan.isLiquidated ? 'Liquidated' : 'Active'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Due: {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : ''}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div> */}
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
} 