"use client";
export default function AdminCurrencyStablecoinPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Stablecoin Control</h1>
      <div className="mb-6 flex gap-4">
        <button className="rounded bg-blue-600 px-4 py-2 text-white">
          Mint Stablecoin
        </button>
        <button className="rounded bg-red-600 px-4 py-2 text-white">
          Burn Stablecoin
        </button>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">Stablecoin Supply (Mock Chart)</div>
        <div className="flex h-32 items-center justify-center rounded bg-gray-100 text-gray-400">
          [Supply Chart Placeholder]
        </div>
      </div>
    </div>
  );
}
