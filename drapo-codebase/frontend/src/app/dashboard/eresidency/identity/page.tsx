import React from "react";

const EResidencyIdentityPage = () => {
  const identityServices = [
    {
      title: "Digital ID Card",
      description: "Apply for digital identity card",
      icon: "🆔",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
    },
    {
      title: "Biometric Update",
      description: "Update biometric information",
      icon: "👁️",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
    },
    {
      title: "Identity Verification",
      description: "Verify your identity status",
      icon: "✅",
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-700",
    },
    {
      title: "Document Upload",
      description: "Upload identity documents",
      icon: "📤",
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-700",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          eResidency Identity
        </h1>
        <p className="text-gray-600">
          Manage your digital identity and eResidency credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Identity Services</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {identityServices.map((service, index) => (
                <div
                  key={index}
                  className={`rounded-lg border-2 p-4 ${service.color} cursor-pointer transition-all duration-200 hover:shadow-lg`}
                >
                  <div className="mb-3 text-2xl">{service.icon}</div>
                  <h3 className={`mb-2 font-semibold ${service.textColor}`}>
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">
              Identity Verification
            </h3>
            <form className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Verification Type
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                  <option>Select verification type</option>
                  <option>Face Recognition</option>
                  <option>Fingerprint Scan</option>
                  <option>Document Verification</option>
                  <option>Two-Factor Authentication</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Additional Information
                </label>
                <textarea
                  placeholder="Any additional information for verification..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Start Verification
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Identity Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Digital ID Card</p>
                  <p className="text-sm text-gray-500">
                    Issued on Dec 10, 2024
                  </p>
                </div>
                <span className="text-sm font-medium text-green-600">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Biometric Data</p>
                  <p className="text-sm text-gray-500">
                    Last updated: Dec 5, 2024
                  </p>
                </div>
                <span className="text-sm font-medium text-green-600">
                  Valid
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Identity Verification</p>
                  <p className="text-sm text-gray-500">Level 2 verified</p>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  Verified
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-900">
              Identity Features
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Secure digital identity</p>
              <p>• Multi-factor authentication</p>
              <p>• Biometric verification</p>
              <p>• Blockchain-based security</p>
            </div>
          </div>

          <div className="rounded-lg bg-green-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-green-900">
              Security Benefits
            </h3>
            <div className="space-y-2 text-sm text-green-800">
              <p>• Fraud prevention</p>
              <p>• Identity theft protection</p>
              <p>• Secure transactions</p>
              <p>• Privacy protection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EResidencyIdentityPage;
