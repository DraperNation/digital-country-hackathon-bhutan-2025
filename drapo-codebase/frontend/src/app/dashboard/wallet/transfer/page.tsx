"use client";
import React, { useEffect, useState } from "react";
import { useWalletStore } from "@/store/wallet";
import { sendTransaction, getTransactions } from "@/services/wallet";

const TransferPage = () => {
  const { address, balance, fetchWallet, createWallet } = useWalletStore();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("BTN");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchWallet();
    fetchRecentTransfers();
    // eslint-disable-next-line
  }, []);

  const fetchRecentTransfers = async () => {
    const txs = await getTransactions();
    setTransactions(txs);
  };

  const handleConnectWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      await createWallet();
      setMessage("Wallet connected!");
    } catch (e) {
      setError("Failed to connect wallet.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      if (!recipient || !amount)
        throw new Error("Recipient and amount required");
      const res = await sendTransaction({
        to: recipient,
        amount: Number(amount),
      });
      if (res.success) {
        setMessage("Transfer successful!");
        setRecipient("");
        setAmount("");
        setDescription("");
        fetchRecentTransfers();
        fetchWallet();
      } else {
        setError("Transfer failed.");
      }
    } catch (e: any) {
      setError(e.message || "Transfer failed.");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Transfer Funds
        </h1>
        <p className="text-gray-600">
          Transfer funds to other citizens or businesses securely.
        </p>
      </div>

      {/* Wallet connection UI */}
      <div className="mb-6 flex items-center gap-4">
        {address ? (
          <div className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-800">
            Wallet: <span className="font-mono">{address}</span> | Balance:{" "}
            {balance} BTN
          </div>
        ) : (
          <button
            onClick={handleConnectWallet}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>

      {message && (
        <div className="mb-4 rounded bg-green-100 px-4 py-2 text-green-800">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">New Transfer</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Recipient
              </label>
              <input
                type="text"
                placeholder="Enter recipient ID or address"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                disabled={loading}
              >
                <option value="BTN">BTN (Bhutanese Ngultrum)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="BTC">BTC (Bitcoin)</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                placeholder="Optional description for this transfer"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              disabled={loading || !address}
            >
              {loading ? "Processing..." : "Send Transfer"}
            </button>
          </form>
        </div>
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Recent Transfers</h3>
            <div className="space-y-3">
              {transactions.length === 0 && (
                <div className="text-gray-500">No recent transfers.</div>
              )}
              {transactions.map((tx, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium">{tx.to}</p>
                    <p className="text-sm text-gray-500">Transfer</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      +{tx.amount} BTN
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-900">
              Transfer Limits
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Daily limit: 50,000 BTN</p>
              <p>• Monthly limit: 500,000 BTN</p>
              <p>• International transfers require additional verification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
