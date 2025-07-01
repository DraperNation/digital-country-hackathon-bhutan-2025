"use client";

import { useState } from "react";
import BasicInfoStep from "./BasicInfoStep";
import DocumentUploadStep from "./DocumentUploadStep";
import KYCCaptureStep from "./KYCCaptureStep";
import PreviewStep from "./PreviewStep";
import ThankYouStep from "./ThankYouStep";

const steps = [
  "Basic Info",
  "Document Upload",
  "KYC Capture",
  "Preview",
  "Thank You",
];

export default function MultiStepSignup() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    // Add some fake data for demo
    name: "Kiran Demo",
    email: "kiran@example.com",
    passport: "P1234567",
    selfie: null,
    address: "Thimphu, Bhutan",
    files: [],
  });
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper to update form data and preserve previous values
  const updateFormData = (data: any) =>
    setFormData((prev: any) => ({ ...prev, ...data }));

  // Mock file upload: just store file object in state
  const next = async (data: any) => {
    setError("");
    // Step 0: Mock user registration
    if (step === 0) {
      setLoading(true);
      setTimeout(() => {
        setUserId(Math.floor(Math.random() * 1000000) + 1); // mock user id
        updateFormData(data);
        setStep(step + 1);
        setLoading(false);
      }, 700);
      return;
    }
    // Step 2: Mock KYC submission
    if (step === 2) {
      if (!userId) {
        setError("User registration required before KYC submission.");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        updateFormData(data);
        setStep(step + 1);
        setLoading(false);
      }, 700);
      return;
    }
    // After step 4 (Thank You), save formData to localStorage
    if (step === 3) {
      // Save to localStorage when moving to Thank You step
      if (typeof window !== "undefined") {
        localStorage.setItem("kycData", JSON.stringify(formData));
      }
    }
    updateFormData(data);
    setStep(step + 1);
  };
  const prev = () => setStep((s) => (s > 0 ? s - 1 : 0));

  return (
    <div className="mx-auto mt-10 max-w-xl rounded bg-white p-6 shadow">
      <div className="mb-6 flex space-x-2">
        {steps.map((label, idx) => (
          <div
            key={label}
            className={`flex-1 rounded py-2 text-center ${idx === step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
          >
            {label}
          </div>
        ))}
      </div>
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      {loading && (
        <div className="mb-4 text-sm text-blue-600">Processing...</div>
      )}
      {step === 0 && <BasicInfoStep onNext={next} />}
      {step === 1 && <DocumentUploadStep onNext={next} onBack={prev} />}
      {step === 2 && <KYCCaptureStep onNext={next} onBack={prev} />}
      {step === 3 && (
        <PreviewStep onNext={next} onBack={prev} formData={formData} />
      )}
      {step === 4 && <ThankYouStep />}
    </div>
  );
}
