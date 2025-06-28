import React from "react";

const ESignDocumentsPage = () => {
  const pendingDocuments = [
    {
      id: "DOC001",
      title: "Property Registration Agreement",
      type: "Legal Document",
      status: "Ready for Signature",
      priority: "High",
      dueDate: "Dec 20, 2024",
      description:
        "Official property registration agreement for land parcel #BT-2024-001",
    },
    {
      id: "DOC002",
      title: "Business License Application",
      type: "Application Form",
      status: "Pending Review",
      priority: "Medium",
      dueDate: "Dec 25, 2024",
      description: "Business license application for 'Bhutan Tech Solutions'",
    },
    {
      id: "DOC003",
      title: "Tax Declaration Form",
      type: "Tax Document",
      status: "Ready for Signature",
      priority: "High",
      dueDate: "Dec 18, 2024",
      description: "Annual tax declaration form for fiscal year 2024-2025",
    },
  ];

  const signedDocuments = [
    {
      id: "DOC004",
      title: "Birth Certificate Application",
      type: "Application Form",
      signedDate: "Dec 15, 2024",
      status: "Submitted",
    },
    {
      id: "DOC005",
      title: "Vehicle Registration",
      type: "Registration Form",
      signedDate: "Dec 12, 2024",
      status: "Approved",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          eSign Documents
        </h1>
        <p className="text-gray-600">
          Electronically sign official documents and government forms securely.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Pending Signatures</h2>
            <div className="space-y-4">
              {pendingDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                          {doc.type}
                        </span>
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            doc.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {doc.priority} Priority
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Due: {doc.dueDate}
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        {doc.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700">
                      Sign Document
                    </button>
                    <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50">
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Recently Signed</h2>
            <div className="space-y-3">
              {signedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{doc.title}</p>
                    <p className="text-sm text-gray-500">
                      Signed on {doc.signedDate}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">eSign Guidelines</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
                  1
                </span>
                <span>
                  Ensure you have read the entire document before signing
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
                  2
                </span>
                <span>Your digital signature is legally binding</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
                  3
                </span>
                <span>Keep a copy of signed documents for your records</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
                  4
                </span>
                <span>You can track the status of submitted documents</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-green-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-green-900">
              Digital Signature Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-800">
                  Signature Certificate
                </span>
                <span className="text-sm font-medium text-green-600">
                  Valid
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-800">Expiry Date</span>
                <span className="text-sm text-green-600">Dec 31, 2025</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-800">Documents Signed</span>
                <span className="text-sm text-green-600">24</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-900">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full rounded-lg bg-white p-3 text-left text-sm transition-colors hover:bg-blue-100">
                📄 Upload Document for Signature
              </button>
              <button className="w-full rounded-lg bg-white p-3 text-left text-sm transition-colors hover:bg-blue-100">
                📋 View Signature History
              </button>
              <button className="w-full rounded-lg bg-white p-3 text-left text-sm transition-colors hover:bg-blue-100">
                ⚙️ Signature Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESignDocumentsPage;
