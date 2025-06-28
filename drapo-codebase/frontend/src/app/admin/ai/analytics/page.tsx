"use client";
export default function AdminAIAnalyticsPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Query Analytics</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded bg-blue-50 p-4 text-center">
          <div className="text-lg font-semibold">Total Queries</div>
          <div className="text-2xl font-bold text-blue-700">5,000</div>
        </div>
        <div className="rounded bg-green-50 p-4 text-center">
          <div className="text-lg font-semibold">Success Rate</div>
          <div className="text-2xl font-bold text-green-700">99.2%</div>
        </div>
        <div className="rounded bg-yellow-50 p-4 text-center">
          <div className="text-lg font-semibold">Avg. Response</div>
          <div className="text-2xl font-bold text-yellow-700">110ms</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">Query Volume (Mock Chart)</div>
        <div className="flex h-32 items-center justify-center rounded bg-gray-100 text-gray-400">
          [Query Volume Chart Placeholder]
        </div>
      </div>
    </div>
  );
}
