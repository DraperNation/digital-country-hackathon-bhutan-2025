"use client";
export default function AdminUsersKYCPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">KYC Approvals</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded bg-blue-50 p-4 text-center">
          <div className="text-lg font-semibold">Pending KYC</div>
          <div className="text-2xl font-bold text-blue-700">8</div>
        </div>
        <div className="rounded bg-green-50 p-4 text-center">
          <div className="text-lg font-semibold">Approved KYC</div>
          <div className="text-2xl font-bold text-green-700">900</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">KYC Review (Mock Table)</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Kiran S.</td>
              <td className="p-2">Pending</td>
              <td className="p-2">
                <button className="rounded bg-green-600 px-2 py-1 text-xs text-white">
                  Approve
                </button>
              </td>
            </tr>
            <tr>
              <td className="p-2">Tashi D.</td>
              <td className="p-2">Approved</td>
              <td className="p-2">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
