"use client";

export default function BiometricAuthPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          👁️ Biometric Authentication
        </h1>
        <p className="mt-2 text-gray-600">
          Set up and manage biometric authentication for enhanced security
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Biometric Security Settings
        </h2>
        <p className="text-gray-600">This page will allow you to:</p>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li>• Set up facial recognition</li>
          <li>• Configure fingerprint scanning</li>
          <li>• Manage biometric permissions</li>
          <li>• Update biometric data</li>
          <li>• Configure security preferences</li>
        </ul>
      </div>
    </div>
  );
}
