import React from "react";

const TransferPage = () => {
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">New Transfer</h2>
          <form className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Recipient
              </label>
              <input
                type="text"
                placeholder="Enter recipient ID or email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
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
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                <option>BTN (Bhutanese Ngultrum)</option>
                <option>USD (US Dollar)</option>
                <option>BTC (Bitcoin)</option>
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
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Send Transfer
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Recent Transfers</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">Payment for services</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+500 BTN</p>
                  <p className="text-sm text-gray-500">Dec 15, 2024</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div>
                  <p className="font-medium">Business Corp</p>
                  <p className="text-sm text-gray-500">Invoice payment</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-1,200 BTN</p>
                  <p className="text-sm text-gray-500">Dec 14, 2024</p>
                </div>
              </div>
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
