"use client";

import React from "react";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const mockLog = [
  {
    id: 1,
    action: "Issued Passport Credential",
    date: "2025-06-01",
    status: "Success",
  },
  {
    id: 2,
    action: "Shared KYC Credential",
    date: "2025-06-10",
    status: "Success",
  },
  {
    id: 3,
    action: "Revoked Business License",
    date: "2025-06-15",
    status: "Revoked",
  },
];

export default function AuditLogPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 p-6">
      {/* Animated Banner */}
      <div className="animate-fade-in mb-8 flex items-center justify-between rounded-xl bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <ClipboardDocumentListIcon className="h-10 w-10 animate-bounce text-white" />
          <div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
              User Activity & Audit Log
            </h1>
            <p className="mt-1 text-white/90">
              Track all your identity and credential actions for transparency
              and security.
            </p>
          </div>
        </div>
        <ClockIcon className="hidden h-12 w-12 animate-pulse text-white/70 md:block" />
      </div>

      {/* Feature Card */}
      <div className="animate-fade-in-up mx-auto max-w-2xl rounded-2xl bg-white/90 p-8 shadow-xl ring-1 ring-pink-100 transition-transform duration-300 hover:scale-105">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-pink-700">
          <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500" /> Audit
          Log
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full rounded border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Action</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockLog.map((log) => (
                <tr
                  key={log.id}
                  className="border-t transition-colors hover:bg-pink-50"
                >
                  <td className="p-2 font-mono text-blue-700">{log.date}</td>
                  <td className="p-2">{log.action}</td>
                  <td
                    className={`p-2 font-semibold ${
                      log.status === "Success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {log.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        .animate-fade-in { animation: fade-in 0.8s ease; }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
}
