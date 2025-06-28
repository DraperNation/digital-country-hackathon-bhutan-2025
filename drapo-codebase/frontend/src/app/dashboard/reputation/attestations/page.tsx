"use client";

export default function AttestationsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🔗 Attestations</h1>
        <p className="mt-2 text-gray-600">
          View and manage your verifiable attestations from trusted
          organizations
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Attestation Management
        </h2>
        <p className="text-gray-600">
          This page will show your attestations including:
        </p>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li>• Education certificates and qualifications</li>
          <li>• Professional licenses and certifications</li>
          <li>• Community service attestations</li>
          <li>• Business and employment verifications</li>
          <li>• Request new attestations</li>
        </ul>
      </div>
    </div>
  );
}
