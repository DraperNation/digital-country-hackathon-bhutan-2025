"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/services/wallet";
import { ClockIcon } from "@heroicons/react/24/outline";

const TransactionHistory = () => {
  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    refetchOnWindowFocus: false,
  });
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
      <div className="mb-2 flex items-center gap-2">
        <ClockIcon className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
      </div>
      <ul className="divide-y divide-gray-100">
        {transactions.map((tx: any, idx: number) => (
          <li
            key={idx}
            className="flex items-center justify-between py-2 text-sm"
          >
            <span className="text-gray-700">
              Sent{" "}
              <span className="font-semibold text-blue-500">
                {tx.amount} BhutanBTC
              </span>{" "}
              to <span className="font-mono text-gray-500">{tx.to}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;
