"use client";
export default function AdminUsersDIDPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">DID Verification</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded bg-blue-50 p-4 text-center">
          <div className="text-lg font-semibold">Pending DIDs</div>
          <div className="text-2xl font-bold text-blue-700">12</div>
        </div>
        <div className="rounded bg-green-50 p-4 text-center">
          <div className="text-lg font-semibold">Verified DIDs</div>
          <div className="text-2xl font-bold text-green-700">1,000</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">
          Verification Queue (Mock Table)
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">DID</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Kiran S.</td>
              <td className="p-2">did:ebhutan:123</td>
              <td className="p-2">Pending</td>
            </tr>
            <tr>
              <td className="p-2">Tashi D.</td>
              <td className="p-2">did:ebhutan:456</td>
              <td className="p-2">Verified</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
