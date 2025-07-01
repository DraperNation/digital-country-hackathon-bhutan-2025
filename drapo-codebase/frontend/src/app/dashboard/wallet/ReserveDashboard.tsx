import React from "react";

const mockReserves = {
  btcReserves: 1000.1234,
  stablecoinSupply: 800.0,
  pegStatus: "1 BhutanBTC ≈ 1 USD (Peg Stable)",
  reserveProof: "Merkle root: 0xabc123...",
  pegProof: "Oracle signed: 1 BhutanBTC = 1 USD",
};

const ReserveDashboard = () => (
  <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-8 shadow-lg">
    <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-blue-700">
      <svg
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
        className="inline-block text-blue-400"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path
          d="M8 12h8M12 8v8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      Bhutan Bitcoin Reserves
    </h2>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col items-center rounded-xl bg-white p-4 shadow">
        <span className="text-sm text-gray-500">BTC Reserves</span>
        <span className="text-xl font-semibold text-blue-700">
          {mockReserves.btcReserves} BTC
        </span>
      </div>
      <div className="flex flex-col items-center rounded-xl bg-white p-4 shadow">
        <span className="text-sm text-gray-500">Stablecoin Supply</span>
        <span className="text-xl font-semibold text-blue-700">
          {mockReserves.stablecoinSupply} BhutanBTC
        </span>
      </div>
      <div className="col-span-1 flex flex-col items-center rounded-xl bg-white p-4 shadow sm:col-span-2">
        <span className="text-sm text-gray-500">Peg Status</span>
        <span className="text-lg font-medium text-green-600">
          {mockReserves.pegStatus}
        </span>
      </div>
    </div>
    <div className="mt-6 rounded-xl bg-blue-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-gray-700">
        <span className="font-semibold text-blue-600">Reserve Proof:</span>
        <span className="truncate">{mockReserves.reserveProof}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-700">
        <span className="font-semibold text-blue-600">Peg Proof:</span>
        <span className="truncate">{mockReserves.pegProof}</span>
      </div>
    </div>
  </div>
);

export default ReserveDashboard;
