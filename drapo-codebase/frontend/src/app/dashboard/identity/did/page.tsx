"use client";

import { useState, useEffect } from "react";

interface DIDData {
  id: number;
  userId: number;
  did: string;
  status: string;
  lastVerified: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
  publicKeys: Array<{
    id: number;
    didId: number;
    type: string;
    publicKeyHex: string;
    controller: string;
    createdAt: string;
  }>;
  services: Array<{
    id: number;
    didId: number;
    type: string;
    serviceEndpoint: string;
    createdAt: string;
  }>;
}

export default function DIDPage() {
  const [didData, setDidData] = useState<DIDData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In production, get userId from auth context
  const userId = "1";

  useEffect(() => {
    const fetchDIDData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/identity/did/${userId}`);
        const data = await response.json();

        if (data.success) {
          setDidData(data.data);
        } else {
          setError(data.message || "Failed to load DID data");
        }
      } catch (err) {
        console.error("Error fetching DID data:", err);
        setError("Failed to load DID data");
      } finally {
        setLoading(false);
      }
    };

    fetchDIDData();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            🆔 My Decentralized Identifier (DID)
          </h1>
          <p className="mt-2 text-gray-600">Loading your DID information...</p>
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
            🆔 My Decentralized Identifier (DID)
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your unique digital identity on the blockchain
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
          🆔 My Decentralized Identifier (DID)
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your unique digital identity on the blockchain
        </p>
      </div>

      {didData && (
        <div className="space-y-6">
          {/* DID Overview */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              DID Overview
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-600">DID</p>
                <p className="break-all font-mono text-lg text-gray-800">
                  {didData.did}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    didData.status === "Verified"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {didData.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Last Verified
                </p>
                <p className="text-gray-800">
                  {new Date(didData.lastVerified).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Created</p>
                <p className="text-gray-800">
                  {new Date(didData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Public Keys */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Public Keys
            </h2>
            <div className="space-y-4">
              {didData.publicKeys.map((key) => (
                <div
                  key={key.id}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Type</p>
                      <p className="text-gray-800">{key.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Controller
                      </p>
                      <p className="break-all font-mono text-sm text-gray-800">
                        {key.controller}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-600">
                        Public Key
                      </p>
                      <p className="break-all font-mono text-sm text-gray-800">
                        {key.publicKeyHex}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Services
            </h2>
            <div className="space-y-4">
              {didData.services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Type</p>
                      <p className="text-gray-800">{service.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Endpoint
                      </p>
                      <p className="break-all font-mono text-sm text-gray-800">
                        {service.serviceEndpoint}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DID Document */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              DID Document
            </h2>
            <div className="rounded-lg bg-gray-900 p-4">
              <pre className="overflow-x-auto text-sm text-green-400">
                {JSON.stringify(
                  {
                    "@context": ["https://www.w3.org/ns/did/v1"],
                    id: didData.did,
                    verificationMethod: didData.publicKeys.map((key) => ({
                      id: `${didData.did}#${key.id}`,
                      type: key.type,
                      controller: key.controller,
                      publicKeyHex: key.publicKeyHex,
                    })),
                    service: didData.services.map((service) => ({
                      id: `${didData.did}#${service.id}`,
                      type: service.type,
                      serviceEndpoint: service.serviceEndpoint,
                    })),
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              DID Management
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <button className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-left transition-colors hover:bg-blue-100">
                <div className="mb-2 text-2xl">🔑</div>
                <p className="font-medium text-blue-800">Add Public Key</p>
                <p className="text-sm text-blue-600">
                  Add new verification method
                </p>
              </button>

              <button className="rounded-lg border border-green-200 bg-green-50 p-4 text-left transition-colors hover:bg-green-100">
                <div className="mb-2 text-2xl">🔗</div>
                <p className="font-medium text-green-800">Add Service</p>
                <p className="text-sm text-green-600">Link external services</p>
              </button>

              <button className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-left transition-colors hover:bg-purple-100">
                <div className="mb-2 text-2xl">📋</div>
                <p className="font-medium text-purple-800">Update DID</p>
                <p className="text-sm text-purple-600">Modify DID document</p>
              </button>

              <button className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-left transition-colors hover:bg-orange-100">
                <div className="mb-2 text-2xl">🔍</div>
                <p className="font-medium text-orange-800">Verify DID</p>
                <p className="text-sm text-orange-600">Check DID resolution</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
