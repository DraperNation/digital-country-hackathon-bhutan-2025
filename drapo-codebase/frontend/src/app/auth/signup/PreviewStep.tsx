"use client";
import { useState } from "react";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex border-b py-1 last:border-b-0">
      <div className="w-1/3 font-medium text-gray-700">{label}</div>
      <div className="flex-1 text-gray-900">
        {value || <span className="italic text-gray-400">N/A</span>}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h4 className="mb-2 text-lg font-semibold text-blue-700">{title}</h4>
      <div className="rounded border bg-white p-4 shadow-sm">{children}</div>
    </div>
  );
}

export default function PreviewStep({
  onNext,
  onBack,
  formData,
}: {
  onNext: (data: any) => void;
  onBack: () => void;
  formData: any;
}) {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError(
        "You must agree to the terms and conditions and provide consent.",
      );
      return;
    }
    setError("");
    onNext({ agreed: true });
  };

  // Helper to render file names or preview
  const renderFile = (file: File | null) =>
    file ? (
      <span className="text-green-700">{file.name}</span>
    ) : (
      <span className="italic text-gray-400">N/A</span>
    );
  const renderFamily = (member: any) => (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
      <InfoRow label="Full Name" value={member?.fullName} />
      <InfoRow label="Date of Birth" value={member?.dateOfBirth} />
      <InfoRow label="Nationality" value={member?.nationality} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Step 4: Preview & Agreement
      </h2>
      <Section title="Personal Information">
        <InfoRow label="First Name" value={formData.firstName} />
        <InfoRow label="Last Name" value={formData.lastName} />
        <InfoRow label="Email" value={formData.email} />
        <InfoRow label="Date of Birth" value={formData.dateOfBirth} />
        <InfoRow label="Nationality" value={formData.nationality} />
        <InfoRow label="Phone" value={formData.phone} />
        <InfoRow label="Address" value={formData.address} />
        <InfoRow label="City" value={formData.city} />
        <InfoRow label="State/Province" value={formData.state} />
        <InfoRow label="Postal Code" value={formData.postalCode} />
        <InfoRow label="Country" value={formData.country} />
      </Section>
      <Section title="Family Information">
        <div className="mb-2">
          <div className="font-semibold text-gray-600">Mother</div>
          {renderFamily(formData.mother)}
        </div>
        <div className="mb-2">
          <div className="font-semibold text-gray-600">Father</div>
          {renderFamily(formData.father)}
        </div>
        {formData.spouse?.fullName && (
          <div className="mb-2">
            <div className="font-semibold text-gray-600">Spouse</div>
            {renderFamily(formData.spouse)}
          </div>
        )}
        {Array.isArray(formData.children) && formData.children.length > 0 && (
          <div className="mb-2">
            <div className="font-semibold text-gray-600">Children</div>
            {formData.children.map((child: any, idx: number) => (
              <div key={idx} className="mb-1 border-l-2 border-blue-200 pl-2">
                {renderFamily(child)}
              </div>
            ))}
          </div>
        )}
      </Section>
      <Section title="Documents">
        <InfoRow label="Passport" value={renderFile(formData.passport)} />
        <InfoRow label="National ID" value={renderFile(formData.nationalId)} />
        <InfoRow
          label="Proof of Address"
          value={renderFile(formData.proofOfAddress)}
        />
        <InfoRow label="Photograph" value={renderFile(formData.photo)} />
        {Array.isArray(formData.otherDocuments) &&
          formData.otherDocuments.length > 0 && (
            <div className="mt-2">
              <div className="mb-1 font-semibold text-gray-600">
                Other Documents
              </div>
              {formData.otherDocuments.map((doc: any, idx: number) => (
                <InfoRow
                  key={idx}
                  label={doc.name || `Document ${idx + 1}`}
                  value={renderFile(doc.file)}
                />
              ))}
            </div>
          )}
      </Section>
      <Section title="KYC Capture">
        <InfoRow
          label="Fingerprint Scan"
          value={renderFile(formData.fingerprintScan)}
        />
        <InfoRow
          label="Fingerprint Image"
          value={renderFile(formData.fingerprintImage)}
        />
        <InfoRow label="Signature" value={renderFile(formData.signature)} />
        <InfoRow label="Selfie" value={renderFile(formData.selfie)} />
      </Section>
      <div className="mb-4 rounded border bg-gray-50 p-4">
        <h3 className="mb-2 font-semibold">Terms & Conditions</h3>
        <div className="mb-2 max-h-32 overflow-y-auto text-xs">
          {/* Replace with your actual terms and consent text */}
          By submitting this application, you confirm that all information and
          documents provided are true and correct. You consent to the processing
          of your data for the purpose of eResidency onboarding and
          verification, in accordance with Bhutanese law and privacy policy.
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="text-sm">
            I agree to the terms and conditions and provide my consent.
          </span>
        </label>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="mt-4 flex justify-end space-x-2">
        <button
          type="button"
          className="rounded bg-gray-300 px-4 py-2"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
