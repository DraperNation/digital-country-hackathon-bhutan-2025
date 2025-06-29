"use client";

import React from "react";

const mockIssued = [
  {
    id: 1,
    type: "Employment",
    recipient: "Sonam Wangmo",
    date: "2025-06-01",
    status: "Active",
  },
  {
    id: 2,
    type: "Business License",
    recipient: "Himalayan Exports",
    date: "2025-06-10",
    status: "Revoked",
  },
];

export default function BusinessIssuedCredentialsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">
        🏢 Business-Issued Credentials
      </h1>
      <p className="mb-4 text-gray-600">
        View and manage credentials your business has issued to employees,
        partners, or other organizations.
      </p>
      <table className="w-full rounded border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Recipient</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockIssued.map((cred) => (
            <tr key={cred.id} className="border-t">
              <td className="p-2">{cred.type}</td>
              <td className="p-2">{cred.recipient}</td>
              <td className="p-2">{cred.date}</td>
              <td className="p-2">{cred.status}</td>
              <td className="p-2">
                <button className="mr-2 text-blue-600 underline">View</button>
                <button className="text-red-600 underline">Revoke</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-6 rounded bg-blue-600 px-4 py-2 text-white">
        Issue New Credential
      </button>
    </div>
  );
}
