import React from "react";

const ExchangePage = () => {
  const exchangeRates = [
    { from: "BTN", to: "USD", rate: 0.012, change: "+0.5%" },
    { from: "BTN", to: "BTC", rate: 0.0000004, change: "-1.2%" },
    { from: "USD", to: "BTN", rate: 83.5, change: "+0.3%" },
    { from: "BTC", to: "BTN", rate: 2500000, change: "+2.1%" },
  ];

  const recentExchanges = [
    {
      id: "EX001",
      from: "100 USD",
      to: "8,350 BTN",
      date: "Dec 15, 2024",
      status: "Completed",
    },
    {
      id: "EX002",
      from: "5,000 BTN",
      to: "60 USD",
      date: "Dec 14, 2024",
      status: "Completed",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Currency Exchange
        </h1>
        <p className="text-gray-600">
          Exchange between different currencies at competitive rates.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Exchange Currency</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  From
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                  <option>BTN (Bhutanese Ngultrum)</option>
                  <option>USD (US Dollar)</option>
                  <option>BTC (Bitcoin)</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  To
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                  <option>USD (US Dollar)</option>
                  <option>BTN (Bhutanese Ngultrum)</option>
                  <option>BTC (Bitcoin)</option>
                </select>
              </div>
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

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Exchange Rate</span>
                <span className="font-semibold">1 BTN = 0.012 USD</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  You&apos;ll Receive
                </span>
                <span className="font-semibold text-green-600">0.00 USD</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Exchange Now
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Current Rates</h3>
            <div className="space-y-3">
              {exchangeRates.map((rate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium">
                      {rate.from} → {rate.to}
                    </p>
                    <p className="text-sm text-gray-500">
                      Rate: {rate.rate.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      rate.change.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {rate.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Recent Exchanges</h3>
            <div className="space-y-3">
              {recentExchanges.map((exchange) => (
                <div
                  key={exchange.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium">
                      {exchange.from} → {exchange.to}
                    </p>
                    <p className="text-sm text-gray-500">{exchange.date}</p>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {exchange.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-900">
              Exchange Info
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Rates updated every 5 minutes</p>
              <p>• No hidden fees</p>
              <p>• Instant processing</p>
              <p>• 24/7 availability</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangePage;
