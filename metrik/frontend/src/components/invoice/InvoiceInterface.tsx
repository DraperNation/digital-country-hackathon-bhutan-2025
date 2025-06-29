import React, { useState } from 'react';
import { useInvoice } from '@/hooks/useInvoice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, FileText, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export function InvoiceInterface() {
  const { 
    invoices, 
    userInvoices, 
    isLoading, 
    error, 
    createInvoice,
    checkVerificationStatus,
    animatedStats,
    refetch,
  } = useInvoice();

  const [newInvoice, setNewInvoice] = useState({
    buyer: '',
    creditAmount: '',
    dueDate: '',
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newInvoice.buyer || !newInvoice.creditAmount || !newInvoice.dueDate) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsCreating(true);
      await createInvoice(
        newInvoice.creditAmount,
        new Date(newInvoice.dueDate),
        newInvoice.buyer as `0x${string}`,
        `INV-${Date.now()}`, // Generate a unique invoice ID
        'ipfs://placeholder' // Placeholder IPFS hash
      );
      
      // Reset form
      setNewInvoice({
        buyer: '',
        creditAmount: '',
        dueDate: '',
      });
      
      toast.success('Invoice created successfully!');
    } catch (err) {
      console.error('Error creating invoice:', err);
      toast.error('Failed to create invoice');
    } finally {
      setIsCreating(false);
    }
  };

  const handleVerifyInvoice = async (invoiceId: string) => {
    try {
      await checkVerificationStatus(invoiceId);
      toast.success('Invoice verification status updated!');
      refetch();
    } catch (err) {
      console.error('Error verifying invoice:', err);
      toast.error('Failed to verify invoice');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getStatusBadge = (isVerified: boolean) => {
    return isVerified ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Verified
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        <XCircle className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Error loading invoices: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold transition-all duration-800 ease-out">
                {animatedStats.totalInvoices}
              </div>
              {isLoading && (
                <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              All time invoices created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold transition-all duration-800 ease-out">
                ${animatedStats.totalValue}
              </div>
              {isLoading && (
                <div className="ml-2 w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined invoice value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Invoices</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold transition-all duration-800 ease-out">
                {animatedStats.verifiedInvoices}
              </div>
              {isLoading && (
                <div className="ml-2 w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold transition-all duration-800 ease-out">
                {animatedStats.pendingInvoices}
              </div>
              {isLoading && (
                <div className="ml-2 w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create Invoice</TabsTrigger>
          <TabsTrigger value="my-invoices">My Invoices</TabsTrigger>
          <TabsTrigger value="all-invoices">All Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Invoice</CardTitle>
              <CardDescription>
                Create a new invoice for your services or products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateInvoice} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buyer">Buyer Address</Label>
                    <Input
                      id="buyer"
                      placeholder="0x..."
                      value={newInvoice.buyer}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, buyer: e.target.value }))}
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creditAmount">Credit Amount (USDC)</Label>
                    <Input
                      id="creditAmount"
                      type="number"
                      placeholder="1000"
                      value={newInvoice.creditAmount}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, creditAmount: e.target.value }))}
                      required
                      disabled={isCreating}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    required
                    disabled={isCreating}
                  />
                </div>
                <Button type="submit" disabled={isCreating} className="w-full font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Invoice...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Invoice
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Invoices</CardTitle>
                  <CardDescription>
                    Invoices you have created
                  </CardDescription>
                </div>
                {isLoading && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Updating...
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {userInvoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {isLoading ? 'Loading your invoices...' : 'No invoices found. Create your first invoice above.'}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userInvoices.map((invoice) => (
                      <TableRow key={invoice.invoiceId}>
                        <TableCell className="font-mono text-sm">
                          #{invoice.invoiceId}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {invoice.buyer.slice(0, 6)}...{invoice.buyer.slice(-4)}
                        </TableCell>
                        <TableCell>${invoice.creditAmount}</TableCell>
                        <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                        <TableCell>
                          {getStatusBadge(invoice.isVerified)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerifyInvoice(invoice.invoiceId)}
                            disabled={invoice.isVerified || isLoading}
                          >
                            {invoice.isVerified ? 'Verified' : 'Verify'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Invoices</CardTitle>
                  <CardDescription>
                    All invoices in the system
                  </CardDescription>
                </div>
                {isLoading && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Updating...
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {isLoading ? 'Loading all invoices...' : 'No invoices found in the system.'}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.invoiceId}>
                        <TableCell className="font-mono text-sm">
                          #{invoice.invoiceId}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {invoice.supplier.slice(0, 6)}...{invoice.supplier.slice(-4)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {invoice.buyer.slice(0, 6)}...{invoice.buyer.slice(-4)}
                        </TableCell>
                        <TableCell>${invoice.creditAmount}</TableCell>
                        <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                        <TableCell>
                          {getStatusBadge(invoice.isVerified)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 