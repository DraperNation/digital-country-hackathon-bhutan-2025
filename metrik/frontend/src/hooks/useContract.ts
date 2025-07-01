import { contracts } from '@/lib/wagmi/config';

type ContractName = keyof typeof contracts;

export function useContract(contractName: ContractName) {
  const contract = contracts[contractName];

  return {
    contract,
  };
}

// Example usage:
// const stakingContract = useContract('STAKING');
// const lendingPoolContract = useContract('LENDING_POOL');
// const invoiceNFTContract = useContract('INVOICE_NFT');
// const feeManagerContract = useContract('FEE_MANAGER'); 