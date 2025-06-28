"use client";
export default function AdminAITrainingPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Training Data</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded bg-blue-50 p-4 text-center">
          <div className="text-lg font-semibold">Datasets</div>
          <div className="text-2xl font-bold text-blue-700">15</div>
        </div>
        <div className="rounded bg-green-50 p-4 text-center">
          <div className="text-lg font-semibold">Samples</div>
          <div className="text-2xl font-bold text-green-700">50,000</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">Datasets (Mock Table)</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Dataset</th>
              <th className="p-2 text-left">Samples</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Citizen Q&amp;A</td>
              <td className="p-2">10,000</td>
            </tr>
            <tr>
              <td className="p-2">Legal Docs</td>
              <td className="p-2">40,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
