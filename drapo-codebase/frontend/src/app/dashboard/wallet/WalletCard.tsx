"use client";
import { useWalletStore } from "@/store/wallet";
import { useQuery } from "@tanstack/react-query";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const WalletCard = () => {
  const { address, balance, fetchWallet, createWallet, deposit, withdraw } =
    useWalletStore();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  useQuery({
    queryKey: ["wallet"],
    queryFn: fetchWallet,
    refetchOnWindowFocus: false,
  });

  const handleCreateWallet = async () => {
    setLoading(true);
    await createWallet();
    setLoading(false);
  };

  const handleDeposit = async () => {
    if (amount > 0) {
      setLoading(true);
      await deposit(amount);
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (amount > 0 && amount <= balance) {
      setLoading(true);
      await withdraw(amount);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <BanknotesIcon className="h-8 w-8 text-blue-500" />
        </div>
        <div>
          <div className="text-xs font-medium text-gray-500">
            Wallet Balance
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {balance}{" "}
            <span className="text-base font-medium text-blue-500">
              BhutanBTC
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-400">{address}</div>
        </div>
      </div>
      {!address && (
        <button
          className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          onClick={handleCreateWallet}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Wallet"}
        </button>
      )}
      {address && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            min="0"
            className="w-24 rounded border px-2 py-1 text-sm"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={loading}
          />
          <button
            className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600 disabled:opacity-50"
            onClick={handleDeposit}
            disabled={loading || amount <= 0}
          >
            Deposit
          </button>
          <button
            className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 disabled:opacity-50"
            onClick={handleWithdraw}
            disabled={loading || amount <= 0 || amount > balance}
          >
            Withdraw
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletCard;
