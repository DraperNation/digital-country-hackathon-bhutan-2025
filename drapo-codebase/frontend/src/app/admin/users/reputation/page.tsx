"use client";
export default function AdminUsersReputationPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Reputation Management</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded bg-blue-50 p-4 text-center">
          <div className="text-lg font-semibold">
            Users with High Reputation
          </div>
          <div className="text-2xl font-bold text-blue-700">120</div>
        </div>
        <div className="rounded bg-yellow-50 p-4 text-center">
          <div className="text-lg font-semibold">Flagged Users</div>
          <div className="text-2xl font-bold text-yellow-700">3</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">User Reputation (Mock Table)</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Reputation</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Kiran S.</td>
              <td className="p-2">98</td>
              <td className="p-2">High</td>
            </tr>
            <tr>
              <td className="p-2">Tashi D.</td>
              <td className="p-2">45</td>
              <td className="p-2">Flagged</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
