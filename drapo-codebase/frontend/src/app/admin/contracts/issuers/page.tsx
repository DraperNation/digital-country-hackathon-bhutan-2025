"use client";
export default function AdminContractsIssuersPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Attestation Issuers</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded bg-blue-50 p-4 text-center">
          <div className="text-lg font-semibold">Total Issuers</div>
          <div className="text-2xl font-bold text-blue-700">10</div>
        </div>
        <div className="rounded bg-green-50 p-4 text-center">
          <div className="text-lg font-semibold">Active</div>
          <div className="text-2xl font-bold text-green-700">8</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">Issuers (Mock Table)</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Issuer</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Gov Agency</td>
              <td className="p-2">Active</td>
            </tr>
            <tr>
              <td className="p-2">Bank</td>
              <td className="p-2">Inactive</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
