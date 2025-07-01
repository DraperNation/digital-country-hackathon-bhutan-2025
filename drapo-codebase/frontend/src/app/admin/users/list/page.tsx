"use client";
export default function AdminUsersListPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">All Users</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded bg-blue-50 p-4 text-center">
          <div className="text-lg font-semibold">Total Users</div>
          <div className="text-2xl font-bold text-blue-700">1,234</div>
        </div>
        <div className="rounded bg-green-50 p-4 text-center">
          <div className="text-lg font-semibold">Active</div>
          <div className="text-2xl font-bold text-green-700">1,100</div>
        </div>
        <div className="rounded bg-yellow-50 p-4 text-center">
          <div className="text-lg font-semibold">Pending KYC</div>
          <div className="text-2xl font-bold text-yellow-700">45</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">User List (Mock Table)</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Kiran S.</td>
              <td className="p-2">kiran@example.com</td>
              <td className="p-2">Active</td>
            </tr>
            <tr>
              <td className="p-2">Tashi D.</td>
              <td className="p-2">tashi@example.com</td>
              <td className="p-2">Pending KYC</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
