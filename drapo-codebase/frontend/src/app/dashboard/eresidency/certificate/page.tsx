"use client";
import { useRef, useState } from "react";
import Image from "next/image";

// Mock issued documents data
const mockIssuedDocs = [
  {
    id: 1,
    name: "eResidency Certificate",
    type: "PDF",
    issuedOn: "2025-05-02",
    fileName: "eResidency-Certificate.pdf",
  },
  {
    id: 2,
    name: "eResidency Digital Badge",
    type: "Badge (SVG)",
    issuedOn: "2025-05-02",
    fileName: "eResidency-Badge.svg",
  },
];

const availableDocs = [
  { value: "eResidency Certificate", label: "eResidency Certificate" },
  { value: "eResidency Digital Badge", label: "eResidency Digital Badge" },
  { value: "other", label: "Other (specify)" },
];

export default function CertificatePage() {
  const badgeRef = useRef<HTMLAnchorElement>(null);
  const [tab, setTab] = useState<"issued" | "request">("issued");
  const [issuedDocs] = useState(mockIssuedDocs);
  const [previewDoc, setPreviewDoc] = useState<null | {
    type: string;
    fileName: string;
  }>(null);
  const [requestType, setRequestType] = useState(availableDocs[0].value);
  const [otherDoc, setOtherDoc] = useState("");
  const [esignFile, setEsignFile] = useState<File | null>(null);
  const [esignRequested, setEsignRequested] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  function downloadPDF() {
    import("jspdf").then((jsPDFModule) => {
      const doc = new jsPDFModule.jsPDF();
      doc.setFontSize(18);
      doc.text("eResidency Official Certificate", 20, 30);
      doc.setFontSize(12);
      doc.text("This certifies that you are an official eResident.", 20, 50);
      doc.text(`Issued on: 2025-05-02`, 20, 65);
      doc.save("eResidency-Certificate.pdf");
    });
  }

  function downloadBadge() {
    const svg = `<svg width='200' height='60' xmlns='http://www.w3.org/2000/svg'><rect width='200' height='60' rx='12' fill='#2563eb'/><text x='100' y='35' font-size='18' fill='white' text-anchor='middle' alignment-baseline='middle' font-family='Arial'>eResident</text></svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    if (badgeRef.current) {
      badgeRef.current.href = url;
      badgeRef.current.download = "eResidency-Badge.svg";
      badgeRef.current.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  function handleDownload(doc: (typeof mockIssuedDocs)[0]) {
    if (doc.type === "PDF") downloadPDF();
    else if (doc.type.includes("Badge")) downloadBadge();
  }

  function handlePreview(doc: (typeof mockIssuedDocs)[0]) {
    setPreviewDoc({ type: doc.type, fileName: doc.fileName });
  }

  function handleReapply(doc: (typeof mockIssuedDocs)[0]) {
    alert(`Reapply for: ${doc.name}`);
  }

  function handleRequestSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRequestSuccess(true);
    setTimeout(() => setRequestSuccess(false), 3000);
  }

  function handleEsignSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEsignRequested(true);
    setTimeout(() => setEsignRequested(false), 3000);
  }

  return (
    <div className="mx-auto mt-8 max-w-4xl rounded-xl bg-white p-6 shadow-lg">
      <h2 className="mb-4 flex items-center gap-2 text-3xl font-extrabold text-blue-700">
        <span>📄</span> Official Documents
      </h2>
      <div className="mb-6 flex border-b">
        <button
          className={`-mb-px border-b-4 px-6 py-3 text-lg transition-colors ${tab === "issued" ? "border-blue-600 bg-blue-50 font-bold text-blue-700" : "border-transparent bg-transparent text-gray-500"}`}
          onClick={() => setTab("issued")}
        >
          Issued Documents
        </button>
        <button
          className={`-mb-px border-b-4 px-6 py-3 text-lg transition-colors ${tab === "request" ? "border-blue-600 bg-blue-50 font-bold text-blue-700" : "border-transparent bg-transparent text-gray-500"}`}
          onClick={() => setTab("request")}
        >
          Request Documents
        </button>
      </div>
      {tab === "issued" && (
        <div>
          <p className="mb-6 flex items-center gap-2 text-lg text-gray-700">
            <span>✅</span> View, preview, download, or reapply for your issued
            documents.
          </p>
          <div className="overflow-x-auto rounded-lg border shadow">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="border px-4 py-2">Document Name</th>
                  <th className="border px-4 py-2">Type</th>
                  <th className="border px-4 py-2">Issued On</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issuedDocs.map((doc) => (
                  <tr key={doc.id} className="transition hover:bg-blue-50">
                    <td className="border px-4 py-2 font-semibold">
                      {doc.name}
                    </td>
                    <td className="border px-4 py-2">{doc.type}</td>
                    <td className="border px-4 py-2">{doc.issuedOn}</td>
                    <td className="flex gap-2 border px-4 py-2">
                      <button
                        className="font-medium text-blue-600 hover:underline"
                        onClick={() => handlePreview(doc)}
                      >
                        Preview
                      </button>
                      <button
                        className="font-medium text-green-600 hover:underline"
                        onClick={() => handleDownload(doc)}
                      >
                        Download
                      </button>
                      <button
                        className="font-medium text-yellow-600 hover:underline"
                        onClick={() => handleReapply(doc)}
                      >
                        Reapply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {previewDoc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="relative min-w-[320px] max-w-[90vw] rounded bg-white p-6 shadow-lg">
                <button
                  className="absolute right-2 top-2 text-2xl text-gray-500"
                  onClick={() => setPreviewDoc(null)}
                >
                  &times;
                </button>
                <h4 className="mb-4 text-lg font-semibold">
                  Preview: {previewDoc.fileName}
                </h4>
                {previewDoc.type === "PDF" ? (
                  <div className="text-gray-500">
                    PDF preview not supported in mock. Please download to view.
                  </div>
                ) : (
                  <Image
                    src={`data:image/svg+xml;utf8,<svg width='200' height='60' xmlns='http://www.w3.org/2000/svg'><rect width='200' height='60' rx='12' fill='%232563eb'/><text x='100' y='35' font-size='18' fill='white' text-anchor='middle' alignment-baseline='middle' font-family='Arial'>eResident</text></svg>`}
                    alt="Digital Badge Preview"
                    className="h-16 w-48"
                    width={200}
                    height={60}
                    unoptimized
                  />
                )}
              </div>
            </div>
          )}
          <a ref={badgeRef} style={{ display: "none" }} />
        </div>
      )}
      {tab === "request" && (
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <form
            className="flex flex-col gap-4 rounded-lg bg-blue-50 p-6 shadow"
            onSubmit={handleRequestSubmit}
          >
            <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-blue-700">
              <span>📝</span> Request a Document
            </h3>
            <div>
              <label className="mb-1 block font-medium">Full Name</label>
              <input
                className="w-full rounded border px-3 py-2"
                value="Kiran"
                disabled
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">Citizen ID</label>
              <input
                className="w-full rounded border px-3 py-2"
                value="123456789"
                disabled
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">Select Document</label>
              <select
                className="w-full rounded border px-3 py-2"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
              >
                {availableDocs.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {requestType === "other" && (
              <div>
                <label className="mb-1 block font-medium">
                  Specify Document
                </label>
                <input
                  className="w-full rounded border px-3 py-2"
                  value={otherDoc}
                  onChange={(e) => setOtherDoc(e.target.value)}
                  required
                />
              </div>
            )}
            <button
              className="mt-2 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              type="submit"
            >
              Request Document
            </button>
            {requestSuccess && (
              <div className="mt-2 font-medium text-green-600">
                Request submitted successfully!
              </div>
            )}
          </form>
          <form
            className="flex flex-col gap-4 rounded-lg bg-green-50 p-6 shadow"
            onSubmit={handleEsignSubmit}
          >
            <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-green-700">
              <span>🔏</span> Request eSign
            </h3>
            <div>
              <label className="mb-1 block font-medium">Full Name</label>
              <input
                className="w-full rounded border px-3 py-2"
                value="Kiran"
                disabled
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">Citizen ID</label>
              <input
                className="w-full rounded border px-3 py-2"
                value="123456789"
                disabled
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">
                Upload Document for eSign
              </label>
              <input
                type="file"
                className="w-full"
                accept=".pdf,.doc,.docx,.png,.jpg"
                onChange={(e) => setEsignFile(e.target.files?.[0] || null)}
                required
              />
            </div>
            <button
              className="mt-2 rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
              type="submit"
            >
              Request eSign
            </button>
            {esignRequested && (
              <div className="mt-2 font-medium text-green-700">
                eSign request submitted! Your document will be digitally signed
                by the government.
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
