import React from "react";

const BusinessDocumentsPage = () => {
  const businessDocuments = [
    {
      id: "BDOC001",
      title: "Business Registration Certificate",
      type: "Registration",
      status: "Active",
      issueDate: "Dec 10, 2024",
      expiryDate: "Dec 10, 2029",
    },
    {
      id: "BDOC002",
      title: "Tax Clearance Certificate",
      type: "Tax",
      status: "Valid",
      issueDate: "Dec 5, 2024",
      expiryDate: "Dec 5, 2025",
    },
    {
      id: "BDOC003",
      title: "Import License",
      type: "License",
      status: "Pending",
      issueDate: "Dec 12, 2024",
      expiryDate: "N/A",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Business Documents
        </h1>
        <p className="text-gray-600">
          Manage all your business-related documents and certificates.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Request Document</h2>
          <form className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Document Type
              </label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                <option>Select document type</option>
                <option>Business Registration</option>
                <option>Tax Clearance Certificate</option>
                <option>Import/Export License</option>
                <option>Building Permit</option>
                <option>Environmental Clearance</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Purpose
              </label>
              <textarea
                placeholder="Specify the purpose of this document request"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Urgency
              </label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                <option>Standard (5-7 days)</option>
                <option>Express (2-3 days)</option>
                <option>Urgent (1 day)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Submit Request
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Business Documents</h3>
            <div className="space-y-3">
              {businessDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-sm text-gray-500">
                      Issued: {doc.issueDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-medium ${
                        doc.status === "Active" || doc.status === "Valid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {doc.status}
                    </span>
                    <p className="text-sm text-gray-500">
                      Expires: {doc.expiryDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-900">
              Document Categories
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Registration Documents</p>
              <p>• Tax Certificates</p>
              <p>• Licenses & Permits</p>
              <p>• Compliance Documents</p>
              <p>• Financial Statements</p>
            </div>
          </div>

          <div className="rounded-lg bg-green-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-green-900">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full rounded-lg bg-white p-3 text-left text-sm transition-colors hover:bg-green-100">
                📄 Download All Documents
              </button>
              <button className="w-full rounded-lg bg-white p-3 text-left text-sm transition-colors hover:bg-green-100">
                📋 View Document History
              </button>
              <button className="w-full rounded-lg bg-white p-3 text-left text-sm transition-colors hover:bg-green-100">
                ⚙️ Document Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDocumentsPage;
