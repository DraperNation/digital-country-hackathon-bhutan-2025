"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface DashboardStats {
  walletBalance: number;
  recentTransactions: number;
  didStatus: string;
  reputationScore: number;
  businessCount: number;
  aiQueries: number;
  notifications: number;
  attestations: number;
  kycStatus: string;
  eresidencyStatus: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    walletBalance: 1250.75,
    recentTransactions: 8,
    didStatus: "Verified",
    reputationScore: 847,
    businessCount: 2,
    aiQueries: 15,
    notifications: 3,
    attestations: 12,
    kycStatus: "Completed",
    eresidencyStatus: "Active",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, Citizen! 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your digital identity, wallet, reputation, and government
          services all in one place
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Wallet Balance</p>
              <p className="text-2xl font-bold">
                ${stats.walletBalance.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">💳</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">DID Status</p>
              <p className="text-lg font-bold">{stats.didStatus}</p>
            </div>
            <div className="text-3xl">🆔</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Reputation Score</p>
              <p className="text-2xl font-bold">{stats.reputationScore}</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Attestations</p>
              <p className="text-2xl font-bold">{stats.attestations}</p>
            </div>
            <div className="text-3xl">🔗</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">My Businesses</p>
              <p className="text-2xl font-bold">{stats.businessCount}</p>
            </div>
            <div className="text-3xl">🏢</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Recent Transactions</p>
              <p className="text-2xl font-bold">{stats.recentTransactions}</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">AI Queries Today</p>
              <p className="text-2xl font-bold">{stats.aiQueries}</p>
            </div>
            <div className="text-3xl">🤖</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Notifications</p>
              <p className="text-2xl font-bold">{stats.notifications}</p>
            </div>
            <div className="text-3xl">🔔</div>
          </div>
        </div>
      </div>

      {/* Main Services */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          My Services
        </h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Digital Wallet */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">💳</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">My Wallet</h3>
                <p className="text-sm text-gray-600">
                  Manage your digital currency
                </p>
              </div>
            </div>
            <p className="mb-4 text-gray-700">
              Send and receive payments, view transaction history, and exchange
              currencies using Bhutan&apos;s secure digital wallet system.
            </p>
            <div className="mb-4 flex items-center justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Current Balance:</span>
              <span className="text-xl font-bold text-green-600">
                ${stats.walletBalance.toLocaleString()}
              </span>
            </div>
            <div className="space-y-2">
              <Link
                href="/dashboard/wallet/transfer"
                className="block rounded bg-blue-50 p-3 text-blue-700 hover:bg-blue-100"
              >
                💸 Send Money
              </Link>
              <Link
                href="/dashboard/wallet/transactions"
                className="block rounded bg-green-50 p-3 text-green-700 hover:bg-green-100"
              >
                📊 View Transactions
              </Link>
              <Link
                href="/dashboard/wallet/exchange"
                className="block rounded bg-purple-50 p-3 text-purple-700 hover:bg-purple-100"
              >
                💱 Exchange Currency
              </Link>
            </div>
          </div>

          {/* Digital Identity */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">🆔</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Digital Identity
                </h3>
                <p className="text-sm text-gray-600">
                  Your secure digital identity
                </p>
              </div>
            </div>
            <p className="mb-4 text-gray-700">
              Access your Decentralized Identifier (DID), verifiable
              credentials, and digital passport for secure identity
              verification.
            </p>
            <div className="mb-4 flex items-center justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">DID Status:</span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                {stats.didStatus}
              </span>
            </div>
            <div className="space-y-2">
              <Link
                href="/dashboard/identity/did"
                className="block rounded bg-blue-50 p-3 text-blue-700 hover:bg-blue-100"
              >
                🆔 My DID
              </Link>
              <Link
                href="/dashboard/identity/passport"
                className="block rounded bg-green-50 p-3 text-green-700 hover:bg-green-100"
              >
                🛂 Digital Passport
              </Link>
              <Link
                href="/dashboard/identity/credentials"
                className="block rounded bg-purple-50 p-3 text-purple-700 hover:bg-purple-100"
              >
                📜 Verifiable Credentials
              </Link>
              <Link
                href="/dashboard/identity/kyc"
                className="block rounded bg-orange-50 p-3 text-orange-700 hover:bg-orange-100"
              >
                🔍 KYC Verification
              </Link>
            </div>
          </div>

          {/* Reputation & Trust */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">⭐</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Reputation & Trust
                </h3>
                <p className="text-sm text-gray-600">
                  Build your social credibility
                </p>
              </div>
            </div>
            <p className="mb-4 text-gray-700">
              Earn reputation points through community contributions, get
              attestations, and build proof-of-personhood for enhanced
              opportunities.
            </p>
            <div className="mb-4 flex items-center justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Reputation Score:</span>
              <span className="text-xl font-bold text-yellow-600">
                {stats.reputationScore}
              </span>
            </div>
            <div className="space-y-2">
              <Link
                href="/dashboard/reputation/score"
                className="block rounded bg-blue-50 p-3 text-blue-700 hover:bg-blue-100"
              >
                📊 My Score
              </Link>
              <Link
                href="/dashboard/reputation/pop"
                className="block rounded bg-green-50 p-3 text-green-700 hover:bg-green-100"
              >
                👤 Proof of Personhood
              </Link>
              <Link
                href="/dashboard/reputation/attestations"
                className="block rounded bg-purple-50 p-3 text-purple-700 hover:bg-purple-100"
              >
                🔗 Attestations
              </Link>
            </div>
          </div>

          {/* eResidency */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">🏛️</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">eResidency</h3>
                <p className="text-sm text-gray-600">
                  Digital residency services
                </p>
              </div>
            </div>
            <p className="mb-4 text-gray-700">
              Access digital residency services including certificates, identity
              management, and business incorporation for international citizens.
            </p>
            <div className="mb-4 flex items-center justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Status:</span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                {stats.eresidencyStatus}
              </span>
            </div>
            <div className="space-y-2">
              <Link
                href="/dashboard/eresidency/certificate"
                className="block rounded bg-blue-50 p-3 text-blue-700 hover:bg-blue-100"
              >
                📜 Digital Certificate
              </Link>
              <Link
                href="/dashboard/eresidency/incorporation"
                className="block rounded bg-green-50 p-3 text-green-700 hover:bg-green-100"
              >
                🏢 Business Incorporation
              </Link>
              <Link
                href="/dashboard/eresidency/kyc"
                className="block rounded bg-purple-50 p-3 text-purple-700 hover:bg-purple-100"
              >
                🔍 eResidency KYC
              </Link>
            </div>
          </div>

          {/* Business Services */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">🏢</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Business Services
                </h3>
                <p className="text-sm text-gray-600">Manage your businesses</p>
              </div>
            </div>
            <p className="mb-4 text-gray-700">
              Register new companies, manage tax obligations, and handle all
              business-related documents through our streamlined digital
              platform.
            </p>
            <div className="mb-4 flex items-center justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Active Businesses:</span>
              <span className="text-xl font-bold text-blue-600">
                {stats.businessCount}
              </span>
            </div>
            <div className="space-y-2">
              <Link
                href="/dashboard/business/register"
                className="block rounded bg-blue-50 p-3 text-blue-700 hover:bg-blue-100"
              >
                🆕 Register Company
              </Link>
              <Link
                href="/dashboard/business/tax"
                className="block rounded bg-green-50 p-3 text-green-700 hover:bg-green-100"
              >
                💰 Tax Services
              </Link>
              <Link
                href="/dashboard/business/documents"
                className="block rounded bg-purple-50 p-3 text-purple-700 hover:bg-purple-100"
              >
                📋 Business Documents
              </Link>
            </div>
          </div>

          {/* AI Assistant */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">🤖</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  AI Assistant
                </h3>
                <p className="text-sm text-gray-600">Get help anytime</p>
              </div>
            </div>
            <p className="mb-4 text-gray-700">
              Ask questions about government services, get legal help, and
              receive assistance in Dzongkha or English through our AI-powered
              assistant.
            </p>
            <div className="mb-4 flex items-center justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Queries Today:</span>
              <span className="text-xl font-bold text-purple-600">
                {stats.aiQueries}
              </span>
            </div>
            <div className="space-y-2">
              <Link
                href="/dashboard/assistant/chat"
                className="block rounded bg-blue-50 p-3 text-blue-700 hover:bg-blue-100"
              >
                💬 Ask Questions
              </Link>
              <Link
                href="/dashboard/assistant/legal"
                className="block rounded bg-green-50 p-3 text-green-700 hover:bg-green-100"
              >
                ⚖️ Legal Help
              </Link>
              <Link
                href="/dashboard/assistant/dzongkha"
                className="block rounded bg-purple-50 p-3 text-purple-700 hover:bg-purple-100"
              >
                🇧🇹 Dzongkha Support
              </Link>
            </div>
          </div>

          {/* Documents & Certificates */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">📋</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Documents & Certificates
                </h3>
                <p className="text-sm text-gray-600">
                  Manage official documents
                </p>
              </div>
            </div>
            <p className="mb-4 text-gray-700">
              Request, apply for, and manage all your official government
              documents, certificates, and forms in one centralized location.
            </p>
            <div className="mb-4 flex items-center justify-between rounded bg-gray-50 p-3">
              <span className="font-medium">Active Documents:</span>
              <span className="text-xl font-bold text-indigo-600">5</span>
            </div>
            <div className="space-y-2">
              <Link
                href="/dashboard/documents/request"
                className="block rounded bg-blue-50 p-3 text-blue-700 hover:bg-blue-100"
              >
                📄 Request Documents
              </Link>
              <Link
                href="/dashboard/documents/apply"
                className="block rounded bg-green-50 p-3 text-green-700 hover:bg-green-100"
              >
                📁 Apply by Category
              </Link>
              <Link
                href="/dashboard/documents/esign"
                className="block rounded bg-purple-50 p-3 text-purple-700 hover:bg-purple-100"
              >
                ✍️ eSign Documents
              </Link>
              <Link
                href="/dashboard/documents/issued"
                className="block rounded bg-orange-50 p-3 text-orange-700 hover:bg-orange-100"
              >
                📋 My Issued Documents
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/wallet/transfer"
            className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="mr-3 text-2xl">💸</div>
            <div>
              <p className="font-medium">Send Money</p>
              <p className="text-sm text-gray-600">Transfer to anyone</p>
            </div>
          </Link>

          <Link
            href="/dashboard/identity/did"
            className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="mr-3 text-2xl">🆔</div>
            <div>
              <p className="font-medium">View DID</p>
              <p className="text-sm text-gray-600">Check your identifier</p>
            </div>
          </Link>

          <Link
            href="/dashboard/reputation/score"
            className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="mr-3 text-2xl">⭐</div>
            <div>
              <p className="font-medium">Reputation</p>
              <p className="text-sm text-gray-600">Check score</p>
            </div>
          </Link>

          <Link
            href="/dashboard/assistant/chat"
            className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="mr-3 text-2xl">🤖</div>
            <div>
              <p className="font-medium">Get Help</p>
              <p className="text-sm text-gray-600">Ask AI assistant</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
