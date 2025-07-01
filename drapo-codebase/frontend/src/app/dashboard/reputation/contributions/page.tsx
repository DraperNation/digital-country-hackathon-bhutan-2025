"use client";

export default function CommunityContributionsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          🎯 Community Contributions
        </h1>
        <p className="mt-2 text-gray-600">
          Track your community contributions and volunteer activities
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Contribution Tracking
        </h2>
        <p className="text-gray-600">
          This page will track your contributions including:
        </p>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li>• Volunteer work and community service</li>
          <li>• Educational contributions and mentoring</li>
          <li>• Business and economic contributions</li>
          <li>• Cultural and social activities</li>
          <li>• Reputation points earned</li>
        </ul>
      </div>
    </div>
  );
}
