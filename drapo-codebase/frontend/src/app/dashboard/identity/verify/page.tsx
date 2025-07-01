"use client";

import React from "react";
import {
  MagnifyingGlassIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function CredentialVerifyPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      {/* Animated Banner */}
      <div className="animate-fade-in mb-8 flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <MagnifyingGlassIcon className="h-10 w-10 animate-bounce text-white" />
          <div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
              Verify Credential
            </h1>
            <p className="mt-1 text-white/90">
              Paste a verifiable credential below to check its authenticity.
            </p>
          </div>
        </div>
        <ShieldCheckIcon className="hidden h-12 w-12 animate-pulse text-white/70 md:block" />
      </div>

      {/* Feature Card */}
      <div className="animate-fade-in-up mx-auto max-w-xl rounded-2xl bg-white/90 p-8 shadow-xl ring-1 ring-green-100 transition-transform duration-300 hover:scale-105">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-blue-700">
          <MagnifyingGlassIcon className="h-6 w-6 text-green-500" /> Credential
          Verification
        </h2>
        <textarea
          className="mb-4 w-full rounded border p-2"
          rows={6}
          placeholder="Paste credential JSON here..."
        />
        <button className="animate-wiggle rounded-lg bg-gradient-to-r from-blue-600 to-green-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
          Verify
        </button>
        {/* Mock result */}
        <div className="animate-fade-in-up mt-6 flex items-center gap-2 rounded border border-green-200 bg-green-50 p-4">
          <ShieldCheckIcon className="h-6 w-6 text-green-600" />
          <span className="font-semibold text-green-700">
            ✔️ Credential is valid and authentic.
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
