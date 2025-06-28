"use client";

import Link from "next/link";
import { useState } from "react";

export default function BusinessPage() {
  const [businessData] = useState({
    activeBusinesses: 2,
    pendingApplications: 1,
    totalRevenue: 45000,
    taxObligations: 3200,
  });

  return (
    <div className="p-6">
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
