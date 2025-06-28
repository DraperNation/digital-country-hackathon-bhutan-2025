import React from "react";

const ApplyDocumentsPage = () => {
  const categories = [
    {
      name: "Personal & Family",
      icon: "👨‍👩‍👧‍👦",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
      documents: [
        "Birth Certificate",
        "Death Certificate",
        "Marriage Certificate",
      ],
    },
    {
      name: "Identity & Travel",
      icon: "🆔",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
      documents: ["National ID Card", "Passport", "Driver's License"],
    },
    {
      name: "Property & Land",
      icon: "🏠",
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-700",
      documents: [
        "Land Registration",
        "Property Tax Certificate",
        "Building Permit",
      ],
    },
    {
      name: "Business & Commerce",
      icon: "🏢",
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-700",
      documents: [
        "Business Registration",
        "Tax Clearance Certificate",
        "Import/Export License",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Apply by Category
        </h1>
        <p className="text-gray-600">
          Browse document categories and apply for the services you need.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`rounded-lg border-2 p-6 ${category.color} cursor-pointer transition-all duration-200 hover:shadow-lg`}
          >
            <div className="mb-4 text-3xl">{category.icon}</div>
            <h3 className={`mb-3 text-lg font-semibold ${category.textColor}`}>
              {category.name}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {category.documents.map((doc, docIndex) => (
                <li key={docIndex} className="flex items-center">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                  {doc}
                </li>
              ))}
            </ul>
            <button
              className={`mt-4 w-full rounded-lg px-4 py-2 ${category.textColor} border border-current bg-white text-sm font-medium transition-colors hover:bg-gray-50`}
            >
              Browse Documents
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Application Status</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Passport Application</p>
              <p className="text-sm text-gray-500">Submitted on Dec 12, 2024</p>
            </div>
            <span className="text-sm font-medium text-blue-600">
              Under Review
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyDocumentsPage;
