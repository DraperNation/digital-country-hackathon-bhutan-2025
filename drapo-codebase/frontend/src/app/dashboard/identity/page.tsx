"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface IdentityData {
  did: string;
  status: string;
  passportNumber: string;
  credentials: number;
  biometricStatus: string;
  lastVerified: string;
  kycVerified?: boolean;
  personhoodVerified?: boolean;
}

interface Credential {
  id: number;
  type: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string;
  status: string;
}

export default function IdentityPage() {
  const [identityData, setIdentityData] = useState<IdentityData>({
    did: "did:bhutan:123456789abcdef",
    status: "Verified",
    passportNumber: "BTN-2024-001234",
    credentials: 5,
    biometricStatus: "Enrolled",
    lastVerified: "2024-01-15",
  });

  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In production, get userId from auth context
  const userId = "1";

  useEffect(() => {
    const fetchIdentityData = async () => {
      try {
        setLoading(true);

        // Fetch identity overview
        const overviewResponse = await fetch(
          `/api/identity/overview/${userId}`,
        );
        const overviewData = await overviewResponse.json();

        if (overviewData.success) {
          setIdentityData(overviewData.data);
        }

        // Fetch credentials
        const credentialsResponse = await fetch(
          `/api/identity/credentials/${userId}`,
        );
        const credentialsData = await credentialsResponse.json();

        if (credentialsData.success) {
          setCredentials(credentialsData.data.slice(0, 3)); // Show only first 3
        }
      } catch (err) {
        console.error("Error fetching identity data:", err);
        setError("Failed to load identity data");
      } finally {
        setLoading(false);
      }
    };

    fetchIdentityData();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            🆔 Digital Identity Management
          </h1>
          <p className="mt-2 text-gray-600">
            Loading your identity information...
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            🆔 Digital Identity Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your decentralized identity, digital passport, and verifiable
            credentials
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          🆔 Digital Identity Management
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your decentralized identity, digital passport, and verifiable
          credentials
        </p>
      </div>

      {/* Catchy Welcome Banner */}
      <div className="mb-8 animate-pulse rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-lg">
        <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold">
          🚀 Welcome to Your Digital Identity & Reputation Hub!
        </h2>
        <p className="text-lg">
          Manage your decentralized identity, credentials, and reputation in one
          place. Explore new features like ZK-Proofs, Selective Disclosure, and
          more!
        </p>
      </div>

      {/* Identity Overview */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">DID Status</p>
              <p className="text-lg font-bold">{identityData.status}</p>
            </div>
            <div className="text-3xl">🆔</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Digital Passport</p>
              <p className="text-sm font-bold">{identityData.passportNumber}</p>
            </div>
            <div className="text-3xl">🛂</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Credentials</p>
              <p className="text-2xl font-bold">{identityData.credentials}</p>
            </div>
            <div className="text-3xl">📜</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Biometric Status</p>
              <p className="text-sm font-bold">
                {identityData.biometricStatus}
              </p>
            </div>
            <div className="text-3xl">👁️</div>
          </div>
        </div>
      </div>

      {/* Veramo Identity Status */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Veramo Identity Verification
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">KYC Verification</span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  identityData.kycVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {identityData.kycVerified ? "Verified" : "Pending"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Proof of Personhood</span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  identityData.personhoodVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {identityData.personhoodVerified ? "Verified" : "Pending"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">DID Resolution</span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Veramo Features
          </h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span className="text-sm text-gray-600">
                Verifiable Credentials
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span className="text-sm text-gray-600">
                Credential Presentations
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span className="text-sm text-gray-600">DID Management</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span className="text-sm text-gray-600">
                Zero-Knowledge Proofs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Identity Services */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Identity Services
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/identity/did"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">🆔</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">My DID</h3>
                <p className="text-sm text-gray-600">
                  Decentralized Identifier
                </p>
              </div>
            </div>
            <p className="text-gray-700">
              View and manage your Decentralized Identifier (DID) - your unique
              digital identity on the blockchain.
            </p>
            <div className="mt-4 rounded bg-gray-50 p-2">
              <p className="text-xs text-gray-600">DID: {identityData.did}</p>
            </div>
          </Link>

          <Link
            href="/dashboard/identity/passport"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">🛂</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Digital Passport
                </h3>
                <p className="text-sm text-gray-600">Secure travel document</p>
              </div>
            </div>
            <p className="text-gray-700">
              Access your digital passport for international travel and identity
              verification.
            </p>
            <div className="mt-4 rounded bg-gray-50 p-2">
              <p className="text-xs text-gray-600">
                Passport: {identityData.passportNumber}
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/identity/credentials"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">📜</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Verifiable Credentials
                </h3>
                <p className="text-sm text-gray-600">Manage your credentials</p>
              </div>
            </div>
            <p className="text-gray-700">
              View and manage your verifiable credentials issued by trusted
              organizations.
            </p>
            <div className="mt-4 rounded bg-gray-50 p-2">
              <p className="text-xs text-gray-600">
                {identityData.credentials} active credentials
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/identity/biometric"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">👁️</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Biometric Auth
                </h3>
                <p className="text-sm text-gray-600">Face & fingerprint</p>
              </div>
            </div>
            <p className="text-gray-700">
              Set up and manage biometric authentication for enhanced security.
            </p>
            <div className="mt-4 rounded bg-gray-50 p-2">
              <p className="text-xs text-gray-600">
                Status: {identityData.biometricStatus}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Credentials */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Recent Verifiable Credentials
        </h3>
        <div className="space-y-4">
          {credentials.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No credentials found.</p>
              <p className="text-sm">
                Your verifiable credentials will appear here.
              </p>
            </div>
          ) : (
            credentials.map((credential) => (
              <div
                key={credential.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-green-100 p-2 text-green-600">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {credential.type}
                    </p>
                    <p className="text-sm text-gray-600">
                      Issued by {credential.issuer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    {credential.status}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Issued:{" "}
                      {new Date(credential.issuedDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Expires:{" "}
                      {new Date(credential.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Identity Features */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Digital Identity Features
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-3 font-medium text-gray-800">
              Decentralized Identity (DID)
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2 text-blue-500">✓</span>
                Self-sovereign identity on blockchain
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-blue-500">✓</span>
                Complete control over personal data
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-blue-500">✓</span>
                Zero-knowledge proof verification
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-blue-500">✓</span>
                Interoperable across platforms
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-medium text-gray-800">
              Security & Privacy
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Biometric authentication
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Encrypted credential storage
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Selective disclosure of data
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Audit trail for all activities
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/identity/did"
            className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="mr-3 text-2xl">🆔</div>
            <div>
              <p className="font-medium">View DID</p>
              <p className="text-sm text-gray-600">Check your identifier</p>
            </div>
          </Link>

          <Link
            href="/dashboard/identity/passport"
            className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="mr-3 text-2xl">🛂</div>
            <div>
              <p className="font-medium">Digital Passport</p>
              <p className="text-sm text-gray-600">Travel document</p>
            </div>
          </Link>

          <Link
            href="/dashboard/identity/credentials"
            className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="mr-3 text-2xl">📜</div>
            <div>
              <p className="font-medium">Credentials</p>
              <p className="text-sm text-gray-600">View all credentials</p>
            </div>
          </Link>

          <Link
            href="/dashboard/identity/biometric"
            className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="mr-3 text-2xl">👁️</div>
            <div>
              <p className="font-medium">Biometric Setup</p>
              <p className="text-sm text-gray-600">Security settings</p>
            </div>
          </Link>
        </div>

        {/* Veramo Actions */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="mb-4 text-lg font-semibold text-gray-800">
            Veramo Actions
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => {
                // TODO: Implement credential verification
                alert("Credential verification feature coming soon!");
              }}
              className="flex items-center rounded-lg border border-blue-200 bg-blue-50 p-4 hover:bg-blue-100"
            >
              <div className="mr-3 text-2xl">🔍</div>
              <div>
                <p className="font-medium">Verify Credential</p>
                <p className="text-sm text-gray-600">Check authenticity</p>
              </div>
            </button>

            <button
              onClick={() => {
                // TODO: Implement presentation creation
                alert("Presentation creation feature coming soon!");
              }}
              className="flex items-center rounded-lg border border-purple-200 bg-purple-50 p-4 hover:bg-purple-100"
            >
              <div className="mr-3 text-2xl">📋</div>
              <div>
                <p className="font-medium">Create Presentation</p>
                <p className="text-sm text-gray-600">Share credentials</p>
              </div>
            </button>

            <button
              onClick={() => {
                // TODO: Implement KYC verification
                alert("KYC verification feature coming soon!");
              }}
              className="flex items-center rounded-lg border border-green-200 bg-green-50 p-4 hover:bg-green-100"
            >
              <div className="mr-3 text-2xl">✅</div>
              <div>
                <p className="font-medium">KYC Verification</p>
                <p className="text-sm text-gray-600">Complete verification</p>
              </div>
            </button>

            <button
              onClick={() => {
                // TODO: Implement proof of personhood
                alert("Proof of personhood feature coming soon!");
              }}
              className="flex items-center rounded-lg border border-orange-200 bg-orange-50 p-4 hover:bg-orange-100"
            >
              <div className="mr-3 text-2xl">👤</div>
              <div>
                <p className="font-medium">Proof of Personhood</p>
                <p className="text-sm text-gray-600">Verify uniqueness</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Add animated cards for each feature */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/dashboard/identity/zk-demo"
          className="rounded-xl border-2 border-dashed border-purple-400 bg-white p-6 shadow-lg transition-transform duration-200 hover:scale-105 hover:border-purple-600"
        >
          <div className="mb-4 flex items-center">
            <div className="mr-3 animate-bounce text-3xl">🧮</div>
            <div>
              <h3 className="text-xl font-bold text-purple-800">
                ZK-Proof Demo
              </h3>
              <p className="text-sm text-gray-600">
                Try privacy-preserving proofs
              </p>
            </div>
          </div>
          <p className="text-gray-700">
            Prove facts about yourself without revealing sensitive data. See how
            zero-knowledge proofs work in action!
          </p>
        </Link>
        <Link
          href="/dashboard/identity/selective-disclosure"
          className="rounded-xl border-2 border-dashed border-blue-400 bg-white p-6 shadow-lg transition-transform duration-200 hover:scale-105 hover:border-blue-600"
        >
          <div className="mb-4 flex items-center">
            <div className="mr-3 animate-spin text-3xl">🔒</div>
            <div>
              <h3 className="text-xl font-bold text-blue-800">
                Selective Disclosure
              </h3>
              <p className="text-sm text-gray-600">Share only what you want</p>
            </div>
          </div>
          <p className="text-gray-700">
            Control your privacy by sharing only specific attributes from your
            credentials.
          </p>
        </Link>
        <Link
          href="/dashboard/identity/reputation"
          className="rounded-xl border-2 border-dashed border-green-400 bg-white p-6 shadow-lg transition-transform duration-200 hover:scale-105 hover:border-green-600"
        >
          <div className="mb-4 flex items-center">
            <div className="mr-3 animate-pulse text-3xl">🌟</div>
            <div>
              <h3 className="text-xl font-bold text-green-800">
                Reputation & Attestations
              </h3>
              <p className="text-sm text-gray-600">Earn badges & trust</p>
            </div>
          </div>
          <p className="text-gray-700">
            Showcase your achievements, contributions, and trust score with
            verifiable attestations.
          </p>
        </Link>
        <Link
          href="/dashboard/identity/vault"
          className="rounded-xl border-2 border-dashed border-pink-400 bg-white p-6 shadow-lg transition-transform duration-200 hover:scale-105 hover:border-pink-600"
        >
          <div className="mb-4 flex items-center">
            <div className="mr-3 animate-bounce text-3xl">🗄️</div>
            <div>
              <h3 className="text-xl font-bold text-pink-800">
                Document Vault
              </h3>
              <p className="text-sm text-gray-600">Store & share securely</p>
            </div>
          </div>
          <p className="text-gray-700">
            Upload, store, and share important documents on decentralized
            storage.
          </p>
        </Link>
      </div>
    </div>
  );
}
