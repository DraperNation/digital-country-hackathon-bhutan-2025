"use client";
import React, { useState } from "react";
import { ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function ZKDemoPage() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      {/* Animated Banner */}
      <div className="animate-fade-in mb-8 flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <ShieldCheckIcon className="h-10 w-10 animate-bounce text-white" />
          <div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
              Advanced ZK-Proof Demo
            </h1>
            <p className="mt-1 text-white/90">
              Prove facts about yourself without revealing sensitive data. Try a
              zero-knowledge proof demo!
            </p>
          </div>
        </div>
        <SparklesIcon className="hidden h-12 w-12 animate-pulse text-white/70 md:block" />
      </div>

      {/* Feature Card */}
      <div className="animate-fade-in-up mx-auto max-w-xl rounded-2xl bg-white/90 p-8 shadow-xl ring-1 ring-purple-100 transition-transform duration-300 hover:scale-105">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-purple-700">
          <ShieldCheckIcon className="h-6 w-6 text-blue-500" />
          Zero-Knowledge Proof
        </h2>
        <p className="mb-4 text-gray-700">
          Demonstrate privacy-preserving proofs for selective disclosure, age
          verification, or credential validity without revealing sensitive data.
        </p>
        <button
          className="animate-wiggle rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition-all duration-200 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
          onClick={() => setShowModal(true)}
        >
          Run ZK-Proof Demo
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="animate-fade-in-up w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-blue-100">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-blue-700">
              <ShieldCheckIcon className="h-5 w-5 text-purple-500" /> ZK-Proof
              Result
            </h2>
            <p className="mb-2 text-gray-700">
              Proof: <span className="font-mono">0xabc123...zkp</span>
            </p>
            <p className="mb-2 flex items-center gap-1 font-semibold text-green-700">
              <span>✔️</span> Proof verified! You are over 18 and a Bhutanese
              citizen.
            </p>
            <button
              className="rounded bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 font-semibold text-white shadow transition-all duration-200 hover:from-purple-700 hover:to-blue-700"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

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
