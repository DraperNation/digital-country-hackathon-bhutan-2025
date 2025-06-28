"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function KYCPage() {
  const [kycData, setKycData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/mockKycData.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load mock KYC data");
        return res.json();
      })
      .then((data) => setKycData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  if (!kycData) {
    return <div className="text-gray-500">No KYC data found.</div>;
  }

  return (
    <div className="mx-auto mt-10 max-w-lg rounded bg-white p-6 shadow">
      <h2 className="mb-6 text-center text-2xl font-bold text-blue-700">
        KYC Details
      </h2>
      <div className="space-y-4">
        <div>
          <span className="font-semibold">Name:</span> {kycData.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {kycData.email}
        </div>
        <div>
          <span className="font-semibold">Passport Number:</span>{" "}
          {kycData.passport}
        </div>
        <div>
          <span className="font-semibold">Address:</span> {kycData.address}
        </div>
        <div>
          <span className="font-semibold">Selfie:</span>{" "}
          {kycData.selfie ? (
            <Image
              src={kycData.selfie}
              alt="Selfie"
              className="mt-2 h-24 w-24 rounded-full border object-cover"
              width={96}
              height={96}
              unoptimized
            />
          ) : (
            <span className="italic text-gray-400">Not uploaded</span>
          )}
        </div>
        <div>
          <span className="font-semibold">Uploaded Documents:</span>
          {kycData.files && kycData.files.length > 0 ? (
            <ul className="ml-6 mt-1 list-disc">
              {kycData.files.map((file: any, idx: number) => (
                <li key={idx}>{file.name || `Document ${idx + 1}`}</li>
              ))}
            </ul>
          ) : (
            <span className="ml-2 italic text-gray-400">
              No documents uploaded
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
