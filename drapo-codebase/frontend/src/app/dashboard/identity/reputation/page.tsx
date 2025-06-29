"use client";

import React from "react";
import { StarIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

const mockReputation = {
  score: 87,
  badges: ["Community Helper", "Business Owner"],
  attestations: [
    {
      id: 1,
      type: "Education",
      issuer: "Ministry of Education",
      date: "2024-05-01",
    },
    { id: 2, type: "Business", issuer: "Trade Dept.", date: "2025-01-10" },
  ],
};

export default function ReputationPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 p-6">
      {/* Animated Banner */}
      <div className="animate-fade-in mb-8 flex items-center justify-between rounded-xl bg-gradient-to-r from-yellow-400 via-blue-500 to-purple-500 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <StarIcon className="h-10 w-10 animate-bounce text-white" />
          <div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
              Reputation & Attestations
            </h1>
            <p className="mt-1 text-white/90">
              Showcase your trust, badges, and verified credentials.
            </p>
          </div>
        </div>
        <CheckBadgeIcon className="hidden h-12 w-12 animate-pulse text-white/70 md:block" />
      </div>

      {/* Feature Card */}
      <div className="animate-fade-in-up mx-auto max-w-xl rounded-2xl bg-white/90 p-8 shadow-xl ring-1 ring-yellow-100 transition-transform duration-300 hover:scale-105">
        <div className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-700">
          <StarIcon className="h-6 w-6 text-yellow-500" /> Reputation Score:
          <span className="text-2xl text-yellow-600">
            {mockReputation.score}
          </span>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-blue-700">Badges:</span>{" "}
          {mockReputation.badges.map((b) => (
            <span
              key={b}
              className="mr-2 inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-blue-800 shadow-sm"
            >
              <CheckBadgeIcon className="h-4 w-4 text-yellow-500" /> {b}
            </span>
          ))}
        </div>
        <h2 className="mb-2 mt-6 flex items-center gap-2 text-lg font-semibold text-purple-700">
          <CheckBadgeIcon className="h-5 w-5 text-blue-500" /> Attestations
        </h2>
        <ul className="list-disc pl-6 text-gray-800">
          {mockReputation.attestations.map((a) => (
            <li key={a.id} className="mb-1">
              <span className="font-semibold">{a.type}</span> from {a.issuer}{" "}
              <span className="text-gray-500">({a.date})</span>
            </li>
          ))}
        </ul>
        <button className="animate-wiggle mt-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
          Request New Attestation
        </button>
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
