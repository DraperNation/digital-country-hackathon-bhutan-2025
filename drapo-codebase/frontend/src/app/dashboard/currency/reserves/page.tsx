"use client";

export default function ReservesPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        📊 Reserve Dashboard
      </h1>
      <p className="mb-8 text-gray-600">
        Real-time monitoring of Bhutan&apos;s Bitcoin reserves and stablecoin
        backing.
      </p>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-yellow-800">
          🚧 Under Development
        </h2>
        <p className="text-yellow-700">
          This page will show detailed reserve analytics, Merkle proofs, and
          real-time Bitcoin reserve monitoring for the BhutanBTC stablecoin
          system.
        </p>
      </div>
    </div>
  );
}
