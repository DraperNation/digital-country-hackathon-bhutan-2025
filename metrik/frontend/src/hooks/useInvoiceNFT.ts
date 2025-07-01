import { useState, useCallback, useEffect } from 'react';
import { useContract } from './useContract';
import { usePublicClient, useAccount, useWalletClient } from 'wagmi';
import { parseAmount, formatAmount } from '@/lib/utils/contracts';
import { type Address } from 'viem';
import { toast } from 'react-toastify';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/config';

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

interface RawInvoice {
  invoiceId: string;
  supplier: Address;
  buyer: Address;
  creditAmount: bigint;
  dueDate: bigint;
  ipfsHash: string;
  isVerified: boolean;
}

export function useInvoiceNFT() {
  const { contract: invoiceNFTContract } = useContract('invoiceNFT');
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInvoices = useCallback(async (userAddress: Address) => {
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
      return formattedInvoices;
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err as Error);
      throw err;
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
        await fetchInvoices(address);
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
  }, [walletClient, address, publicClient, invoiceNFTContract.address, invoiceNFTContract.abi, fetchInvoices]);

  const verifyInvoice = useCallback(async (tokenId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet client, address, or public client not available.');
      }

      const { request } = await publicClient.simulateContract({
        account: address,
        address: invoiceNFTContract.address,
        abi: invoiceNFTContract.abi,
        functionName: 'verifyInvoice',
        args: [tokenId],
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      // Refresh invoices list
      if (address) {
        await fetchInvoices(address);
      }

      toast.success('Invoice verified successfully!');
      return hash;
    } catch (err: any) {
      let shortMsg = 'Error verifying invoice. Please try again.';
      if (err && err.message && err.message.includes('Invoice already verified')) {
        shortMsg = 'Invoice is already verified.';
      }
      setError(new Error(shortMsg));
      toast.error(shortMsg);
      // Do not throw the full error to avoid UI breakage
    } finally {
      setIsLoading(false);
      // Always refresh invoices after any attempt
      if (address) {
        await fetchInvoices(address);
      }
    }
  }, [walletClient, address, publicClient, invoiceNFTContract.address, invoiceNFTContract.abi, fetchInvoices]);

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

  const hasVerifierRole = useCallback(async (userAddress: Address) => {
    try {
      if (!publicClient || !invoiceNFTContract.address || !invoiceNFTContract.abi) {
        return false;
      }

      const VERIFIER_ROLE = await publicClient.readContract({
        address: invoiceNFTContract.address,
        abi: invoiceNFTContract.abi,
        functionName: 'VERIFIER_ROLE',
      }) as string;

      const hasRole = await publicClient.readContract({
        address: invoiceNFTContract.address,
        abi: invoiceNFTContract.abi,
        functionName: 'hasRole',
        args: [VERIFIER_ROLE, userAddress],
      }) as boolean;

      return hasRole;
    } catch (err) {
      console.error('Error checking verifier role:', err);
      return false;
    }
  }, [publicClient, invoiceNFTContract.address, invoiceNFTContract.abi]);

  const approveInvoice = useCallback(async (tokenId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet client, address, or public client not available.');
      }

      const { request } = await publicClient.simulateContract({
        account: address,
        address: invoiceNFTContract.address,
        abi: invoiceNFTContract.abi,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.LENDING_POOL, tokenId],
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      return hash;
    } catch (err) {
      console.error('Error approving invoice:', err);
      setError(err as Error);
      toast.error('Error approving invoice. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, address, publicClient, invoiceNFTContract.address, invoiceNFTContract.abi]);

  const isInvoiceApproved = useCallback(async (tokenId: string) => {
    try {
      if (!publicClient || !invoiceNFTContract.address || !invoiceNFTContract.abi) {
        return false;
      }

      const approvedAddress = await publicClient.readContract({
        address: invoiceNFTContract.address,
        abi: invoiceNFTContract.abi,
        functionName: 'getApproved',
        args: [tokenId],
      }) as string;

      return approvedAddress.toLowerCase() === CONTRACT_ADDRESSES.LENDING_POOL?.toLowerCase();
    } catch (err) {
      console.error('Error checking invoice approval:', err);
      return false;
    }
  }, [publicClient, invoiceNFTContract.address, invoiceNFTContract.abi]);

  // Effect to fetch invoices when address changes
  useEffect(() => {
    if (address) {
      fetchInvoices(address);
    }
  }, [address, fetchInvoices]);

  return {
    isLoading,
    error,
    invoices,
    fetchInvoices,
    createInvoice,
    verifyInvoice,
    getInvoiceDetails,
    checkVerificationStatus,
    hasVerifierRole,
    approveInvoice,
    isInvoiceApproved,
  };
} 