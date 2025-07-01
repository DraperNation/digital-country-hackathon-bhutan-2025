"use client";
export default function AdminBusinessTaxPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Tax Management</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded bg-blue-50 p-4 text-center">
          <div className="text-lg font-semibold">Total Taxpayers</div>
          <div className="text-2xl font-bold text-blue-700">150</div>
        </div>
        <div className="rounded bg-green-50 p-4 text-center">
          <div className="text-lg font-semibold">Pending Returns</div>
          <div className="text-2xl font-bold text-green-700">10</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">Tax Records (Mock Table)</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Business</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Bhutan Tech</td>
              <td className="p-2">Filed</td>
            </tr>
            <tr>
              <td className="p-2">Green Energy</td>
              <td className="p-2">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
