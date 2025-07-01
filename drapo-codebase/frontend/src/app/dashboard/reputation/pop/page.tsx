"use client";

import { useState } from "react";

export default function ProofOfPersonhoodPage() {
  const [popData] = useState({
    status: "Verified",
    verificationDate: "2024-01-15",
    confidence: 98.5,
    biometricStatus: "Enrolled",
    lastVerified: "2024-01-15",
  });

  const [verificationSteps] = useState([
    {
      id: 1,
      step: "Facial Recognition",
      status: "completed",
      confidence: 99.2,
      date: "2024-01-15",
    },
    {
      id: 2,
      step: "Fingerprint Scan",
      status: "completed",
      confidence: 97.8,
      date: "2024-01-15",
    },
    {
      id: 3,
      step: "Document Verification",
      status: "completed",
      confidence: 100.0,
      date: "2024-01-15",
    },
    {
      id: 4,
      step: "Liveness Detection",
      status: "completed",
      confidence: 98.1,
      date: "2024-01-15",
    },
  ]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          👤 Proof of Personhood
        </h1>
        <p className="mt-2 text-gray-600">
          Verify your unique human identity using AI-powered biometric
          authentication
        </p>
      </div>

      {/* PoP Status */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">PoP Status</p>
              <p className="text-lg font-bold">{popData.status}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Confidence Score</p>
              <p className="text-2xl font-bold">{popData.confidence}%</p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Biometric Status</p>
              <p className="text-sm font-bold">{popData.biometricStatus}</p>
            </div>
            <div className="text-3xl">👁️</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Last Verified</p>
              <p className="text-sm font-bold">{popData.lastVerified}</p>
            </div>
            <div className="text-3xl">🔄</div>
          </div>
        </div>
      </div>

      {/* Verification Steps */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Verification Steps
        </h2>
        <div className="space-y-4">
          {verificationSteps.map((step) => (
            <div
              key={step.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-center">
                <div className="mr-3 rounded-full bg-green-100 p-2 text-green-600">
                  ✓
                </div>
                <div>
                  <p className="font-medium text-gray-800">{step.step}</p>
                  <p className="text-sm text-gray-600">
                    Completed on {step.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  {step.confidence}%
                </span>
                <span className="text-sm text-gray-500">{step.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PoP Benefits */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Benefits of Proof of Personhood
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 font-medium text-gray-800">
              Enhanced Security
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Prevents identity fraud and impersonation
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Multi-factor biometric authentication
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Liveness detection prevents spoofing
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Continuous verification monitoring
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-medium text-gray-800">
              Access & Privileges
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2 text-blue-500">✓</span>
                Higher transaction limits
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-blue-500">✓</span>
                Priority government services
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-blue-500">✓</span>
                Enhanced reputation score
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-blue-500">✓</span>
                Trusted citizen status
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Verification Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Verification Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
            <div className="mr-3 text-2xl">👁️</div>
            <div>
              <p className="font-medium">Face Verification</p>
              <p className="text-sm text-gray-600">Update facial data</p>
            </div>
          </button>

          <button className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
            <div className="mr-3 text-2xl">👆</div>
            <div>
              <p className="font-medium">Fingerprint Scan</p>
              <p className="text-sm text-gray-600">Update fingerprints</p>
            </div>
          </button>

          <button className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
            <div className="mr-3 text-2xl">📄</div>
            <div>
              <p className="font-medium">Document Update</p>
              <p className="text-sm text-gray-600">Refresh documents</p>
            </div>
          </button>

          <button className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
            <div className="mr-3 text-2xl">🔄</div>
            <div>
              <p className="font-medium">Re-verify</p>
              <p className="text-sm text-gray-600">Complete verification</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
