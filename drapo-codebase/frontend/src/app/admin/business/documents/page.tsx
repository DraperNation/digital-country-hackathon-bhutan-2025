"use client";
export default function AdminBusinessDocumentsPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Document Verification</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded bg-blue-50 p-4 text-center">
          <div className="text-lg font-semibold">Documents Verified</div>
          <div className="text-2xl font-bold text-blue-700">300</div>
        </div>
        <div className="rounded bg-yellow-50 p-4 text-center">
          <div className="text-lg font-semibold">Pending Review</div>
          <div className="text-2xl font-bold text-yellow-700">7</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-2 font-semibold">Documents (Mock Table)</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Document</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">License.pdf</td>
              <td className="p-2">Verified</td>
            </tr>
            <tr>
              <td className="p-2">TaxReturn.pdf</td>
              <td className="p-2">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
