import { useState, useCallback, useEffect } from 'react';
import { useContract } from './useContract';
import { usePublicClient, useAccount, useWalletClient } from 'wagmi';
import { formatAmount } from '@/lib/utils/contracts';
import { type Address, parseUnits } from 'viem';
import { toast } from 'react-toastify';

export function useLendingPool() {
  const { contract: lendingPoolContract } = useContract('lendingPool');
  const { contract: usdcContract } = useContract('usdc');
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const [borrowedAmount, setBorrowedAmount] = useState<string>('0');
  const [availableLiquidity, setAvailableLiquidity] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<bigint | undefined>(undefined);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isBalanceError, setIsBalanceError] = useState(false);
  const [balanceError, setBalanceError] = useState<Error | null>(null);

  const fetchBorrowedAmount = useCallback(async (userAddress: Address) => {
    if (!publicClient || !lendingPoolContract.address || !lendingPoolContract.abi) {
      setBorrowedAmount('0');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await publicClient.readContract({
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'getUserTotalBorrowed',
        args: [userAddress],
      });
      setBorrowedAmount(formatAmount(data as bigint, 6)); // USDC has 6 decimals
    } catch (err) {
      console.error('Error fetching borrowed amount:', err);
      setError(err as Error);
      setBorrowedAmount('0');
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, lendingPoolContract.address, lendingPoolContract.abi]);

  const fetchAvailableLiquidity = useCallback(async () => {
    if (!publicClient || !usdcContract.address || !usdcContract.abi || !lendingPoolContract.address) {
      setAvailableLiquidity('0');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await publicClient.readContract({
        address: usdcContract.address,
        abi: usdcContract.abi,
        functionName: 'balanceOf',
        args: [lendingPoolContract.address],
      });
      setAvailableLiquidity(formatAmount(data as bigint, 6)); // USDC has 6 decimals
    } catch (err) {
      console.error('Error fetching available liquidity:', err);
      setError(err as Error);
      setAvailableLiquidity('0');
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, usdcContract.address, usdcContract.abi, lendingPoolContract.address]);

  const fetchUsdcBalance = useCallback(async () => {
    setIsBalanceLoading(true);
    setIsBalanceError(false);
    setBalanceError(null);
    if (!publicClient || !usdcContract.address || !usdcContract.abi || !address) {
      setUsdcBalance(undefined);
      setIsBalanceLoading(false);
      return;
    }
    try {
      const data = await publicClient.readContract({
        address: usdcContract.address,
        abi: usdcContract.abi,
        functionName: 'balanceOf',
        args: [address],
      });
      setUsdcBalance(data as bigint);
    } catch (err) {
      console.error('Error fetching USDC balance:', err);
      setIsBalanceError(true);
      setBalanceError(err as Error);
      setUsdcBalance(undefined);
    } finally {
      setIsBalanceLoading(false);
    }
  }, [publicClient, usdcContract.address, usdcContract.abi, address]);

  // Effect to refetch data on address change or periodically
  useEffect(() => {
    if (address) {
      fetchBorrowedAmount(address);
      fetchAvailableLiquidity();
      fetchUsdcBalance();

      const interval = setInterval(() => {
        fetchBorrowedAmount(address);
        fetchAvailableLiquidity();
        fetchUsdcBalance();
      }, 15000); // Refetch every 15 seconds

      return () => clearInterval(interval);
    }
  }, [address, fetchBorrowedAmount, fetchAvailableLiquidity, fetchUsdcBalance]);

  const deposit = useCallback(async (amount: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!lendingPoolContract || !lendingPoolContract.address || !lendingPoolContract.abi) {
        throw new Error('Lending pool contract not available.');
      }

      if (!usdcContract || !usdcContract.address || !usdcContract.abi) {
        throw new Error('USDC contract not available.');
      }

      if (!address) {
        throw new Error('Wallet not connected.');
      }

      if (!publicClient) {
        throw new Error('Public client not available. Please ensure network is connected.');
      }

      if (isBalanceLoading) {
        throw new Error('Loading USDC balance... Please wait.');
      }

      if (isBalanceError) {
        throw new Error(`Error fetching USDC balance: ${balanceError?.message}`);
      }

      const parsedAmount = parseUnits(amount, 6); // USDC has 6 decimals
      
      // Check if user has enough balance
      if (typeof usdcBalance !== 'bigint') {
        throw new Error('Invalid USDC balance format. Please try again.');
      }

      if (parsedAmount > usdcBalance) {
        throw new Error(`Insufficient USDC balance. You have ${formatAmount(usdcBalance, 6)} but trying to deposit ${amount}.`);
      }

      if (!walletClient) {
        throw new Error('Wallet client not available. Please ensure your wallet is connected.');
      }

      // First approve the lending pool to spend USDC
      const { request: approveRequest } = await publicClient.simulateContract({
        account: address,
        address: usdcContract.address,
        abi: usdcContract.abi,
        functionName: 'approve',
        args: [lendingPoolContract.address, parsedAmount],
      });

      const approveHash = await walletClient.writeContract(approveRequest);
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      // Then deposit in LendingPool
      const { request: depositRequest } = await publicClient.simulateContract({
        account: address,
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'deposit',
        args: [parsedAmount],
      });

      const depositHash = await walletClient.writeContract(depositRequest);
      await publicClient.waitForTransactionReceipt({ hash: depositHash });

      toast.success('Deposit successful!');
      return depositHash;
    } catch (err) {
      console.error('Error depositing:', err);
      setError(err as Error);
      toast.error('Deposit failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [lendingPoolContract, usdcContract, usdcBalance, address, isBalanceLoading, isBalanceError, balanceError, walletClient, publicClient]);

  const withdraw = useCallback(async (amount: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!lendingPoolContract || !lendingPoolContract.address || !lendingPoolContract.abi) {
        throw new Error('Lending pool contract not available.');
      }

      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet client, address, or public client not available.');
      }

      const parsedAmount = parseUnits(amount, 6); // USDC has 6 decimals

      const { request } = await publicClient.simulateContract({
        account: address,
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'withdraw',
        args: [parsedAmount],
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success('Withdrawal successful!');
      return hash;
    } catch (err) {
      console.error('Error withdrawing:', err);
      setError(err as Error);
      toast.error('Withdrawal failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [lendingPoolContract, walletClient, publicClient, address]);

  const borrow = useCallback(async (tokenId: string, amount: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!lendingPoolContract || !lendingPoolContract.address || !lendingPoolContract.abi) {
        throw new Error('Lending pool contract not available.');
      }

      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet client, address, or public client not available.');
      }

      // Amount is already in USDC decimals (6)
      const parsedAmount = BigInt(amount);

      const { request } = await publicClient.simulateContract({
        account: address,
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'depositInvoiceAndBorrow',
        args: [BigInt(tokenId), parsedAmount],
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success('Borrow successful!');
      return hash;
    } catch (err) {
      console.error('Error borrowing:', err);
      
      // Handle different types of errors
      let errorMessage = 'Borrow failed. Please try again.';
      
      if (err instanceof Error) {
        // Check if it's a contract revert with custom error
        if (err.message.includes('0x177e802f')) {
          errorMessage = 'Borrow amount exceeds maximum allowed or invoice is not eligible for borrowing.';
        } else if (err.message.includes('InvalidBorrowAmount')) {
          errorMessage = 'Borrow amount exceeds maximum allowed for this invoice.';
        } else if (err.message.includes('InvoiceNotVerified')) {
          errorMessage = 'Invoice must be verified before borrowing.';
        } else if (err.message.includes('LoanAlreadyExists')) {
          errorMessage = 'A loan already exists for this invoice.';
        } else if (err.message.includes('InvoiceExpired')) {
          errorMessage = 'Invoice has expired and cannot be used for borrowing.';
        } else if (err.message.includes('NotInvoiceSupplier')) {
          errorMessage = 'You are not the supplier of this invoice.';
        } else if (err.message.includes('NoStakedTokensFound')) {
          errorMessage = 'You must have staked tokens to borrow.';
        } else if (err.message.includes('InsufficientLiquidity')) {
          errorMessage = 'Insufficient liquidity in the lending pool.';
        } else {
          // Try to extract a more specific error message
          const errorMatch = err.message.match(/reverted with reason string: (.+)/);
          if (errorMatch) {
            errorMessage = errorMatch[1];
          }
        }
      }
      
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [lendingPoolContract, walletClient, publicClient, address]);

  const getUserActiveLoans = useCallback(async (userAddress: Address) => {
    if (!publicClient || !lendingPoolContract.address || !lendingPoolContract.abi) {
      console.log('getUserActiveLoans: Missing publicClient or contract details.');
      return [];
    }
    try {
      console.log('getUserActiveLoans: Fetching active loans for', userAddress);
      const loanIds = await publicClient.readContract({
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'getUserActiveLoans',
        args: [userAddress],
      }) as bigint[];
      console.log('getUserActiveLoans: Raw loan IDs from contract:', loanIds);
      return loanIds.map(id => id.toString());
    } catch (err) {
      console.error('Error getting user active loans:', err);
      return [];
    }
  }, [publicClient, lendingPoolContract.address, lendingPoolContract.abi]);

  const getUserLoanDetails = useCallback(async (userAddress: Address, tokenId: string) => {
    if (!publicClient || !lendingPoolContract.address || !lendingPoolContract.abi) {
      console.log('getUserLoanDetails: Missing publicClient or contract details.');
      return null;
    }
    try {
      console.log('getUserLoanDetails: Fetching details for user', userAddress, 'and token', tokenId);
      const details = await publicClient.readContract({
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'getUserLoanDetails',
        args: [userAddress, BigInt(tokenId)],
      }) as any;

      console.log('getUserLoanDetails: Raw details from contract:', details);
      console.log('getUserLoanDetails: Raw amount:', details[0] ? details[0].toString() : 'undefined');
      console.log('getUserLoanDetails: Raw interestAccrued:', details[4] ? details[4].toString() : 'undefined');
      console.log('getUserLoanDetails: Raw dueDate:', details[1] ? details[1].toString() : 'undefined');

      // Add a check for essential properties by index before formatting
      if (!details || typeof details[0] === 'undefined' || typeof details[4] === 'undefined' || typeof details[1] === 'undefined') {
        console.error('getUserLoanDetails: Missing essential loan details properties from contract response:', details);
        return null;
      }

      return {
        amount: formatAmount(details[0], 6),
        dueDate: new Date(Number(details[1]) * 1000),
        isRepaid: details[2],
        isLiquidated: details[3],
        interestAccrued: formatAmount(details[4], 6),
      };
    } catch (err: any) {
      // Only log unexpected errors, not 'Loan not found or not active'
      if (!err?.message?.includes('Loan not found or not active')) {
        console.error('Error getting user loan details:', err);
      }
      return null;
    }
  }, [publicClient, lendingPoolContract.address, lendingPoolContract.abi]);

  const repay = useCallback(async (tokenId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!lendingPoolContract || !lendingPoolContract.address || !lendingPoolContract.abi) {
        throw new Error('Lending pool contract not available.');
      }

      if (!usdcContract || !usdcContract.address || !usdcContract.abi) {
        throw new Error('USDC contract not available.');
      }

      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet client, address, or public client not available.');
      }

      const loanDetails = await getUserLoanDetails(address, tokenId);
      if (!loanDetails) {
        throw new Error('Loan details not found for this invoice.');
      }

      const buffer = parseUnits('1', 6); // 1 USDC
      const totalAmountDue = parseUnits((parseFloat(loanDetails.amount) + parseFloat(loanDetails.interestAccrued)).toFixed(6), 6) + buffer; // Convert to BigInt with 6 decimals

      // First approve the lending pool to spend USDC for repayment
      const { request: approveRequest } = await publicClient.simulateContract({
        account: address,
        address: usdcContract.address,
        abi: usdcContract.abi,
        functionName: 'approve',
        args: [lendingPoolContract.address, totalAmountDue],
      });

      const approveHash = await walletClient.writeContract(approveRequest);
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      // Then repay in LendingPool
      const { request: repayRequest } = await publicClient.simulateContract({
        account: address,
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'repay',
        args: [BigInt(tokenId)],
      });

      const repayHash = await walletClient.writeContract(repayRequest);
      await publicClient.waitForTransactionReceipt({ hash: repayHash });

      toast.success('Repayment successful!');
      return repayHash;
    } catch (err) {
      console.error('Error repaying:', err);
      setError(err as Error);
      toast.error('Repayment failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [lendingPoolContract, usdcContract, walletClient, publicClient, address, getUserLoanDetails]);

  const getMaxBorrowAmount = async (tokenId: string): Promise<string> => {
    if (!lendingPoolContract || !lendingPoolContract.address || !lendingPoolContract.abi) {
      throw new Error('Lending pool contract not available.');
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await publicClient?.readContract({
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'getMaxBorrowAmount',
        args: [tokenId],
      });
      setIsLoading(false);
      // Return the raw value as a string (in 1e6 units for USDC)
      return (data as bigint).toString();
    } catch (err) {
      console.error('Error fetching max borrow amount:', err);
      setError(err as Error);
      throw err;
    }
  };

  const withdrawInterest = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet client, address, or public client not available.');
      }

      const { request } = await publicClient.simulateContract({
        account: address,
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'withdrawInterest',
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      return hash;
    } catch (err) {
      console.error('Error withdrawing interest:', err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, address, publicClient, lendingPoolContract.address, lendingPoolContract.abi]);

  const getLPInterest = useCallback(async (userAddress: Address) => {
    try {
      if (!publicClient || !lendingPoolContract.address || !lendingPoolContract.abi) {
        return BigInt(0);
      }

      const interest = await publicClient.readContract({
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'getLPInterest',
        args: [userAddress],
      }) as bigint;

      return interest;
    } catch (err) {
      console.error('Error getting LP interest:', err);
      return BigInt(0);
    }
  }, [publicClient, lendingPoolContract.address, lendingPoolContract.abi]);

  const getUserLoans = useCallback(async (userAddress: Address) => {
    if (!publicClient || !lendingPoolContract.address || !lendingPoolContract.abi) {
      return [];
    }
    try {
      const loanIds = await publicClient.readContract({
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'getUserLoans',
        args: [userAddress],
      }) as bigint[];
      return loanIds.map(id => id.toString());
    } catch (err) {
      console.error('Error getting user loans:', err);
      return [];
    }
  }, [publicClient, lendingPoolContract.address, lendingPoolContract.abi]);

  return {
    isLoading: isLoading || isBalanceLoading,
    error,
    borrowedAmount,
    availableLiquidity,
    deposit,
    withdraw,
    borrow,
    repay,
    usdcBalance: usdcBalance && typeof usdcBalance === 'bigint' ? formatAmount(usdcBalance, 6) : '0',
    getMaxBorrowAmount,
    withdrawInterest,
    getLPInterest,
    getUserActiveLoans,
    getUserLoanDetails,
    getUserLoans,
  };
} 