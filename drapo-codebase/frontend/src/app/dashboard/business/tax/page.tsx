import React from "react";

const BusinessTaxPage = () => {
  const taxReturns = [
    {
      id: "TAX001",
      period: "Q4 2024",
      dueDate: "Jan 31, 2025",
      status: "Pending",
      amount: 15000,
    },
    {
      id: "TAX002",
      period: "Q3 2024",
      dueDate: "Oct 31, 2024",
      status: "Filed",
      amount: 12000,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Business Tax Management
        </h1>
        <p className="text-gray-600">
          Manage your business tax returns and payments.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">File Tax Return</h2>
          <form className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tax Period
              </label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                <option>Select tax period</option>
                <option>Q4 2024</option>
                <option>Q3 2024</option>
                <option>Q2 2024</option>
                <option>Q1 2024</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Business Income
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Deductions
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taxable Income</span>
                <span className="font-semibold">0.00 BTN</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">Tax Amount</span>
                <span className="font-semibold text-red-600">0.00 BTN</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              File Return
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Tax Returns</h3>
            <div className="space-y-3">
              {taxReturns.map((tax) => (
                <div
                  key={tax.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium">{tax.period}</p>
                    <p className="text-sm text-gray-500">Due: {tax.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{tax.amount} BTN</p>
                    <span
                      className={`text-sm font-medium ${
                        tax.status === "Filed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {tax.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-900">
              Tax Deadlines
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Q4 2024: Jan 31, 2025</p>
              <p>• Q3 2024: Oct 31, 2024</p>
              <p>• Q2 2024: Jul 31, 2024</p>
              <p>• Q1 2024: Apr 30, 2024</p>
            </div>
          </div>

          <div className="rounded-lg bg-green-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-green-900">
              Tax Benefits
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Business expense deductions</li>
              <li>• Depreciation allowances</li>
              <li>• Investment incentives</li>
              <li>• Export benefits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessTaxPage;
