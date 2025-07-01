"use client";
import { useState } from "react";

export default function DocumentUploadStep({
  onNext,
  onBack,
}: Readonly<{
  onNext: (data: any) => void;
  onBack: () => void;
}>) {
  const [files, setFiles] = useState({
    passport: null as File | null,
    nationalId: null as File | null,
    proofOfAddress: null as File | null,
    photo: null as File | null,
    otherDocuments: [] as { name: string; file: File | null }[],
  });
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      setFiles((prev) => ({ ...prev, [name]: fileList[0] }));
    }
  };

  const handleOtherDocChange = (
    idx: number,
    field: "name" | "file",
    value: string | File,
  ) => {
    setFiles((prev) => {
      const updated = prev.otherDocuments.map((doc, i) =>
        i === idx ? { ...doc, [field]: value } : doc,
      );
      return { ...prev, otherDocuments: updated };
    });
  };
  const addOtherDoc = () => {
    setFiles((prev) => ({
      ...prev,
      otherDocuments: [...prev.otherDocuments, { name: "", file: null }],
    }));
  };
  const removeOtherDoc = (idx: number) => {
    setFiles((prev) => ({
      ...prev,
      otherDocuments: prev.otherDocuments.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // if (!files.passport || !files.proofOfAddress || !files.photo) {
    //   setError("Please upload all required documents.");
    //   return;
    // }
    setError("");
    onNext(files);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="mb-4 text-xl font-bold">Step 2: Document Upload</h2>
      <div>
        <label className="mb-1 block font-medium">
          Passport (photo page, required)
        </label>
        <input
          type="file"
          name="passport"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="block"
        />
      </div>
      <div>
        <label className="mb-1 block font-medium">
          National ID card (optional)
        </label>
        <input
          type="file"
          name="nationalId"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="block"
        />
      </div>
      <div>
        <label className="mb-1 block font-medium">
          Proof of address (required)
        </label>
        <input
          type="file"
          name="proofOfAddress"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="block"
        />
      </div>
      <div>
        <label className="mb-1 block font-medium">
          Recent passport-size photograph (required)
        </label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          className="block"
        />
      </div>
      <div>
        <label className="mb-1 block font-medium">
          Other Documents (optional)
        </label>
        {files.otherDocuments.map((doc, idx) => (
          <div key={idx} className="mb-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Document Name"
              value={doc.name}
              onChange={(e) =>
                handleOtherDocChange(idx, "name", e.target.value)
              }
              className="rounded border px-2 py-1"
            />
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleOtherDocChange(idx, "file", e.target.files[0]);
                }
              }}
              className="block"
            />
            <button
              type="button"
              onClick={() => removeOtherDoc(idx)}
              className="rounded bg-red-500 px-2 py-1 text-white"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addOtherDoc}
          className="rounded bg-blue-500 px-3 py-1 text-white"
        >
          Add Document
        </button>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="mt-4 flex space-x-2">
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
          Next
        </button>
      </div>
    </form>
  );
}
