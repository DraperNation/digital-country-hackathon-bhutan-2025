import { create } from "zustand";
import {
  getWallet,
  createWallet as apiCreateWallet,
  deposit as apiDeposit,
  withdraw as apiWithdraw,
} from "@/services/wallet";

interface WalletState {
  address: string;
  balance: number;
  fetchWallet: () => Promise<void>;
  createWallet: () => Promise<void>;
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  address: "",
  balance: 0,
  fetchWallet: async () => {
    const data = await getWallet();
    set({ address: data.address, balance: data.balance });
  },
  createWallet: async () => {
    const data = await apiCreateWallet();
    set({ address: data.address, balance: data.balance });
  },
  deposit: async (amount: number) => {
    await apiDeposit(amount);
    set((state) => ({ balance: state.balance + amount }));
  },
  withdraw: async (amount: number) => {
    await apiWithdraw(amount);
    set((state) => ({ balance: Math.max(0, state.balance - amount) }));
  },
}));
