"use client";
export default function AdminUsersAnalyticsPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">User Analytics</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded bg-blue-50 p-4 text-center">
          <div className="text-lg font-semibold">New Users (30d)</div>
          <div className="text-2xl font-bold text-blue-700">120</div>
        </div>
        <div className="rounded bg-green-50 p-4 text-center">
          <div className="text-lg font-semibold">Active Users</div>
          <div className="text-2xl font-bold text-green-700">1,100</div>
        </div>
        <div className="rounded bg-yellow-50 p-4 text-center">
          <div className="text-lg font-semibold">Churn Rate</div>
          <div className="text-2xl font-bold text-yellow-700">2.5%</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">User Growth (Mock Chart)</div>
        <div className="flex h-32 items-center justify-center rounded bg-gray-100 text-gray-400">
          [User Growth Chart Placeholder]
        </div>
      </div>
    </div>
  );
}
