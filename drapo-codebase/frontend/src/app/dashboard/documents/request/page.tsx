import React from "react";

const RequestDocumentsPage = () => {
  const documentTypes = [
    {
      category: "Personal Documents",
      documents: [
        {
          name: "Birth Certificate",
          description: "Official birth registration certificate",
          processingTime: "3-5 days",
        },
        {
          name: "Death Certificate",
          description: "Official death registration certificate",
          processingTime: "2-3 days",
        },
        {
          name: "Marriage Certificate",
          description: "Official marriage registration certificate",
          processingTime: "5-7 days",
        },
        {
          name: "Divorce Certificate",
          description: "Official divorce registration certificate",
          processingTime: "5-7 days",
        },
      ],
    },
    {
      category: "Identity Documents",
      documents: [
        {
          name: "National ID Card",
          description: "Official national identification card",
          processingTime: "10-15 days",
        },
        {
          name: "Passport",
          description: "International travel passport",
          processingTime: "15-20 days",
        },
        {
          name: "Driver's License",
          description: "Official driving license",
          processingTime: "7-10 days",
        },
      ],
    },
    {
      category: "Property Documents",
      documents: [
        {
          name: "Land Registration",
          description: "Official land ownership certificate",
          processingTime: "10-15 days",
        },
        {
          name: "Property Tax Certificate",
          description: "Property tax clearance certificate",
          processingTime: "3-5 days",
        },
        {
          name: "Building Permit",
          description: "Official building construction permit",
          processingTime: "15-20 days",
        },
      ],
    },
    {
      category: "Business Documents",
      documents: [
        {
          name: "Business Registration",
          description: "Official business registration certificate",
          processingTime: "7-10 days",
        },
        {
          name: "Tax Clearance Certificate",
          description: "Business tax clearance certificate",
          processingTime: "5-7 days",
        },
        {
          name: "Import/Export License",
          description: "International trade license",
          processingTime: "10-15 days",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Request Documents
        </h1>
        <p className="text-gray-600">
          Request official government documents and certificates. Select the
          document type and provide required information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          {documentTypes.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="rounded-lg border bg-white p-6 shadow-sm"
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.documents.map((document, docIndex) => (
                  <div
                    key={docIndex}
                    className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {document.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {document.description}
                      </p>
                      <p className="mt-1 text-xs text-blue-600">
                        Processing time: {document.processingTime}
                      </p>
                    </div>
                    <button className="ml-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700">
                      Request
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Quick Request</h3>
            <form className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Document Type
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                  <option>Select a document type</option>
                  <option>Birth Certificate</option>
                  <option>National ID Card</option>
                  <option>Passport</option>
                  <option>Marriage Certificate</option>
                  <option>Business Registration</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Purpose
                </label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Please specify the purpose of this document request..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Urgency Level
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                  <option>Standard (Normal processing time)</option>
                  <option>Express (Additional fee applies)</option>
                  <option>Urgent (Additional fee applies)</option>
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

          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-900">
              Request Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Ensure all required supporting documents are uploaded</li>
              <li>• Provide accurate personal information</li>
              <li>• Processing times may vary based on document type</li>
              <li>• Express and urgent requests incur additional fees</li>
              <li>• You will be notified via email/SMS when ready</li>
            </ul>
          </div>

          <div className="rounded-lg bg-green-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-green-900">
              Recent Requests
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-900">
                    Birth Certificate
                  </p>
                  <p className="text-sm text-green-700">
                    Requested on Dec 10, 2024
                  </p>
                </div>
                <span className="text-sm font-medium text-green-600">
                  Processing
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-900">Tax Clearance</p>
                  <p className="text-sm text-green-700">
                    Requested on Dec 8, 2024
                  </p>
                </div>
                <span className="text-sm font-medium text-green-600">
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDocumentsPage;
