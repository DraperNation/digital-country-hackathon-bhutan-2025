"use client";

import { useState } from "react";

export default function KYCVerificationPage() {
  const [kycData] = useState({
    status: "Completed",
    verificationDate: "2024-01-15",
    documents: 3,
    nextReview: "2025-01-15",
  });

  const [documents] = useState([
    {
      id: 1,
      type: "National ID",
      status: "verified",
      uploadedDate: "2024-01-10",
      expiryDate: "2029-01-10",
    },
    {
      id: 2,
      type: "Passport",
      status: "verified",
      uploadedDate: "2024-01-10",
      expiryDate: "2034-01-10",
    },
    {
      id: 3,
      type: "Proof of Address",
      status: "verified",
      uploadedDate: "2024-01-10",
      expiryDate: "2025-01-10",
    },
  ]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          🔍 KYC Verification
        </h1>
        <p className="mt-2 text-gray-600">
          Know Your Customer verification status and document management
        </p>
      </div>

      {/* KYC Status */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">KYC Status</p>
              <p className="text-lg font-bold">{kycData.status}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Documents</p>
              <p className="text-2xl font-bold">{kycData.documents}</p>
            </div>
            <div className="text-3xl">📄</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Verified Since</p>
              <p className="text-sm font-bold">{kycData.verificationDate}</p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Next Review</p>
              <p className="text-sm font-bold">{kycData.nextReview}</p>
            </div>
            <div className="text-3xl">🔄</div>
          </div>
        </div>
      </div>

      {/* Verification Documents */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Verification Documents
        </h2>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-center">
                <div className="mr-3 rounded-full bg-green-100 p-2 text-green-600">
                  ✓
                </div>
                <div>
                  <p className="font-medium text-gray-800">{doc.type}</p>
                  <p className="text-sm text-gray-600">
                    Uploaded: {doc.uploadedDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  {doc.status}
                </span>
                <span className="text-sm text-gray-500">
                  Expires: {doc.expiryDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KYC Benefits */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Benefits of KYC Verification
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 font-medium text-gray-800">For You</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Access to all government services
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Higher transaction limits
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Priority customer support
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Enhanced security protection
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-medium text-gray-800">For Businesses</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Faster business registration
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Access to government contracts
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Reduced compliance requirements
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Enhanced credibility
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
