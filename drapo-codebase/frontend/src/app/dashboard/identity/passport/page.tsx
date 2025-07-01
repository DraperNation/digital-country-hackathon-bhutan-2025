"use client";

import { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  QrCodeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  ShieldCheckIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface PassportData {
  id: string;
  passportNumber: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  gender: string;
  photo: string;
  status: "valid" | "expired" | "suspended";
  biometricData: {
    fingerprint: boolean;
    iris: boolean;
    face: boolean;
  };
  travelHistory: Array<{
    country: string;
    entryDate: string;
    exitDate: string;
    purpose: string;
  }>;
}

interface VerifiableCredential {
  id: string;
  type: string;
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: any;
  proof: {
    type: string;
    created: string;
    proofPurpose: string;
    verificationMethod: string;
    jws: string;
  };
}

export default function DigitalPassportPage() {
  const [passportData, setPassportData] = useState<PassportData | null>(null);
  const [vc, setVc] = useState<VerifiableCredential | null>(null);
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "details" | "travel" | "biometric" | "vc"
  >("details");

  // Mock passport data
  const mockPassportData: PassportData = {
    id: "1",
    passportNumber: "BTN-123456789",
    fullName: "John Smith",
    dateOfBirth: "1990-05-15",
    placeOfBirth: "Thimphu, Bhutan",
    nationality: "Bhutanese",
    issueDate: "2023-01-15",
    expiryDate: "2033-01-15",
    issuingAuthority: "Department of Immigration, Bhutan",
    gender: "Male",
    photo: "/images/user/user-01.png",
    status: "valid",
    biometricData: {
      fingerprint: true,
      iris: true,
      face: true,
    },
    travelHistory: [
      {
        country: "India",
        entryDate: "2023-06-15",
        exitDate: "2023-06-20",
        purpose: "Tourism",
      },
      {
        country: "Thailand",
        entryDate: "2023-08-10",
        exitDate: "2023-08-15",
        purpose: "Business",
      },
      {
        country: "Singapore",
        entryDate: "2023-10-05",
        exitDate: "2023-10-10",
        purpose: "Medical",
      },
    ],
  };

  // Mock VC data
  const mockVC: VerifiableCredential = {
    id: "urn:uuid:550e8400-e29b-41d4-a716-446655440000",
    type: "BhutanesePassportCredential",
    issuer: "did:web:gov.bt",
    issuanceDate: "2023-01-15T10:00:00Z",
    expirationDate: "2033-01-15T10:00:00Z",
    credentialSubject: {
      id: "did:bt:passport:BTN-123456789",
      passportNumber: "BTN-123456789",
      fullName: "John Smith",
      nationality: "Bhutanese",
      dateOfBirth: "1990-05-15",
      gender: "Male",
      issueDate: "2023-01-15",
      expiryDate: "2033-01-15",
      issuingAuthority: "Department of Immigration, Bhutan",
    },
    proof: {
      type: "Ed25519Signature2020",
      created: "2023-01-15T10:00:00Z",
      proofPurpose: "assertionMethod",
      verificationMethod: "did:web:gov.bt#key-1",
      jws: "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..mock-signature-here",
    },
  };

  useEffect(() => {
    // Simulate API call
    const loadPassportData = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setPassportData(mockPassportData);
        setVc(mockVC);

        // Generate QR code for passport data
        const qrData = JSON.stringify({
          type: "BhutanesePassport",
          passportNumber: mockPassportData.passportNumber,
          fullName: mockPassportData.fullName,
          nationality: mockPassportData.nationality,
          issueDate: mockPassportData.issueDate,
          expiryDate: mockPassportData.expiryDate,
          vcId: mockVC.id,
        });

        // Simple QR code generation (in real app, use a proper QR library)
        setQrCode(
          `data:image/svg+xml;base64,${btoa(`
          <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="white"/>
            <text x="100" y="100" text-anchor="middle" font-family="monospace" font-size="8">${qrData}</text>
          </svg>
        `)}`,
        );

        setError(null);
      } catch (err) {
        setError("Failed to load passport data");
      } finally {
        setLoading(false);
      }
    };

    loadPassportData();
  }, []);

  const handleCreateVC = async () => {
    setLoading(true);
    try {
      // Simulate VC creation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setVc(mockVC);
    } catch (err) {
      setError("Failed to create verifiable credential");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPassport = () => {
    // Mock download functionality
    const dataStr = JSON.stringify(passportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `passport-${passportData?.passportNumber}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSharePassport = () => {
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: "Bhutanese Digital Passport",
        text: `Passport: ${passportData?.passportNumber}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-gray-600">Loading passport data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto mb-4 h-8 w-8 text-red-500" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!passportData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <DocumentTextIcon className="mx-auto mb-4 h-8 w-8 text-gray-400" />
          <p className="text-gray-600">No passport data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Digital Passport</h1>
          <p className="mt-1 text-gray-600">
            Secure digital identity verification
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center space-x-1 rounded-full px-3 py-1 text-sm font-medium ${
              passportData.status === "valid"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <ShieldCheckIcon className="h-3 w-3" />
            <span className="capitalize">{passportData.status}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Passport Card */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="border-b p-6">
              <h2 className="flex items-center space-x-2 text-lg font-semibold">
                <DocumentTextIcon className="h-5 w-5" />
                <span>Passport Details</span>
              </h2>
            </div>
            <div className="space-y-6 p-6">
              {/* Passport Photo and Basic Info */}
              <div className="flex items-start space-x-6">
                <div className="h-40 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={passportData.photo}
                    alt="Passport Photo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {passportData.fullName}
                    </h3>
                    <p className="text-gray-600">
                      Passport Number: {passportData.passportNumber}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Nationality:</span>
                      <p className="font-medium">{passportData.nationality}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Gender:</span>
                      <p className="font-medium">{passportData.gender}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date of Birth:</span>
                      <p className="font-medium">
                        {new Date(
                          passportData.dateOfBirth,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Place of Birth:</span>
                      <p className="font-medium">{passportData.placeOfBirth}</p>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Issue/Expiry Dates */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Issue Date</span>
                  </div>
                  <p className="font-medium">
                    {new Date(passportData.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Expiry Date</span>
                  </div>
                  <p className="font-medium">
                    {new Date(passportData.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <MapPinIcon className="h-4 w-4" />
                  <span>Issuing Authority</span>
                </div>
                <p className="font-medium">{passportData.issuingAuthority}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleDownloadPassport}
                  className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={handleSharePassport}
                  className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <ShareIcon className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code and VC Section */}
        <div className="space-y-6">
          {/* QR Code Card */}
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="border-b p-6">
              <h2 className="flex items-center space-x-2 text-lg font-semibold">
                <QrCodeIcon className="h-5 w-5" />
                <span>QR Code</span>
              </h2>
            </div>
            <div className="p-6 text-center">
              {qrCode ? (
                <div className="space-y-4">
                  <div className="rounded-lg border bg-white p-4">
                    <img
                      src={qrCode}
                      alt="Passport QR Code"
                      className="mx-auto h-32 w-32"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Scan to verify passport authenticity
                  </p>
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center">
                  <ArrowPathIcon className="h-6 w-6 animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Verifiable Credential Card */}
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="border-b p-6">
              <h2 className="flex items-center space-x-2 text-lg font-semibold">
                <DocumentTextIcon className="h-5 w-5" />
                <span>Verifiable Credential</span>
              </h2>
            </div>
            <div className="space-y-4 p-6">
              {vc ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">VC Issued</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-gray-500">ID:</span>{" "}
                      {vc.id.substring(0, 20)}...
                    </p>
                    <p>
                      <span className="text-gray-500">Issuer:</span> {vc.issuer}
                    </p>
                    <p>
                      <span className="text-gray-500">Issued:</span>{" "}
                      {new Date(vc.issuanceDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    View VC Details
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                    <span className="text-yellow-600">VC Not Issued</span>
                  </div>
                  <button
                    onClick={handleCreateVC}
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <ArrowPathIcon className="mx-auto h-4 w-4 animate-spin" />
                    ) : (
                      "Create Verifiable Credential"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b p-6">
          <div className="flex space-x-1 border-b">
            {[
              { id: "details", label: "Details", icon: UserIcon },
              { id: "travel", label: "Travel History", icon: MapPinIcon },
              {
                id: "biometric",
                label: "Biometric Data",
                icon: ShieldCheckIcon,
              },
              {
                id: "vc",
                label: "Verifiable Credential",
                icon: DocumentTextIcon,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {activeTab === "details" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Complete Passport Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-sm text-gray-500">Passport Number</span>
                  <p className="rounded bg-gray-50 p-2 font-mono">
                    {passportData.passportNumber}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-gray-500">Full Name</span>
                  <p className="font-medium">{passportData.fullName}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-gray-500">Date of Birth</span>
                  <p className="font-medium">
                    {new Date(passportData.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-gray-500">Place of Birth</span>
                  <p className="font-medium">{passportData.placeOfBirth}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-gray-500">Nationality</span>
                  <p className="font-medium">{passportData.nationality}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-gray-500">Gender</span>
                  <p className="font-medium">{passportData.gender}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "travel" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Travel History</h3>
              <div className="space-y-3">
                {passportData.travelHistory.map((trip, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{trip.country}</h4>
                        <p className="text-sm text-gray-600">{trip.purpose}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p>
                          Entry: {new Date(trip.entryDate).toLocaleDateString()}
                        </p>
                        <p>
                          Exit: {new Date(trip.exitDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "biometric" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Biometric Data</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {Object.entries(passportData.biometricData).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="rounded-lg border p-4 text-center"
                    >
                      <div
                        className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${
                          value
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {value ? (
                          <CheckCircleIcon className="h-6 w-6" />
                        ) : (
                          <ExclamationTriangleIcon className="h-6 w-6" />
                        )}
                      </div>
                      <h4 className="font-medium capitalize">{key}</h4>
                      <p className="text-sm text-gray-600">
                        {value ? "Registered" : "Not Registered"}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {activeTab === "vc" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Verifiable Credential Details
              </h3>
              {vc ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <pre className="overflow-x-auto text-sm">
                      {JSON.stringify(vc, null, 2)}
                    </pre>
                  </div>
                  <div className="flex space-x-3">
                    <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Download VC
                    </button>
                    <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Verify VC
                    </button>
                    <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Share VC
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <DocumentTextIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">
                    No verifiable credential issued yet
                  </p>
                  <button
                    onClick={handleCreateVC}
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Create Verifiable Credential
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
