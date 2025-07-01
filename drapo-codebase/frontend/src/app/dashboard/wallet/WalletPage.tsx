"use client";
import React, { useState } from "react";
import WalletCard from "./WalletCard";
import TransactionForm from "./TransactionForm";
import TransactionHistory from "./TransactionHistory";
import ReserveDashboard from "./ReserveDashboard";

const tabStyles = (active: boolean) =>
  `px-6 py-2 font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none ${
    active
      ? "bg-gradient-to-tr from-blue-100 to-blue-50 text-blue-700 shadow"
      : "text-gray-500 hover:text-blue-600"
  }`;

const WalletPage = () => {
  const [tab, setTab] = useState<"wallet" | "reserves">("wallet");

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <div className="flex space-x-2 overflow-hidden rounded-t-2xl border-b border-gray-200 bg-white">
        <button
          className={tabStyles(tab === "wallet")}
          onClick={() => setTab("wallet")}
        >
          Wallet
        </button>
        <button
          className={tabStyles(tab === "reserves")}
          onClick={() => setTab("reserves")}
        >
          Reserves
        </button>
      </div>
      <div className="min-h-[400px] rounded-b-2xl bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg">
        {tab === "wallet" ? (
          <div className="space-y-6">
            <WalletCard />
            <TransactionForm />
            <TransactionHistory />
          </div>
        ) : (
          <ReserveDashboard />
        )}
      </div>
    </div>
  );
};

export default WalletPage;
