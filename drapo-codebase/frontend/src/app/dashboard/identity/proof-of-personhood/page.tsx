"use client";

import React from "react";
import { UserIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function ProofOfPersonhoodPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      {/* Animated Banner */}
      <div className="animate-fade-in mb-8 flex items-center justify-between rounded-xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <UserIcon className="h-10 w-10 animate-bounce text-white" />
          <div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
              Proof of Personhood
            </h1>
            <p className="mt-1 text-white/90">
              Request a Proof-of-Personhood credential after biometric or
              document verification.
            </p>
          </div>
        </div>
        <CheckCircleIcon className="hidden h-12 w-12 animate-pulse text-white/70 md:block" />
      </div>

      {/* Feature Card */}
      <div className="animate-fade-in-up mx-auto max-w-xl rounded-2xl bg-white/90 p-8 shadow-xl ring-1 ring-green-100 transition-transform duration-300 hover:scale-105">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-green-700">
          <UserIcon className="h-6 w-6 text-blue-500" /> Proof-of-Personhood
          Credential
        </h2>
        <button className="animate-wiggle rounded-lg bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2">
          Request PoP Credential
        </button>
        {/* Mock badge */}
        <div className="animate-fade-in-up mt-6 flex items-center gap-2">
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 font-semibold text-green-800">
            PoP Verified
          </span>
          <span className="text-gray-500">
            (You have a valid Proof-of-Personhood credential)
          </span>
        </div>
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
