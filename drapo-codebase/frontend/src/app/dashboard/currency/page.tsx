"use client";

import Link from "next/link";

export default function CurrencyDashboard() {
  const reserveData = {
    btcReserves: 1000.1234,
    stablecoinSupply: 800.0,
    pegStatus: "1 BhutanBTC ≈ 1 USD (Peg Stable)",
    reserveRatio: 125.0, // 125% backing
    lastUpdated: "2024-01-15 14:30 UTC",
  };

  const treasuryData = {
    multiSigAddresses: [
      "0x1234...5678 (Government)",
      "0xabcd...efgh (Central Bank)",
      "0x9876...5432 (Audit Committee)",
    ],
    requiredSignatures: 2,
    totalSignatures: 3,
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          💰 Bitcoin-Backed Currency System
        </h1>
        <p className="mt-2 text-gray-600">
          Transparent, auditable, and sovereign digital currency backed by
          Bhutan&apos;s Bitcoin reserves
        </p>
      </div>

      {/* Reserve Overview */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">BTC Reserves</p>
              <p className="text-2xl font-bold">
                {reserveData.btcReserves.toFixed(4)} BTC
              </p>
            </div>
            <div className="text-3xl">₿</div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Stablecoin Supply</p>
              <p className="text-2xl font-bold">
                ${reserveData.stablecoinSupply.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">💎</div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Reserve Ratio</p>
              <p className="text-2xl font-bold">{reserveData.reserveRatio}%</p>
            </div>
            <div className="text-3xl">🛡️</div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Peg Status</p>
              <p className="text-lg font-bold">Stable</p>
            </div>
            <div className="text-3xl">⚖️</div>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Reserve Dashboard */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center">
            <div className="mr-3 text-2xl">📊</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Reserve Dashboard
              </h3>
              <p className="text-sm text-gray-600">
                Real-time reserve monitoring
              </p>
            </div>
          </div>
          <div className="mb-4 space-y-3">
            <div className="flex justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Peg Status:</span>
              <span className="font-semibold text-green-600">
                {reserveData.pegStatus}
              </span>
            </div>
            <div className="flex justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Last Updated:</span>
              <span className="text-gray-600">{reserveData.lastUpdated}</span>
            </div>
            <div className="flex justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Merkle Root:</span>
              <span className="font-mono text-sm text-gray-600">
                0xabc123...
              </span>
            </div>
          </div>
          <Link
            href="/dashboard/currency/reserves"
            className="block w-full rounded bg-blue-600 py-2 text-center text-white hover:bg-blue-700"
          >
            View Detailed Reserves
          </Link>
        </div>

        {/* Multi-sig Treasury */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center">
            <div className="mr-3 text-2xl">🔐</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Multi-sig Treasury
              </h3>
              <p className="text-sm text-gray-600">Secure reserve management</p>
            </div>
          </div>
          <div className="mb-4 space-y-3">
            <div className="flex justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Signatures Required:</span>
              <span className="font-semibold text-blue-600">
                {treasuryData.requiredSignatures}/{treasuryData.totalSignatures}
              </span>
            </div>
            <div className="rounded bg-gray-50 p-3">
              <p className="mb-2 font-medium">Key Holders:</p>
              <ul className="space-y-1 text-sm text-gray-600">
                {treasuryData.multiSigAddresses.map((address, idx) => (
                  <li key={idx} className="font-mono">
                    {address}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Link
            href="/dashboard/currency/treasury"
            className="block w-full rounded bg-green-600 py-2 text-center text-white hover:bg-green-700"
          >
            Manage Treasury
          </Link>
        </div>

        {/* Stablecoin Management */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center">
            <div className="mr-3 text-2xl">💎</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Stablecoin Management
              </h3>
              <p className="text-sm text-gray-600">
                Mint, burn, and peg operations
              </p>
            </div>
          </div>
          <div className="mb-4 space-y-3">
            <div className="flex justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Circulating Supply:</span>
              <span className="font-semibold text-purple-600">
                ${reserveData.stablecoinSupply.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Exchange Rate:</span>
              <span className="font-semibold text-green-600">
                1 BhutanBTC = $1.00 USD
              </span>
            </div>
            <div className="flex justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">24h Volume:</span>
              <span className="font-semibold text-blue-600">$45,678</span>
            </div>
          </div>
          <Link
            href="/dashboard/currency/stablecoin"
            className="block w-full rounded bg-purple-600 py-2 text-center text-white hover:bg-purple-700"
          >
            Manage Stablecoin
          </Link>
        </div>

        {/* Peg Management */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center">
            <div className="mr-3 text-2xl">⚖️</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Peg Management
              </h3>
              <p className="text-sm text-gray-600">Maintain 1:1 USD peg</p>
            </div>
          </div>
          <div className="mb-4 space-y-3">
            <div className="flex justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Current Peg:</span>
              <span className="font-semibold text-green-600">$1.0000</span>
            </div>
            <div className="flex justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Deviation:</span>
              <span className="font-semibold text-green-600">0.00%</span>
            </div>
            <div className="flex justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Oracle Status:</span>
              <span className="font-semibold text-green-600">Active</span>
            </div>
          </div>
          <Link
            href="/dashboard/currency/peg"
            className="block w-full rounded bg-orange-600 py-2 text-center text-white hover:bg-orange-700"
          >
            Monitor Peg
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <button className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-left hover:bg-blue-100">
            <div className="mb-2 text-2xl">📈</div>
            <p className="font-medium text-blue-800">View Price Chart</p>
            <p className="text-sm text-blue-600">Historical peg performance</p>
          </button>

          <button className="rounded-lg border border-green-200 bg-green-50 p-4 text-left hover:bg-green-100">
            <div className="mb-2 text-2xl">📋</div>
            <p className="font-medium text-green-800">Audit Report</p>
            <p className="text-sm text-green-600">Latest reserve audit</p>
          </button>

          <button className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-left hover:bg-purple-100">
            <div className="mb-2 text-2xl">🔗</div>
            <p className="font-medium text-purple-800">Blockchain Explorer</p>
            <p className="text-sm text-purple-600">View on-chain data</p>
          </button>
        </div>
      </div>
    </div>
  );
}
