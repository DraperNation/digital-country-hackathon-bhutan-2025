"use client";

import { useState } from "react";

export default function DocumentsPage() {
  const [documents] = useState([
    {
      id: 1,
      name: "National ID Card",
      type: "Identity Document",
      status: "active",
      issuedDate: "2020-01-15",
      expiryDate: "2030-01-15",
      fileSize: "2.3 MB",
    },
    {
      id: 2,
      name: "Passport",
      type: "Travel Document",
      status: "active",
      issuedDate: "2022-03-20",
      expiryDate: "2032-03-20",
      fileSize: "1.8 MB",
    },
    {
      id: 3,
      name: "Birth Certificate",
      type: "Civil Document",
      status: "active",
      issuedDate: "1995-06-10",
      expiryDate: "Never",
      fileSize: "1.2 MB",
    },
    {
      id: 4,
      name: "Education Certificate",
      type: "Academic Document",
      status: "active",
      issuedDate: "2020-07-15",
      expiryDate: "Never",
      fileSize: "3.1 MB",
    },
    {
      id: 5,
      name: "Driver&apos;s License",
      type: "License",
      status: "expired",
      issuedDate: "2018-05-12",
      expiryDate: "2023-05-12",
      fileSize: "2.7 MB",
    },
  ]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📄 My Documents</h1>
        <p className="mt-2 text-gray-600">
          Manage and view all your official documents and certificates
        </p>
      </div>

      {/* Document Stats */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Documents</p>
              <p className="text-2xl font-bold">{documents.length}</p>
            </div>
            <div className="text-3xl">📄</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Documents</p>
              <p className="text-2xl font-bold">
                {documents.filter((d) => d.status === "active").length}
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Expired Documents</p>
              <p className="text-2xl font-bold">
                {documents.filter((d) => d.status === "expired").length}
              </p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Document Types</p>
              <p className="text-2xl font-bold">
                {new Set(documents.map((d) => d.type)).size}
              </p>
            </div>
            <div className="text-3xl">🏷️</div>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          All Documents
        </h2>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-center">
                <div
                  className={`mr-3 rounded-full p-2 ${
                    doc.status === "active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {doc.status === "active" ? "✓" : "⚠️"}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{doc.name}</p>
                  <p className="text-sm text-gray-600">
                    {doc.type} • {doc.fileSize}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    doc.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {doc.status}
                </span>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Issued: {doc.issuedDate}
                  </p>
                  <p className="text-xs text-gray-500">
                    Expires: {doc.expiryDate}
                  </p>
                </div>
                <button className="rounded bg-blue-50 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Categories */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Document Categories
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3 flex items-center">
              <div className="mr-2 text-2xl">🆔</div>
              <h3 className="font-medium text-gray-800">Identity Documents</h3>
            </div>
            <p className="text-sm text-gray-600">
              National ID, Passport, Birth Certificate
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {documents.filter((d) => d.type === "Identity Document").length}{" "}
              documents
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3 flex items-center">
              <div className="mr-2 text-2xl">🎓</div>
              <h3 className="font-medium text-gray-800">Academic Documents</h3>
            </div>
            <p className="text-sm text-gray-600">
              Education certificates, diplomas, transcripts
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {documents.filter((d) => d.type === "Academic Document").length}{" "}
              documents
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3 flex items-center">
              <div className="mr-2 text-2xl">🚗</div>
              <h3 className="font-medium text-gray-800">Licenses</h3>
            </div>
            <p className="text-sm text-gray-600">
              Driver&apos;s license, professional licenses
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {documents.filter((d) => d.type === "License").length} documents
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
            <div className="mr-3 text-2xl">📤</div>
            <div>
              <p className="font-medium">Upload Document</p>
              <p className="text-sm text-gray-600">Add new document</p>
            </div>
          </button>

          <button className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
            <div className="mr-3 text-2xl">🔍</div>
            <div>
              <p className="font-medium">Verify Document</p>
              <p className="text-sm text-gray-600">Request verification</p>
            </div>
          </button>

          <button className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
            <div className="mr-3 text-2xl">📋</div>
            <div>
              <p className="font-medium">Download All</p>
              <p className="text-sm text-gray-600">Export documents</p>
            </div>
          </button>

          <button className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
            <div className="mr-3 text-2xl">🔄</div>
            <div>
              <p className="font-medium">Renew Expired</p>
              <p className="text-sm text-gray-600">Update documents</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
