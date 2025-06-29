import { useState, useCallback, useEffect } from 'react';
import { useContract } from './useContract';
import { usePublicClient, useAccount, useWalletClient } from 'wagmi';
import { parseAmount, formatAmount } from '@/lib/utils/contracts';
import { type Address } from 'viem';
import { toast } from 'react-toastify';
import { useAnimatedValue } from './useAnimatedValue';

export interface Invoice {
  id: string;
  invoiceId: string;
  supplier: Address;
  buyer: Address;
  creditAmount: string;
  dueDate: Date;
  ipfsHash: string;
  gatewayUrl?: string;
  isVerified: boolean;
}

export interface RawInvoice {
  invoiceId: string;
  supplier: Address;
  buyer: Address;
  creditAmount: bigint;
  dueDate: bigint;
  ipfsHash: string;
  isVerified: boolean;
}

export interface InvoiceStats {
  totalInvoices: string;
  verifiedInvoices: string;
  pendingInvoices: string;
  totalValue: string;
}

export function useInvoice() {
  const { contract: invoiceNFTContract } = useContract('invoiceNFT');
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [userInvoices, setUserInvoices] = useState<Invoice[]>([]);
  const [invoiceStats, setInvoiceStats] = useState<InvoiceStats>({
    totalInvoices: '0',
    verifiedInvoices: '0',
    pendingInvoices: '0',
    totalValue: '0',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Animated values for smooth UI updates
  const animatedStats = {
    totalInvoices: useAnimatedValue(invoiceStats.totalInvoices, 800, 'ease-out'),
    verifiedInvoices: useAnimatedValue(invoiceStats.verifiedInvoices, 800, 'ease-out'),
    pendingInvoices: useAnimatedValue(invoiceStats.pendingInvoices, 800, 'ease-out'),
    totalValue: useAnimatedValue(invoiceStats.totalValue, 800, 'ease-out'),
  };

  const fetchAllInvoices = useCallback(async () => {
    if (!publicClient || !invoiceNFTContract.address || !invoiceNFTContract.abi) {
      setInvoices([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get total supply first
      const totalSupply = await publicClient.readContract({
        address: invoiceNFTContract.address,
        abi: invoiceNFTContract.abi,
        functionName: 'totalSupply',
      }) as bigint;

      const invoicePromises = [];
      let totalValue = 0n;
      let verifiedCount = 0;
      let pendingCount = 0;

      // Fetch all invoices
      for (let i = 0; i < Number(totalSupply); i++) {
        const tokenId = await publicClient.readContract({
          address: invoiceNFTContract.address,
          abi: invoiceNFTContract.abi,
          functionName: 'tokenByIndex',
          args: [i],
        }) as bigint;

        const invoiceDetails = await publicClient.readContract({
          address: invoiceNFTContract.address,
          abi: invoiceNFTContract.abi,
          functionName: 'getInvoiceDetails',
          args: [tokenId],
        }) as RawInvoice;

        if (invoiceDetails) {
          totalValue += invoiceDetails.creditAmount;
          if (invoiceDetails.isVerified) {
            verifiedCount++;
          } else {
            pendingCount++;
          }

          invoicePromises.push({
            id: tokenId.toString(),
            invoiceId: invoiceDetails.invoiceId,
            supplier: invoiceDetails.supplier,
            buyer: invoiceDetails.buyer,
            creditAmount: formatAmount(invoiceDetails.creditAmount),
            dueDate: new Date(Number(invoiceDetails.dueDate) * 1000),
            ipfsHash: invoiceDetails.ipfsHash,
            isVerified: invoiceDetails.isVerified
          });
        }
      }

      const formattedInvoices = await Promise.all(invoicePromises);
      setInvoices(formattedInvoices);

      // Update stats
      setInvoiceStats({
        totalInvoices: Number(totalSupply).toString(),
        verifiedInvoices: verifiedCount.toString(),
        pendingInvoices: pendingCount.toString(),
        totalValue: formatAmount(totalValue),
      });

      return formattedInvoices;
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err as Error);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, invoiceNFTContract.address, invoiceNFTContract.abi]);

  const fetchUserInvoices = useCallback(async (userAddress: Address) => {
    if (!publicClient || !invoiceNFTContract.address || !invoiceNFTContract.abi) {
      setUserInvoices([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get user's balance
      const balance = await publicClient.readContract({
        address: invoiceNFTContract.address,
        abi: invoiceNFTContract.abi,
        functionName: 'balanceOf',
        args: [userAddress],
      }) as bigint;

      const userInvoicePromises = [];

      // Fetch user's invoices
      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await publicClient.readContract({
          address: invoiceNFTContract.address,
          abi: invoiceNFTContract.abi,
          functionName: 'tokenOfOwnerByIndex',
          args: [userAddress, i],
        }) as bigint;

        const invoiceDetails = await publicClient.readContract({
          address: invoiceNFTContract.address,
          abi: invoiceNFTContract.abi,
          functionName: 'getInvoiceDetails',
          args: [tokenId],
        }) as RawInvoice;

        if (invoiceDetails) {
          userInvoicePromises.push({
            id: tokenId.toString(),
            invoiceId: invoiceDetails.invoiceId,
            supplier: invoiceDetails.supplier,
            buyer: invoiceDetails.buyer,
            creditAmount: formatAmount(invoiceDetails.creditAmount),
            dueDate: new Date(Number(invoiceDetails.dueDate) * 1000),
            ipfsHash: invoiceDetails.ipfsHash,
            isVerified: invoiceDetails.isVerified
          });
        }
      }

      const formattedUserInvoices = await Promise.all(userInvoicePromises);
      setUserInvoices(formattedUserInvoices);
      return formattedUserInvoices;
    } catch (err) {
      console.error('Error fetching user invoices:', err);
      setError(err as Error);
      setUserInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, invoiceNFTContract.address, invoiceNFTContract.abi]);

  const createInvoice = useCallback(async (
    creditAmount: string,
    dueDate: Date,
    buyer: Address,
    invoiceId: string,
    ipfsHash: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet client, address, or public client not available.');
      }

      const parsedAmount = parseAmount(creditAmount);
      const dueDateTimestamp = BigInt(Math.floor(dueDate.getTime() / 1000));

      const { request } = await publicClient.simulateContract({
        account: address,
        address: invoiceNFTContract.address,
        abi: invoiceNFTContract.abi,
        functionName: 'mintInvoiceNFT',
        args: [buyer, invoiceId, parsedAmount, dueDateTimestamp, ipfsHash],
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      // Refresh invoices list
      if (address) {
        await fetchUserInvoices(address);
        await fetchAllInvoices();
      }

      toast.success('Invoice created successfully!');
      return hash;
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError(err as Error);
      toast.error('Error creating invoice. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, address, publicClient, invoiceNFTContract.address, invoiceNFTContract.abi, fetchUserInvoices, fetchAllInvoices]);

  const getInvoiceDetails = useCallback(async (tokenId: string) => {
    try {
      if (!publicClient || !invoiceNFTContract.address || !invoiceNFTContract.abi) {
        return null;
      }

      const result = await publicClient.readContract({
        address: invoiceNFTContract.address,
        abi: invoiceNFTContract.abi,
        functionName: 'getInvoiceDetails',
        args: [tokenId],
      }) as RawInvoice;

      if (result) {
        return {
          id: tokenId,
          invoiceId: result.invoiceId,
          supplier: result.supplier,
          buyer: result.buyer,
          creditAmount: formatAmount(result.creditAmount),
          dueDate: new Date(Number(result.dueDate) * 1000),
          ipfsHash: result.ipfsHash,
          isVerified: result.isVerified
        };
      }
      return null;
    } catch (err) {
      console.error('Error getting invoice details:', err);
      throw err;
    }
  }, [publicClient, invoiceNFTContract.address, invoiceNFTContract.abi]);

  const checkVerificationStatus = useCallback(async (tokenId: string) => {
    try {
      if (!publicClient || !invoiceNFTContract.address || !invoiceNFTContract.abi) {
        return false;
      }

      const isVerified = await publicClient.readContract({
        address: invoiceNFTContract.address,
        abi: invoiceNFTContract.abi,
        functionName: 'isVerified',
        args: [tokenId],
      }) as boolean;

      return isVerified;
    } catch (err) {
      console.error('Error checking verification status:', err);
      throw err;
    }
  }, [publicClient, invoiceNFTContract.address, invoiceNFTContract.abi]);

  // Effect to fetch data on address change or periodically
  useEffect(() => {
    if (address) {
      fetchAllInvoices();
      fetchUserInvoices(address);

      const interval = setInterval(() => {
        fetchAllInvoices();
        fetchUserInvoices(address);
      }, 30000); // Refetch every 30 seconds

      return () => clearInterval(interval);
    }
  }, [address, fetchAllInvoices, fetchUserInvoices]);

  return {
    invoices,
    userInvoices,
    invoiceStats,
    isLoading,
    error,
    createInvoice,
    getInvoiceDetails,
    checkVerificationStatus,
    refetch: () => {
      if (address) {
        fetchAllInvoices();
        fetchUserInvoices(address);
      }
    },
    // Animated values for smooth UI updates
    animatedStats,
  };
} 