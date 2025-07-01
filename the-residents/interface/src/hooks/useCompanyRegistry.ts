'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import registryAbi from '@/abis/DrukCompanyRegistry.json';

// You'll need to update this with your deployed contract address
const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Mock address for testing - replace with real address after deployment

interface CompanyData {
  companyName: string;
  companyType: string;
  businessActivity: string;
  jurisdiction: string;
  virtualOfficeOptIn: boolean;
  owner: string;
  ownerDirector: string;
  coFounders: Array<{id: number, name: string, email: string}>;
  governanceModel: string;
  termsAccepted: boolean;
  bitcoinAddress: string;
  paymentConfirmed: boolean;
  registrationNumber?: string;
  taxId?: string;
  registrationDate?: string;
  status?: string;
}

interface RegistryResult {
  success: boolean;
  transactionHash?: string;
  blockchainHash?: string;
  explorerUrl?: string;
  error?: string;
}

export function useCompanyRegistry() {
  const { address, isConnected } = useAccount();
  const [isRegistering, setIsRegistering] = useState(false);

  const hashCompanyData = (companyData: CompanyData): string => {
    // Create a clean object for hashing (remove UI-specific fields)
    const dataToHash = {
      companyName: companyData.companyName,
      companyType: companyData.companyType,
      businessActivity: companyData.businessActivity,
      jurisdiction: companyData.jurisdiction,
      owner: companyData.owner,
      ownerDirector: companyData.ownerDirector,
      coFounders: companyData.coFounders,
      governanceModel: companyData.governanceModel,
      bitcoinAddress: companyData.bitcoinAddress,
      timestamp: Date.now()
    };

    // Convert to JSON string and hash
    const jsonString = JSON.stringify(dataToHash, null, 0);
    const hash = ethers.keccak256(ethers.toUtf8Bytes(jsonString));
    
    console.log('Company data to hash:', dataToHash);
    console.log('Generated hash:', hash);
    
    return hash;
  };

  const registerOnChain = async (companyData: CompanyData): Promise<RegistryResult> => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    if (CONTRACT_ADDRESS === '0x1234567890123456789012345678901234567890') {
      throw new Error('Contract address not set. Please deploy the contract first.');
    }

    setIsRegistering(true);
    
    try {
      // 1. Hash the company data
      const companyHash = hashCompanyData(companyData);

      // 2. Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // 3. Create contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, registryAbi, signer);

      // 4. Call the contract
      console.log('Calling contract with hash:', companyHash);
      const tx = await contract.registerEntity(companyHash);
      
      console.log('Transaction sent:', tx.hash);
      
      // 5. Wait for confirmation
      const receipt = await tx.wait();
      
      console.log('Transaction confirmed:', receipt);

      // 6. Create explorer URL
      const explorerUrl = `https://mumbai.polygonscan.com/tx/${receipt.hash}`;

      return {
        success: true,
        transactionHash: receipt.hash,
        blockchainHash: companyHash,
        explorerUrl
      };

    } catch (error) {
      console.error('Blockchain registration failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    registerOnChain,
    hashCompanyData,
    isRegistering,
    isConnected,
    address,
    contractAddress: CONTRACT_ADDRESS
  };
} 