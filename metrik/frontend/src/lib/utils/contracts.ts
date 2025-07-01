import { type Address, type Abi } from 'viem';
import { contracts } from '../wagmi/config';

export type ContractConfig = {
  address: Address;
  abi: Abi;
};

export function getContractConfig(name: keyof typeof contracts): ContractConfig {
  const contract = contracts[name];
  return {
    address: contract.address,
    abi: contract.abi,
  };
}

export function parseAmount(amount: string, decimals: number = 18): bigint {
  try {
    const [whole, fraction = ''] = amount.split('.');
    const paddedFraction = fraction.padEnd(decimals, '0');
    return BigInt(whole + paddedFraction);
  } catch (error) {
    console.error('Error parsing amount:', error);
    return BigInt(0);
  }
}

export function formatAmount(amount: bigint, decimals: number = 18): string {
  try {
    const amountStr = amount.toString().padStart(decimals + 1, '0');
    const whole = amountStr.slice(0, -decimals);
    const fraction = amountStr.slice(-decimals).replace(/0+$/, '');
    return fraction ? `${whole}.${fraction}` : whole;
  } catch (error) {
    console.error('Error formatting amount:', error);
    return '0';
  }
}

export function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) * 1000).toLocaleDateString();
}

export function formatDuration(seconds: bigint): string {
  const days = Number(seconds) / (24 * 60 * 60);
  return `${days.toFixed(0)} days`;
} 