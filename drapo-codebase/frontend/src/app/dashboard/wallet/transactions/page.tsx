import React from "react";

const TransactionsPage = () => {
  const transactions = [
    {
      id: "TXN001",
      type: "Transfer",
      amount: 500,
      currency: "BTN",
      recipient: "John Doe",
      date: "Dec 15, 2024",
      status: "Completed",
      description: "Payment for services",
    },
    {
      id: "TXN002",
      type: "Payment",
      amount: -1200,
      currency: "BTN",
      recipient: "Business Corp",
      date: "Dec 14, 2024",
      status: "Completed",
      description: "Invoice payment",
    },
    {
      id: "TXN003",
      type: "Exchange",
      amount: 100,
      currency: "USD",
      recipient: "Currency Exchange",
      date: "Dec 13, 2024",
      status: "Completed",
      description: "USD to BTN exchange",
    },
    {
      id: "TXN004",
      type: "Deposit",
      amount: 5000,
      currency: "BTN",
      recipient: "Bank Transfer",
      date: "Dec 12, 2024",
      status: "Completed",
      description: "Salary deposit",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Transaction History
        </h1>
        <p className="text-gray-600">
          View all your wallet transactions and payment history.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="border-b p-6">
              <h2 className="text-xl font-semibold">All Transactions</h2>
              <p className="mt-1 text-sm text-gray-600">
                Showing {transactions.length} transactions
              </p>
            </div>
            <div className="divide-y">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="p-6 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">
                          {txn.type}
                        </h3>
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            txn.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {txn.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{txn.description}</p>
                      <p className="text-sm text-gray-500">
                        To: {txn.recipient} • {txn.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          txn.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {txn.amount > 0 ? "+" : ""}
                        {txn.amount} {txn.currency}
                      </p>
                      <p className="text-sm text-gray-500">#{txn.id}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Transaction Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Total Transactions
                </span>
                <span className="font-semibold">{transactions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Incoming</span>
                <span className="font-semibold text-green-600">5,500 BTN</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Outgoing</span>
                <span className="font-semibold text-red-600">1,200 BTN</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Net Balance</span>
                <span className="font-semibold text-blue-600">4,300 BTN</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-900">
              Filter Options
            </h3>
            <div className="space-y-3">
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                <option>All Types</option>
                <option>Transfer</option>
                <option>Payment</option>
                <option>Exchange</option>
                <option>Deposit</option>
              </select>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                <option>All Currencies</option>
                <option>BTN</option>
                <option>USD</option>
                <option>BTC</option>
              </select>
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                Apply Filters
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-green-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-green-900">
              Export Options
            </h3>
            <div className="space-y-2">
              <button className="w-full rounded-lg bg-white p-3 text-left text-sm transition-colors hover:bg-green-100">
                📄 Export as PDF
              </button>
              <button className="w-full rounded-lg bg-white p-3 text-left text-sm transition-colors hover:bg-green-100">
                📊 Export as CSV
              </button>
              <button className="w-full rounded-lg bg-white p-3 text-left text-sm transition-colors hover:bg-green-100">
                📧 Email Statement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
