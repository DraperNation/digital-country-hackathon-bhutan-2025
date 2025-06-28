import React from "react";
import Link from "next/link";

const DocumentsPage = () => {
  const documentServices = [
    {
      title: "Request Documents",
      description: "Request official government documents and certificates",
      icon: "📄",
      url: "/dashboard/documents/request",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
    },
    {
      title: "Apply by Category",
      description: "Browse and apply for documents by category",
      icon: "📁",
      url: "/dashboard/documents/apply",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
    },
    {
      title: "eSign Documents",
      description: "Electronically sign official documents",
      icon: "✍️",
      url: "/dashboard/documents/esign",
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-700",
    },
    {
      title: "My Issued Documents",
      description: "View and manage all your issued documents",
      icon: "📋",
      url: "/dashboard/documents/issued",
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-700",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Documents & Certificates
        </h1>
        <p className="text-gray-600">
          Manage all your official documents, certificates, and government
          services in one place.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {documentServices.map((service, index) => (
          <Link
            key={index}
            href={service.url}
            className={`block rounded-lg border-2 p-6 ${service.color} transition-all duration-200 hover:shadow-lg`}
          >
            <div className="mb-4 text-3xl">{service.icon}</div>
            <h3 className={`mb-2 text-lg font-semibold ${service.textColor}`}>
              {service.title}
            </h3>
            <p className="text-sm text-gray-600">{service.description}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <span className="text-green-600">✓</span>
              </div>
              <div>
                <p className="font-medium">Birth Certificate</p>
                <p className="text-sm text-gray-500">Issued on Dec 15, 2024</p>
              </div>
            </div>
            <span className="text-sm font-medium text-green-600">Active</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <span className="text-blue-600">📄</span>
              </div>
              <div>
                <p className="font-medium">Tax Clearance Certificate</p>
                <p className="text-sm text-gray-500">Pending approval</p>
              </div>
            </div>
            <span className="text-sm font-medium text-blue-600">
              Processing
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <span className="text-purple-600">✍️</span>
              </div>
              <div>
                <p className="font-medium">Property Registration</p>
                <p className="text-sm text-gray-500">Ready for eSign</p>
              </div>
            </div>
            <span className="text-sm font-medium text-purple-600">
              Action Required
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
