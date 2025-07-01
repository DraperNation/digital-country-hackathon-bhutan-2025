"use client";

import Link from "next/link";
import { useState } from "react";

export default function EResidencyPage() {
  const [stats] = useState({
    totalResidents: 1247,
    verifiedResidents: 1189,
    activeCompanies: 89,
    pendingApplications: 23,
    averageProcessingTime: "2.3 days",
    successRate: 95.3,
  });

  const [services] = useState([
    {
      title: "KYC Verification",
      description:
        "Complete identity verification with passport and biometric data",
      icon: "🔍",
      status: "Active",
      url: "/dashboard/eresidency/kyc",
      color: "blue",
    },
    {
      title: "Digital Identity",
      description:
        "Cryptographic identity credentials and verifiable credentials",
      icon: "🆔",
      status: "Active",
      url: "/dashboard/eresidency/identity",
      color: "green",
    },
    {
      title: "Company Incorporation",
      description:
        "Register and incorporate businesses with digital signatures",
      icon: "🏢",
      status: "Active",
      url: "/dashboard/eresidency/incorporation",
      color: "purple",
    },
    {
      title: "Tax ID Issuance",
      description: "Apply for and receive tax identification numbers",
      icon: "💰",
      status: "Active",
      url: "/dashboard/eresidency/tax",
      color: "orange",
    },
    {
      title: "Document Management",
      description: "Download official certificates and manage documents",
      icon: "📄",
      status: "Active",
      url: "/dashboard/eresidency/certificate",
      color: "indigo",
    },
  ]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          🏛️ eResidency Platform
        </h1>
        <p className="mt-2 text-gray-600">
          Digital identity, business services, and government integration for
          Bhutan&apos;s digital nation
        </p>
      </div>

      {/* Platform Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Residents</p>
              <p className="text-2xl font-bold">
                {stats.totalResidents.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Verified Residents</p>
              <p className="text-2xl font-bold">
                {stats.verifiedResidents.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Companies</p>
              <p className="text-2xl font-bold">{stats.activeCompanies}</p>
            </div>
            <div className="text-3xl">🏢</div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending Applications</p>
              <p className="text-2xl font-bold">{stats.pendingApplications}</p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg Processing Time</p>
              <p className="text-2xl font-bold">
                {stats.averageProcessingTime}
              </p>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Success Rate</p>
              <p className="text-2xl font-bold">{stats.successRate}%</p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          eResidency Services
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="mb-4 flex items-center">
                <div className="mr-3 text-3xl">{service.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              </div>
              <div className="mb-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    service.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {service.status}
                </span>
              </div>
              <Link
                href={service.url}
                className={`block w-full rounded py-2 text-center text-white hover:opacity-90 ${
                  service.color === "blue"
                    ? "bg-blue-600"
                    : service.color === "green"
                      ? "bg-green-600"
                      : service.color === "purple"
                        ? "bg-purple-600"
                        : service.color === "orange"
                          ? "bg-orange-600"
                          : "bg-indigo-600"
                }`}
              >
                Access Service
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Benefits */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Platform Benefits
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-3 font-medium text-gray-800">For Individuals</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Secure digital identity with cryptographic proof
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Access to government services 24/7
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Verifiable credentials for international use
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Reduced paperwork and processing time
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-medium text-gray-800">For Businesses</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Streamlined company incorporation process
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Digital tax compliance and reporting
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Access to international markets
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Blockchain-based document verification
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Getting Started
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <span className="text-xl font-bold">1</span>
            </div>
            <h4 className="font-medium text-gray-800">Complete KYC</h4>
            <p className="text-sm text-gray-600">
              Verify your identity with passport and biometrics
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <span className="text-xl font-bold">2</span>
            </div>
            <h4 className="font-medium text-gray-800">Get Digital ID</h4>
            <p className="text-sm text-gray-600">
              Receive your cryptographic identity credentials
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <span className="text-xl font-bold">3</span>
            </div>
            <h4 className="font-medium text-gray-800">Access Services</h4>
            <p className="text-sm text-gray-600">
              Use your digital identity for government services
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <span className="text-xl font-bold">4</span>
            </div>
            <h4 className="font-medium text-gray-800">Grow Business</h4>
            <p className="text-sm text-gray-600">
              Incorporate companies and expand operations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
