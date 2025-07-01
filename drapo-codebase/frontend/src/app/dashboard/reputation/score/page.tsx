"use client";

export default function ReputationScorePage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          📊 My Reputation Score
        </h1>
        <p className="mt-2 text-gray-600">
          Detailed breakdown of your reputation score and factors that influence
          it
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Reputation Score Details
        </h2>
        <p className="text-gray-600">
          This page will show detailed analytics of your reputation score,
          including:
        </p>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li>• Score breakdown by category</li>
          <li>• Historical score progression</li>
          <li>• Factors affecting your score</li>
          <li>• Comparison with other citizens</li>
          <li>• Recommendations for improvement</li>
        </ul>
      </div>
    </div>
  );
}
