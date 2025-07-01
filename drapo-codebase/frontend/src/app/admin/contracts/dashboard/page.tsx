"use client";
export default function AdminContractsDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Contract Dashboard</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded bg-blue-50 p-4 text-center">
          <div className="text-lg font-semibold">Active Contracts</div>
          <div className="text-2xl font-bold text-blue-700">32</div>
        </div>
        <div className="rounded bg-green-50 p-4 text-center">
          <div className="text-lg font-semibold">Pending Review</div>
          <div className="text-2xl font-bold text-green-700">5</div>
        </div>
        <div className="rounded bg-yellow-50 p-4 text-center">
          <div className="text-lg font-semibold">Expired</div>
          <div className="text-2xl font-bold text-yellow-700">2</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">Contracts (Mock Table)</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Contract</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Owner</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Gov Service</td>
              <td className="p-2">Active</td>
              <td className="p-2">Kiran S.</td>
            </tr>
            <tr>
              <td className="p-2">Attestation</td>
              <td className="p-2">Pending</td>
              <td className="p-2">Tashi D.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
