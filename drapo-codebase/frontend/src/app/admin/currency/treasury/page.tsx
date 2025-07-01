"use client";
export default function AdminCurrencyTreasuryPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Treasury Management</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded bg-blue-50 p-4 text-center">
          <div className="text-lg font-semibold">Treasury Balance</div>
          <div className="text-2xl font-bold text-blue-700">2,000,000 BTN</div>
        </div>
        <div className="rounded bg-green-50 p-4 text-center">
          <div className="text-lg font-semibold">Pending Payouts</div>
          <div className="text-2xl font-bold text-green-700">150,000 BTN</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">Recent Transactions</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">2025-06-29</td>
              <td className="p-2">Deposit</td>
              <td className="p-2">+100,000 BTN</td>
            </tr>
            <tr>
              <td className="p-2">2025-06-28</td>
              <td className="p-2">Payout</td>
              <td className="p-2">-50,000 BTN</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
