import React from "react";

const IssuedDocumentsPage = () => {
  const issuedDocuments = [
    {
      id: "DOC001",
      title: "Birth Certificate",
      type: "Personal Document",
      issueDate: "Dec 15, 2024",
      expiryDate: "Lifetime",
      status: "Active",
      documentNumber: "BT-BC-2024-001234",
      category: "Personal & Family",
      description: "Official birth registration certificate",
    },
    {
      id: "DOC002",
      title: "National ID Card",
      type: "Identity Document",
      issueDate: "Nov 20, 2024",
      expiryDate: "Dec 20, 2034",
      status: "Active",
      documentNumber: "BT-NID-2024-567890",
      category: "Identity & Travel",
      description: "Official national identification card",
    },
    {
      id: "DOC003",
      title: "Business Registration Certificate",
      type: "Business Document",
      issueDate: "Oct 15, 2024",
      expiryDate: "Oct 15, 2029",
      status: "Active",
      documentNumber: "BT-BR-2024-789012",
      category: "Business & Commerce",
      description: "Official business registration certificate",
    },
    {
      id: "DOC004",
      title: "Land Registration Certificate",
      type: "Property Document",
      issueDate: "Sep 10, 2024",
      expiryDate: "Lifetime",
      status: "Active",
      documentNumber: "BT-LR-2024-345678",
      category: "Property & Land",
      description: "Official land ownership certificate",
    },
    {
      id: "DOC005",
      title: "Driver's License",
      type: "Identity Document",
      issueDate: "Aug 25, 2024",
      expiryDate: "Aug 25, 2034",
      status: "Active",
      documentNumber: "BT-DL-2024-901234",
      category: "Identity & Travel",
      description: "Official driving license",
    },
  ];

  const categories = [
    "All",
    "Personal & Family",
    "Identity & Travel",
    "Business & Commerce",
    "Property & Land",
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          My Issued Documents
        </h1>
        <p className="text-gray-600">
          View and manage all your officially issued documents and certificates.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                category === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="border-b p-6">
              <h2 className="text-xl font-semibold">All Documents</h2>
              <p className="mt-1 text-sm text-gray-600">
                Showing {issuedDocuments.length} documents
              </p>
            </div>
            <div className="divide-y">
              {issuedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-6 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">
                          {doc.title}
                        </h3>
                        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                          {doc.status}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-gray-600">
                        {doc.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">
                            Document Number:
                          </span>
                          <p className="font-medium">{doc.documentNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <p className="font-medium">{doc.category}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Issue Date:</span>
                          <p className="font-medium">{doc.issueDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Expiry Date:</span>
                          <p className="font-medium">{doc.expiryDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
                        Download
                      </button>
                      <button className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Document Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Documents</span>
                <span className="font-semibold">{issuedDocuments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Documents</span>
                <span className="font-semibold text-green-600">
                  {issuedDocuments.filter((d) => d.status === "Active").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expiring Soon</span>
                <span className="font-semibold text-yellow-600">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expired</span>
                <span className="font-semibold text-red-600">0</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-900">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full rounded-lg bg-white p-3 text-left text-sm transition-colors hover:bg-blue-100">
                📄 Download All Documents
              </button>
              <button className="w-full rounded-lg bg-white p-3 text-left text-sm transition-colors hover:bg-blue-100">
                🔍 Search Documents
              </button>
              <button className="w-full rounded-lg bg-white p-3 text-left text-sm transition-colors hover:bg-blue-100">
                📊 Document Analytics
              </button>
              <button className="w-full rounded-lg bg-white p-3 text-left text-sm transition-colors hover:bg-blue-100">
                ⚙️ Document Settings
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-yellow-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-yellow-900">
              Expiring Soon
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-yellow-900">
                    Driver&apos;s License
                  </p>
                  <p className="text-sm text-yellow-700">Expires in 9 years</p>
                </div>
                <span className="text-sm text-yellow-600">2024-08-25</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-yellow-900">
                    National ID Card
                  </p>
                  <p className="text-sm text-yellow-700">Expires in 9 years</p>
                </div>
                <span className="text-sm text-yellow-600">2024-11-20</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuedDocumentsPage;
