import React, { useState } from 'react';
import { useRepay } from '@/hooks/useRepay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, DollarSign, CreditCard, Clock, AlertTriangle, CheckCircle, RefreshCw, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';

export function RepayInterface() {
  const {
    outstandingLoans,
    repaymentStats,
    usdcBalance,
    isLoading,
    error,
    repay,
    animatedStats,
    animatedUsdcBalance,
    refetch,
  } = useRepay();

  const [repayForm, setRepayForm] = useState({
    invoiceId: '',
  });
  const [isRepaying, setIsRepaying] = useState(false);

  const handleRepay = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repayForm.invoiceId) {
      toast.error('Please select an invoice to repay');
      return;
    }

    try {
      setIsRepaying(true);
      await repay(repayForm.invoiceId);
      
      // Reset form
      setRepayForm({
        invoiceId: '',
      });
      
      toast.success('Repayment successful!');
    } catch (err) {
      console.error('Error repaying:', err);
      toast.error('Failed to repay loan');
    } finally {
      setIsRepaying(false);
    }
  };

  const handleQuickRepay = async (invoiceId: string) => {
    try {
      setIsRepaying(true);
      await repay(invoiceId);
      toast.success('Repayment successful!');
    } catch (err) {
      console.error('Error repaying:', err);
      toast.error('Failed to repay loan');
    } finally {
      setIsRepaying(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getLoanStatusBadge = (loan: { isRepaid: boolean; isLiquidated: boolean; isOverdue: boolean }) => {
    if (loan.isRepaid) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Repaid
        </Badge>
      );
    }
    if (loan.isLiquidated) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Liquidated
        </Badge>
      );
    }
    if (loan.isOverdue) {
      return (
        <Badge variant="destructive">
          <Clock className="w-3 h-3 mr-1" />
          Overdue
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <CreditCard className="w-3 h-3 mr-1" />
        Active
      </Badge>
    );
  };

  const calculateRepaymentProgress = () => {
    const totalOutstanding = parseFloat(repaymentStats.totalOutstanding);
    const totalRepaid = parseFloat(repaymentStats.totalRepaid);
    const total = totalOutstanding + totalRepaid;
    return total > 0 ? (totalRepaid / total) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Error loading repayment data: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold transition-all duration-800 ease-out">
                ${animatedStats.totalOutstanding}
              </div>
              {isLoading && (
                <div className="ml-2 w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Amount to be repaid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">USDC Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold transition-all duration-800 ease-out">
                ${animatedUsdcBalance}
              </div>
              {isLoading && (
                <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for repayment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interest</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold transition-all duration-800 ease-out">
                ${animatedStats.totalInterest}
              </div>
              {isLoading && (
                <div className="ml-2 w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Accrued interest
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold transition-all duration-800 ease-out">
                {animatedStats.activeLoans}
              </div>
              {isLoading && (
                <div className="ml-2 w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Loans to repay
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Repayment Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Repayment Progress</CardTitle>
          <CardDescription>
            Your overall repayment status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Repaid: ${repaymentStats.totalRepaid}</span>
              <span>Total: ${(parseFloat(repaymentStats.totalOutstanding) + parseFloat(repaymentStats.totalRepaid)).toFixed(2)}</span>
            </div>
            <Progress 
              value={calculateRepaymentProgress()} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {calculateRepaymentProgress().toFixed(1)}% of total loans repaid
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="repay" className="space-y-4">
        <TabsList>
          <TabsTrigger value="repay">Repay Loan</TabsTrigger>
          <TabsTrigger value="outstanding">Outstanding Loans</TabsTrigger>
        </TabsList>

        <TabsContent value="repay" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Repay Loan</CardTitle>
              <CardDescription>
                Repay your outstanding loans with USDC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRepay} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceId">Invoice ID</Label>
                  <Input
                    id="invoiceId"
                    placeholder="1"
                    value={repayForm.invoiceId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepayForm(prev => ({ ...prev, invoiceId: e.target.value }))}
                    required
                    disabled={isRepaying}
                  />
                </div>
                <Button type="submit" disabled={isRepaying} className="w-full font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isRepaying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Repayment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Repay Loan
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outstanding" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Outstanding Loans</CardTitle>
                  <CardDescription>
                    Your loans that need to be repaid
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refetch}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {outstandingLoans.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {isLoading ? 'Loading outstanding loans...' : 'No outstanding loans found. You\'re all caught up!'}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Original Amount</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Total Due</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outstandingLoans.map((loan) => (
                      <TableRow key={loan.invoiceId}>
                        <TableCell className="font-mono text-sm">
                          #{loan.invoiceId}
                        </TableCell>
                        <TableCell>${loan.amount}</TableCell>
                        <TableCell>${loan.interestAccrued}</TableCell>
                        <TableCell className="font-semibold">${loan.totalAmount}</TableCell>
                        <TableCell>{formatDate(loan.dueDate)}</TableCell>
                        <TableCell>
                          {getLoanStatusBadge(loan)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickRepay(loan.invoiceId)}
                            disabled={isRepaying || loan.isRepaid}
                            className="font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isRepaying && !loan.isRepaid ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            {loan.isRepaid ? 'Repaid' : 'Repay'}
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
      </Tabs>

      {/* USDC Balance Warning */}
      {parseFloat(usdcBalance) < parseFloat(repaymentStats.totalOutstanding) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your USDC balance (${usdcBalance}) is lower than your outstanding balance (${repaymentStats.totalOutstanding}). 
            You may need to acquire more USDC to complete your repayments.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 