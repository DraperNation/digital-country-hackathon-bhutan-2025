"use client";

import Link from "next/link";
import { useState } from "react";

export default function AIDashboard() {
  const [aiStats] = useState({
    totalQueries: 15420,
    dzongkhaQueries: 3240,
    lawQueries: 5678,
    governmentQueries: 2340,
    accuracy: 94.2,
    responseTime: "1.2s",
  });

  const [recentQueries] = useState([
    {
      id: 1,
      query: "What are the requirements for starting a business in Bhutan?",
      language: "English",
      category: "Business Law",
      timestamp: "2 minutes ago",
    },
    {
      id: 2,
      query: "ཕྱི་རྒྱལ་གྱི་མི་ཞིག་གིས་འབྲུག་ཏུ་ཚོང་ལས་གཉེར་ཆོག་པ་ཡིན་ནམ།",
      language: "Dzongkha",
      category: "Immigration",
      timestamp: "5 minutes ago",
    },
    {
      id: 3,
      query: "How do I apply for a tax identification number?",
      language: "English",
      category: "Taxation",
      timestamp: "8 minutes ago",
    },
  ]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          🤖 Sovereign AI for Bhutan
        </h1>
        <p className="mt-2 text-gray-600">
          Fine-tuned AI assistant for Bhutanese law, Dzongkha language support,
          and government services
        </p>
      </div>

      {/* AI Performance Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Queries Today</p>
              <p className="text-2xl font-bold">
                {aiStats.totalQueries.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">🤖</div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Dzongkha Queries</p>
              <p className="text-2xl font-bold">
                {aiStats.dzongkhaQueries.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">🗣️</div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Law Queries</p>
              <p className="text-2xl font-bold">
                {aiStats.lawQueries.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">⚖️</div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Government Services</p>
              <p className="text-2xl font-bold">
                {aiStats.governmentQueries.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">🏛️</div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Accuracy Rate</p>
              <p className="text-2xl font-bold">{aiStats.accuracy}%</p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg Response Time</p>
              <p className="text-2xl font-bold">{aiStats.responseTime}</p>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
        </div>
      </div>

      {/* AI Services */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          AI Services
        </h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Bhutanese Law Assistant */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">⚖️</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Bhutanese Law Assistant
                </h3>
                <p className="text-sm text-gray-600">
                  Legal guidance & compliance
                </p>
              </div>
            </div>
            <p className="mb-4 text-gray-700">
              Get instant answers about Bhutanese laws, regulations, and legal
              procedures. Trained on official legal documents and precedents.
            </p>
            <div className="mb-4 space-y-2">
              <div className="rounded bg-blue-50 p-2 text-sm text-blue-700">
                • Business & Corporate Law
              </div>
              <div className="rounded bg-green-50 p-2 text-sm text-green-700">
                • Immigration & Citizenship
              </div>
              <div className="rounded bg-purple-50 p-2 text-sm text-purple-700">
                • Tax & Financial Regulations
              </div>
            </div>
            <Link
              href="/dashboard/ai/law"
              className="block w-full rounded bg-blue-600 py-2 text-center text-white hover:bg-blue-700"
            >
              Ask Legal Questions
            </Link>
          </div>

          {/* Dzongkha Support */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">🗣️</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Dzongkha Support
                </h3>
                <p className="text-sm text-gray-600">
                  Native language assistance
                </p>
              </div>
            </div>
            <p className="mb-4 text-gray-700">
              Full support for Bhutan&apos;s national language. Ask questions,
              get translations, and access government services in Dzongkha.
            </p>
            <div className="mb-4 space-y-2">
              <div className="rounded bg-blue-50 p-2 text-sm text-blue-700">
                • Natural Language Processing
              </div>
              <div className="rounded bg-green-50 p-2 text-sm text-green-700">
                • Translation Services
              </div>
              <div className="rounded bg-purple-50 p-2 text-sm text-purple-700">
                • Cultural Context Understanding
              </div>
            </div>
            <Link
              href="/dashboard/ai/dzongkha"
              className="block w-full rounded bg-green-600 py-2 text-center text-white hover:bg-green-700"
            >
              Start Dzongkha Chat
            </Link>
          </div>

          {/* Government Services */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-3xl">🏛️</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Government Services
                </h3>
                <p className="text-sm text-gray-600">
                  Public service assistance
                </p>
              </div>
            </div>
            <p className="mb-4 text-gray-700">
              Navigate government services, find forms, understand procedures,
              and get step-by-step guidance for official processes.
            </p>
            <div className="mb-4 space-y-2">
              <div className="rounded bg-blue-50 p-2 text-sm text-blue-700">
                • Document Processing
              </div>
              <div className="rounded bg-green-50 p-2 text-sm text-green-700">
                • Permit Applications
              </div>
              <div className="rounded bg-purple-50 p-2 text-sm text-purple-700">
                • Service Locator
              </div>
            </div>
            <Link
              href="/dashboard/ai/services"
              className="block w-full rounded bg-purple-600 py-2 text-center text-white hover:bg-purple-700"
            >
              Access Services
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Queries */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Recent Queries
        </h3>
        <div className="space-y-4">
          {recentQueries.map((query) => (
            <div
              key={query.id}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{query.query}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <span className="mr-1">🌐</span>
                      {query.language}
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1">📂</span>
                      {query.category}
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1">⏰</span>
                      {query.timestamp}
                    </span>
                  </div>
                </div>
                <button className="ml-4 rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200">
                  View Response
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Training Status */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          AI Training Status
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-3 font-medium text-gray-800">
              Training Data Sources
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded bg-green-50 p-3">
                <span className="text-sm font-medium">
                  Bhutanese Legal Code
                </span>
                <span className="text-green-600">✓ Complete</span>
              </div>
              <div className="flex items-center justify-between rounded bg-green-50 p-3">
                <span className="text-sm font-medium">
                  Government Regulations
                </span>
                <span className="text-green-600">✓ Complete</span>
              </div>
              <div className="flex items-center justify-between rounded bg-yellow-50 p-3">
                <span className="text-sm font-medium">Dzongkha Corpus</span>
                <span className="text-yellow-600">🔄 In Progress</span>
              </div>
              <div className="flex items-center justify-between rounded bg-blue-50 p-3">
                <span className="text-sm font-medium">Cultural Context</span>
                <span className="text-blue-600">📚 Ongoing</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-medium text-gray-800">
              Model Performance
            </h4>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Legal Accuracy</span>
                  <span>94.2%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: "94.2%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Dzongkha Understanding</span>
                  <span>87.5%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: "87.5%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Response Relevance</span>
                  <span>96.8%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-purple-500"
                    style={{ width: "96.8%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
