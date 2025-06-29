"use client";

import React from "react";

const mockOrgs = [
  { id: 1, name: "Bhutan Tech Solutions Pvt Ltd", members: 12, issued: 5 },
  { id: 2, name: "Himalayan Exports", members: 7, issued: 2 },
];

export default function OrganizationDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">🏢 Organization Dashboard</h1>
      <p className="mb-4 text-gray-600">
        Manage your organizations, members, and issued credentials.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {mockOrgs.map((org) => (
          <div key={org.id} className="rounded border bg-white p-4 shadow">
            <h2 className="mb-2 text-xl font-semibold">{org.name}</h2>
            <div className="mb-2">
              Members: <span className="font-bold">{org.members}</span>
            </div>
            <div className="mb-2">
              Credentials Issued:{" "}
              <span className="font-bold">{org.issued}</span>
            </div>
            <button className="rounded bg-blue-600 px-4 py-2 text-white">
              Manage Members
            </button>
            <button className="ml-2 rounded bg-green-600 px-4 py-2 text-white">
              Issue Credential
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
