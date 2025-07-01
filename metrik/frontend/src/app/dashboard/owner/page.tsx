'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useInvoiceNFT } from '@/hooks/useInvoiceNFT';
import { OwnerPlatformFees } from '@/components/dashboard/OwnerPlatformFees';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function OwnerDashboard() {
  const router = useRouter();
  const { address } = useAccount();
  const { 
    invoices, 
    fetchInvoices,
    verifyInvoice,
    hasVerifierRole,
    isLoading, 
    error 
  } = useInvoiceNFT();

  const [isVerifier, setIsVerifier] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    if (address) {
      fetchInvoices(address);
      hasVerifierRole(address).then((hasRole) => {
        setIsVerifier(hasRole);
        setIsCheckingRole(false);
        if (!hasRole) {
          router.push('/');
        }
      });
    } else {
      setIsCheckingRole(false);
    }
  }, [address, fetchInvoices, hasVerifierRole, router]);

  const handleVerifyInvoice = async (tokenId: string) => {
    try {
      if (!isVerifier) {
        throw new Error('Only verifiers can verify invoices');
      }
      await verifyInvoice(tokenId);
      // No need to manually refresh, hook will do it
    } catch (err: any) {
      // Show concise error using toast
      let msg = err?.message || 'Error verifying invoice.';
      toast.error(msg);
    }
  };

  // Sort invoices: pending first, then verified
  const sortedInvoices = [...invoices].sort((a, b) => {
    if (a.isVerified === b.isVerified) {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(); // Newest first
    }
    return a.isVerified ? 1 : -1; // Pending first
  });

  const pendingInvoices = sortedInvoices.filter(invoice => !invoice.isVerified);
  const verifiedInvoices = sortedInvoices.filter(invoice => invoice.isVerified);

  if (isCheckingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isVerifier) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Fee Management */}
      <OwnerPlatformFees />
      
      {/* Invoice Verification */}
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              Error loading invoices: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Invoice Management Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              Invoice Management
            </CardTitle>
            <CardDescription>
              Manage and verify invoices for the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Pending ({pendingInvoices.length})
                </TabsTrigger>
                <TabsTrigger value="verified" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Verified ({verifiedInvoices.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : pendingInvoices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No pending invoices to verify!</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice ID</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Supplier</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Document</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingInvoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">
                              #{invoice.invoiceId}
                            </TableCell>
                            <TableCell>{invoice.creditAmount} USDC</TableCell>
                            <TableCell>{invoice.dueDate.toLocaleDateString()}</TableCell>
                            <TableCell className="font-mono text-sm">
                              {invoice.supplier.slice(0, 6)}...{invoice.supplier.slice(-4)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                Pending
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <a 
                                href={invoice.gatewayUrl || `https://gateway.pinata.cloud/ipfs/${invoice.ipfsHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-500"
                              >
                                <FileText className="h-4 w-4" />
                                View
                              </a>
                            </TableCell>
                            <TableCell>
                              {!invoice.isVerified && (
                                <Button
                                  onClick={() => handleVerifyInvoice(invoice.id)}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Verify
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="verified" className="mt-6">
                {verifiedInvoices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No verified invoices yet.</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice ID</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Supplier</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Document</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {verifiedInvoices.map((invoice) => (
                          <TableRow key={invoice.id} className="bg-green-50">
                            <TableCell className="font-medium">
                              #{invoice.invoiceId}
                            </TableCell>
                            <TableCell>{invoice.creditAmount} USDC</TableCell>
                            <TableCell>{invoice.dueDate.toLocaleDateString()}</TableCell>
                            <TableCell className="font-mono text-sm">
                              {invoice.supplier.slice(0, 6)}...{invoice.supplier.slice(-4)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Verified
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <a 
                                href={invoice.gatewayUrl || `https://gateway.pinata.cloud/ipfs/${invoice.ipfsHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-500"
                              >
                                <FileText className="h-4 w-4" />
                                View
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 