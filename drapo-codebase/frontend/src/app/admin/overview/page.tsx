"use client";

import { useState } from "react";

export default function AdminOverviewPage() {
  const [stats] = useState({
    totalUsers: 15420,
    activeUsers: 12340,
    totalDIDs: 15420,
    verifiedDIDs: 14200,
    totalReputation: 847000,
    avgReputation: 847,
    totalAttestations: 45600,
    smartContracts: 25,
    totalTransactions: 89200,
    totalBusinesses: 3400,
    aiQueries: 15600,
    systemHealth: "Excellent",
    pendingKYC: 23,
    pendingBusiness: 15,
    btcReserves: 1000.1234,
    stablecoinSupply: 800.0,
  });

  const [recentActivity] = useState([
    {
      id: 1,
      type: "DID Verification",
      user: "Citizen #12345",
      action: "Identity verified",
      time: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      type: "KYC Approval",
      user: "Citizen #12346",
      action: "KYC completed",
      time: "5 minutes ago",
      status: "success",
    },
    {
      id: 3,
      type: "Reputation Update",
      user: "Citizen #12347",
      action: "Score increased by 50",
      time: "10 minutes ago",
      status: "success",
    },
    {
      id: 4,
      type: "Business Registration",
      user: "Citizen #12348",
      action: "New company registered",
      time: "15 minutes ago",
      status: "pending",
    },
    {
      id: 5,
      type: "Smart Contract",
      user: "System",
      action: "New attestation issued",
      time: "20 minutes ago",
      status: "success",
    },
  ]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📊 System Overview</h1>
        <p className="mt-2 text-gray-600">
          Monitor the E-Bhutan digital identity and citizenship platform
        </p>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Users</p>
              <p className="text-2xl font-bold">
                {stats.totalUsers.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Verified DIDs</p>
              <p className="text-2xl font-bold">
                {stats.verifiedDIDs.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">🆔</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Reputation</p>
              <p className="text-2xl font-bold">
                {stats.totalReputation.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Smart Contracts</p>
              <p className="text-2xl font-bold">{stats.smartContracts}</p>
            </div>
            <div className="text-3xl">🔗</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Transactions</p>
              <p className="text-2xl font-bold">
                {stats.totalTransactions.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">💳</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Users</p>
              <p className="text-2xl font-bold">
                {stats.activeUsers.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">🟢</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Businesses</p>
              <p className="text-2xl font-bold">
                {stats.totalBusinesses.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">🏢</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">AI Queries</p>
              <p className="text-2xl font-bold">
                {stats.aiQueries.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">🤖</div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          System Health
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-green-50 p-4">
            <div className="flex items-center">
              <div className="mr-3 text-2xl">🟢</div>
              <div>
                <p className="font-medium text-green-800">Overall Status</p>
                <p className="text-sm text-green-600">{stats.systemHealth}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-center">
              <div className="mr-3 text-2xl">📊</div>
              <div>
                <p className="font-medium text-blue-800">Avg Reputation</p>
                <p className="text-sm text-blue-600">
                  {stats.avgReputation} points
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-purple-50 p-4">
            <div className="flex items-center">
              <div className="mr-3 text-2xl">🔗</div>
              <div>
                <p className="font-medium text-purple-800">Attestations</p>
                <p className="text-sm text-purple-600">
                  {stats.totalAttestations.toLocaleString()} issued
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Pending Approvals
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-yellow-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-yellow-800">KYC Approvals</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pendingKYC}
                </p>
              </div>
              <div className="text-2xl">🔍</div>
            </div>
          </div>

          <div className="rounded-lg bg-orange-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-orange-800">
                  Business Registrations
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.pendingBusiness}
                </p>
              </div>
              <div className="text-2xl">🏢</div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-800">BTC Reserves</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.btcReserves.toFixed(4)} BTC
                </p>
              </div>
              <div className="text-2xl">₿</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-center">
                <div
                  className={`mr-3 rounded-full p-2 ${
                    activity.status === "success"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {activity.status === "success" ? "✓" : "⏳"}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{activity.type}</p>
                  <p className="text-sm text-gray-600">
                    {activity.user} - {activity.action}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
            <div className="mr-3 text-2xl">👥</div>
            <div>
              <p className="font-medium">User Management</p>
              <p className="text-sm text-gray-600">Manage citizens</p>
            </div>
          </button>

          <button className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
            <div className="mr-3 text-2xl">🔍</div>
            <div>
              <p className="font-medium">KYC Approvals</p>
              <p className="text-sm text-gray-600">
                {stats.pendingKYC} pending
              </p>
            </div>
          </button>

          <button className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
            <div className="mr-3 text-2xl">⭐</div>
            <div>
              <p className="font-medium">Reputation System</p>
              <p className="text-sm text-gray-600">Monitor scores</p>
            </div>
          </button>

          <button className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
            <div className="mr-3 text-2xl">🔗</div>
            <div>
              <p className="font-medium">Smart Contracts</p>
              <p className="text-sm text-gray-600">Manage contracts</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
