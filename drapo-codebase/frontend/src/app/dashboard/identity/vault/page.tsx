"use client";

import React from "react";
import {
  DocumentDuplicateIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";

const mockDocs = [
  {
    id: 1,
    name: "Business License.pdf",
    hash: "Qm123...abc",
    uploaded: "2025-06-01",
  },
  {
    id: 2,
    name: "Tax Certificate.pdf",
    hash: "Qm456...def",
    uploaded: "2025-06-10",
  },
];

export default function VaultPage() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Placeholder upload handler
  const handleUpload = () => {
    const input = fileInputRef.current;
    if (input?.files?.length) {
      alert(`Uploading: ${input.files[0].name}`);
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Animated Banner */}
      <div className="animate-fade-in mb-8 flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <DocumentDuplicateIcon className="h-10 w-10 animate-bounce text-white" />
          <div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
              Decentralized Document Vault
            </h1>
            <p className="mt-1 text-white/90">
              Upload, store, and share important documents on IPFS/Filecoin.
            </p>
          </div>
        </div>
        <CloudArrowUpIcon className="hidden h-12 w-12 animate-pulse text-white/70 md:block" />
      </div>

      {/* Feature Card */}
      <div className="animate-fade-in-up mx-auto max-w-2xl rounded-2xl bg-white/90 p-8 shadow-xl ring-1 ring-blue-100 transition-transform duration-300 hover:scale-105">
        <div className="mb-4 flex items-center gap-2 text-lg font-bold text-purple-700">
          <DocumentDuplicateIcon className="h-6 w-6 text-blue-500" /> My
          Documents
        </div>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            ref={fileInputRef}
            type="file"
            className="flex-1 rounded border p-2"
          />
          <button
            className="animate-wiggle rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            onClick={handleUpload}
            type="button"
          >
            Upload
          </button>
        </div>
        <h2 className="mb-2 mt-8 flex items-center gap-2 text-lg font-semibold text-blue-700">
          <CloudArrowUpIcon className="h-5 w-5 text-purple-500" /> Uploaded
          Documents
        </h2>
        <ul className="list-none divide-y divide-blue-50 pl-0 text-gray-800">
          {mockDocs.map((doc) => (
            <li
              key={doc.id}
              className="flex flex-col overflow-x-auto py-3 md:flex-row md:items-center md:gap-2"
            >
              <span
                className="max-w-xs truncate font-mono md:max-w-sm"
                title={doc.name}
              >
                {doc.name}
              </span>
              <span className="text-xs text-gray-500">
                (IPFS: <span className="text-blue-700">{doc.hash}</span>)
              </span>
              <span className="text-xs text-gray-400">
                - Uploaded {doc.uploaded}
              </span>
              <div className="mt-1 flex gap-2 md:mt-0">
                <button className="text-blue-600 underline">Download</button>
                <button className="text-green-600 underline">Share</button>
                <button className="text-purple-600 underline">Verify</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease; }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(.4,0,.2,1); }
        .animate-wiggle { animation: wiggle 1.2s infinite alternate; }
      `}</style>
    </div>
  );
}
