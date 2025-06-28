"use client";
export default function AdminContractsTrustPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Trust Scores</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded bg-blue-50 p-4 text-center">
          <div className="text-lg font-semibold">Contracts with High Trust</div>
          <div className="text-2xl font-bold text-blue-700">20</div>
        </div>
        <div className="rounded bg-yellow-50 p-4 text-center">
          <div className="text-lg font-semibold">Flagged Contracts</div>
          <div className="text-2xl font-bold text-yellow-700">1</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">Trust Scores (Mock Table)</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Contract</th>
              <th className="p-2 text-left">Trust Score</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Gov Service</td>
              <td className="p-2">98</td>
              <td className="p-2">High</td>
            </tr>
            <tr>
              <td className="p-2">Attestation</td>
              <td className="p-2">45</td>
              <td className="p-2">Flagged</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
