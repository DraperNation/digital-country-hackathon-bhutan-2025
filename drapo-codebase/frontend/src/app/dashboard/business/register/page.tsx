import React from "react";

const BusinessRegisterPage = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Business Registration
        </h1>
        <p className="text-gray-600">
          Register your business and obtain official business credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Business Information</h2>
          <form className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                placeholder="Enter business name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Business Type
              </label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                <option>Select business type</option>
                <option>Sole Proprietorship</option>
                <option>Partnership</option>
                <option>Private Limited Company</option>
                <option>Public Limited Company</option>
                <option>Cooperative</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Business Address
              </label>
              <textarea
                placeholder="Enter complete business address"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="business@example.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Business Description
              </label>
              <textarea
                placeholder="Describe your business activities"
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Submit Registration
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Registration Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Bhutan Tech Solutions</p>
                  <p className="text-sm text-gray-500">
                    Submitted on Dec 10, 2024
                  </p>
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

          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-900">
              Required Documents
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Business plan</li>
              <li>• Identity proof of owners</li>
              <li>• Address proof</li>
              <li>• Financial statements</li>
              <li>• Tax clearance certificate</li>
            </ul>
          </div>

          <div className="rounded-lg bg-green-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-green-900">
              Registration Benefits
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Legal business entity</li>
              <li>• Tax benefits</li>
              <li>• Banking facilities</li>
              <li>• Government contracts</li>
              <li>• Business loans</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegisterPage;
