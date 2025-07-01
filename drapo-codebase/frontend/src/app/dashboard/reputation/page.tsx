"use client";

import Link from "next/link";
import { useState } from "react";

export default function ReputationPage() {
  const [reputationData] = useState({
    score: 847,
    level: "Trusted Citizen",
    attestations: 12,
    contributions: 8,
    proofOfPersonhood: "Verified",
    lastUpdated: "2024-01-15",
  });

  const [recentAttestations] = useState([
    {
      id: 1,
      issuer: "Bhutan Education Board",
      type: "Education Certificate",
      date: "2024-01-10",
      status: "verified",
    },
    {
      id: 2,
      issuer: "Community Service Org",
      type: "Volunteer Work",
      date: "2024-01-08",
      status: "verified",
    },
    {
      id: 3,
      issuer: "Local Government",
      type: "Tax Compliance",
      date: "2024-01-05",
      status: "verified",
    },
  ]);

  const [contributions] = useState([
    {
      id: 1,
      type: "Community Service",
      description: "Volunteered at local school",
      points: 50,
      date: "2024-01-12",
    },
    {
      id: 2,
      type: "Education",
      description: "Completed advanced certification",
      points: 100,
      date: "2024-01-10",
    },
    {
      id: 3,
      type: "Business",
      description: "Registered new company",
      points: 75,
      date: "2024-01-08",
    },
  ]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          ⭐ Reputation & Trust System
        </h1>
        <p className="mt-2 text-gray-600">
          Build your social credibility through proof-of-personhood and
          community contributions
        </p>
      </div>

      {/* Reputation Overview */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Reputation Score</p>
              <p className="text-2xl font-bold">{reputationData.score}</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Trust Level</p>
              <p className="text-lg font-bold">{reputationData.level}</p>
            </div>
            <div className="text-3xl">🛡️</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Attestations</p>
              <p className="text-2xl font-bold">
                {reputationData.attestations}
              </p>
            </div>
            <div className="text-3xl">🔗</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Contributions</p>
              <p className="text-2xl font-bold">
                {reputationData.contributions}
              </p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
        </div>
      </div>

      {/* Reputation Services */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Reputation Services
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/reputation/score"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">📊</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  My Reputation Score
                </h3>
                <p className="text-sm text-gray-600">View detailed breakdown</p>
              </div>
            </div>
            <p className="text-gray-700">
              See your reputation score breakdown, history, and factors that
              influence your trust level.
            </p>
          </Link>

          <Link
            href="/dashboard/reputation/pop"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">👤</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Proof of Personhood
                </h3>
                <p className="text-sm text-gray-600">Verify your identity</p>
              </div>
            </div>
            <p className="text-gray-700">
              Complete proof-of-personhood verification using AI-powered facial
              recognition and biometrics.
            </p>
          </Link>

          <Link
            href="/dashboard/reputation/attestations"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">🔗</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Attestations
                </h3>
                <p className="text-sm text-gray-600">
                  Manage verifiable credentials
                </p>
              </div>
            </div>
            <p className="text-gray-700">
              View and manage your verifiable credentials issued by trusted
              organizations and institutions.
            </p>
          </Link>

          <Link
            href="/dashboard/reputation/contributions"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">🎯</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Community Contributions
                </h3>
                <p className="text-sm text-gray-600">Track your impact</p>
              </div>
            </div>
            <p className="text-gray-700">
              Track your community contributions, volunteer work, and activities
              that build reputation.
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Attestations */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Recent Attestations
        </h3>
        <div className="space-y-4">
          {recentAttestations.map((attestation) => (
            <div
              key={attestation.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-center">
                <div className="mr-3 rounded-full bg-green-100 p-2 text-green-600">
                  ✓
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {attestation.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    Issued by {attestation.issuer}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  {attestation.status}
                </span>
                <span className="text-sm text-gray-500">
                  {attestation.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Contributions */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Recent Contributions
        </h3>
        <div className="space-y-4">
          {contributions.map((contribution) => (
            <div
              key={contribution.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-center">
                <div className="mr-3 rounded-full bg-blue-100 p-2 text-blue-600">
                  🎯
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {contribution.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    {contribution.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  +{contribution.points} pts
                </span>
                <span className="text-sm text-gray-500">
                  {contribution.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reputation Benefits */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Benefits of High Reputation
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-3 font-medium text-gray-800">For Individuals</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Access to premium government services
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Priority processing for applications
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Scholarship and funding opportunities
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Enhanced trust in business transactions
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-medium text-gray-800">For Businesses</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Faster business registration approval
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Access to government contracts
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Reduced compliance requirements
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Enhanced credibility with partners
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
