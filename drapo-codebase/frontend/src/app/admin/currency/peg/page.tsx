"use client";
export default function AdminCurrencyPegPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Peg Monitoring</h1>
      <div className="mb-6">
        <div className="rounded bg-yellow-50 p-4 text-center">
          <div className="text-lg font-semibold">Current Peg</div>
          <div className="text-2xl font-bold text-yellow-700">1 BTN = 1 Nu</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">Peg Stability (Mock Chart)</div>
        <div className="flex h-32 items-center justify-center rounded bg-gray-100 text-gray-400">
          [Peg Chart Placeholder]
        </div>
      </div>
    </div>
  );
}
