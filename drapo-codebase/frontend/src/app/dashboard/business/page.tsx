"use client";

import Link from "next/link";
import { useState } from "react";

const mockBusinesses = [
  {
    name: "Bhutan Tech Solutions Pvt Ltd",
    registrationNumber: "BTN-2023-001",
    status: "Verified",
    type: "Private Limited",
    incorporationDate: "2023-04-15",
    address: "Thimphu, Bhutan",
    directors: ["Karma Dorji", "Sonam Wangmo"],
    email: "info@bhutantech.bt",
    phone: "+975-2-123456",
  },
  {
    name: "Himalayan Exports",
    registrationNumber: "BTN-2022-045",
    status: "Verified",
    type: "Export Business",
    incorporationDate: "2022-09-10",
    address: "Phuentsholing, Bhutan",
    directors: ["Jigme Tenzin"],
    email: "contact@himalayanexports.bt",
    phone: "+975-5-654321",
  },
];

export default function BusinessPage() {
  const [businessData] = useState({
    activeBusinesses: 2,
    pendingApplications: 1,
    totalRevenue: 45000,
    taxObligations: 3200,
  });

  return (
    <div className="p-6">
      {/* My Business Section */}
      <div className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-800">
          <span>🏢</span> My Business
        </h2>
        {mockBusinesses.length === 0 ? (
          <div className="text-gray-500">You have no verified businesses.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {mockBusinesses.map((biz) => (
              <div
                key={biz.registrationNumber}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-blue-800">
                    {biz.name}
                  </h3>
                  <span className="rounded bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {biz.status}
                  </span>
                </div>
                <div className="mb-2 text-sm text-gray-700">
                  Reg. No:{" "}
                  <span className="font-mono">{biz.registrationNumber}</span>
                </div>
                <div className="mb-2 text-sm text-gray-700">
                  Type: {biz.type}
                </div>
                <div className="mb-2 text-sm text-gray-700">
                  Incorporated: {biz.incorporationDate}
                </div>
                <div className="mb-2 text-sm text-gray-700">
                  Address: {biz.address}
                </div>
                <div className="mb-2 text-sm text-gray-700">
                  Directors: {biz.directors.join(", ")}
                </div>
                <div className="mb-2 text-sm text-gray-700">
                  Email:{" "}
                  <a
                    href={`mailto:${biz.email}`}
                    className="text-blue-600 underline"
                  >
                    {biz.email}
                  </a>
                </div>
                <div className="mb-2 text-sm text-gray-700">
                  Phone:{" "}
                  <a
                    href={`tel:${biz.phone}`}
                    className="text-blue-600 underline"
                  >
                    {biz.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          🏢 My Business Services
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your companies, tax obligations, and business documents
        </p>
      </div>

      {/* Business Stats */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Businesses</p>
              <p className="text-2xl font-bold">
                {businessData.activeBusinesses}
              </p>
            </div>
            <div className="text-3xl">🏢</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-2xl font-bold">
                ${businessData.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Tax Obligations</p>
              <p className="text-2xl font-bold">
                ${businessData.taxObligations.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending Applications</p>
              <p className="text-2xl font-bold">
                {businessData.pendingApplications}
              </p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Business Services */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Business Services
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/business/register"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">🆕</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Register Company
                </h3>
                <p className="text-sm text-gray-600">Start a new business</p>
              </div>
            </div>
            <p className="text-gray-700">
              Register a new company with digital signatures and instant
              verification.
            </p>
          </Link>

          <Link
            href="/dashboard/business/tax"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">💰</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Tax Services
                </h3>
                <p className="text-sm text-gray-600">Manage tax obligations</p>
              </div>
            </div>
            <p className="text-gray-700">
              File taxes, view obligations, and manage compliance requirements.
            </p>
          </Link>

          <Link
            href="/dashboard/business/documents"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">📋</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Business Documents
                </h3>
                <p className="text-sm text-gray-600">Manage documents</p>
              </div>
            </div>
            <p className="text-gray-700">
              Access and manage all your business-related documents and
              certificates.
            </p>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/business/register"
            className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="mr-3 text-2xl">🆕</div>
            <div>
              <p className="font-medium">New Business</p>
              <p className="text-sm text-gray-600">Register company</p>
            </div>
          </Link>

          <Link
            href="/dashboard/business/tax"
            className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="mr-3 text-2xl">💰</div>
            <div>
              <p className="font-medium">Pay Taxes</p>
              <p className="text-sm text-gray-600">File tax returns</p>
            </div>
          </Link>

          <Link
            href="/dashboard/business/documents"
            className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="mr-3 text-2xl">📋</div>
            <div>
              <p className="font-medium">Documents</p>
              <p className="text-sm text-gray-600">View & manage</p>
            </div>
          </Link>

          <Link
            href="/dashboard/assistant/chat"
            className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="mr-3 text-2xl">🤖</div>
            <div>
              <p className="font-medium">Get Help</p>
              <p className="text-sm text-gray-600">Business advice</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
