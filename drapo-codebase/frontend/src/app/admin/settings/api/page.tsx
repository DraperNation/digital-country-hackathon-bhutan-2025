"use client";
export default function AdminSettingsAPIPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">API Management</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded bg-blue-50 p-4 text-center">
          <div className="text-lg font-semibold">Active Keys</div>
          <div className="text-2xl font-bold text-blue-700">3</div>
        </div>
        <div className="rounded bg-yellow-50 p-4 text-center">
          <div className="text-lg font-semibold">Revoked Keys</div>
          <div className="text-2xl font-bold text-yellow-700">1</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">API Keys (Mock Table)</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Key</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">sk_live_1234</td>
              <td className="p-2">Active</td>
            </tr>
            <tr>
              <td className="p-2">sk_test_5678</td>
              <td className="p-2">Revoked</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
