"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendTransaction } from "@/services/wallet";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

const TransactionForm = () => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: sendTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setTo("");
      setAmount("");
    },
  });

  return (
    <form
      className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-md"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({ to, amount: Number(amount) });
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <PaperAirplaneIcon className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-bold text-gray-900">Send BhutanBTC</h2>
      </div>
      <input
        className="w-full rounded border border-gray-200 p-2 focus:border-blue-400 focus:outline-none"
        placeholder="Recipient Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        required
      />
      <input
        className="w-full rounded border border-gray-200 p-2 focus:border-blue-400 focus:outline-none"
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="0.0001"
        step="0.0001"
        required
      />
      <button
        className="rounded bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600"
        type="submit"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Sending..." : "Send"}
      </button>
      {mutation.isSuccess && (
        <div className="mt-2 text-xs text-green-600">Transaction sent!</div>
      )}
      {mutation.isError && (
        <div className="mt-2 text-xs text-red-600">
          Error sending transaction.
        </div>
      )}
    </form>
  );
};

export default TransactionForm;
