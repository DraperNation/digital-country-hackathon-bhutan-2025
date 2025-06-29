"use client";

import React, { useState } from "react";
import { SparklesIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function SelectiveDisclosurePage() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Animated Banner */}
      <div className="animate-fade-in mb-8 flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <SparklesIcon className="h-10 w-10 animate-bounce text-white" />
          <div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
              Selective Disclosure Demo
            </h1>
            <p className="mt-1 text-white/90">
              Share only what you want, when you want. Experience
              privacy-preserving proofs in action!
            </p>
          </div>
        </div>
        <EyeIcon className="hidden h-12 w-12 animate-pulse text-white/70 md:block" />
      </div>

      {/* Feature Card */}
      <div className="animate-fade-in-up mx-auto max-w-xl rounded-2xl bg-white/90 p-8 shadow-xl ring-1 ring-blue-100 transition-transform duration-300 hover:scale-105">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-blue-700">
          <SparklesIcon className="h-6 w-6 text-purple-500" />
          Selective Attribute Sharing
        </h2>
        <p className="mb-4 text-gray-700">
          Demonstrate how you can share only specific attributes from your
          credentials using zero-knowledge proofs. Click below to try!
        </p>
        <button
          className="animate-wiggle rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          onClick={() => setShowModal(true)}
        >
          <span role="img" aria-label="key">
            🔑
          </span>{" "}
          Share Age & Citizenship Only
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="animate-fade-in-up w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-purple-100">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-purple-700">
              <EyeIcon className="h-5 w-5 text-blue-500" /> Selective Disclosure
            </h2>
            <p className="mb-2 text-gray-700">You are sharing:</p>
            <ul className="mb-4 list-disc pl-6 text-gray-800">
              <li>
                Age:{" "}
                <span className="font-semibold" aria-label="user age">
                  34
                </span>
              </li>
              <li>
                Citizenship:{" "}
                <span className="font-semibold" aria-label="user citizenship">
                  Bhutanese
                </span>
              </li>
            </ul>
            <button
              className="rounded bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-semibold text-white shadow transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-wiggle {
          animation: wiggle 1.2s infinite alternate;
        }
      `}</style>
    </div>
  );
}
