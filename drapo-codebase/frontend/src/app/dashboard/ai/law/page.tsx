"use client";

export default function LawAssistantPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        ⚖️ Bhutanese Law Assistant
      </h1>
      <p className="mb-8 text-gray-600">
        Get instant answers about Bhutanese laws, regulations, and legal
        procedures.
      </p>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-blue-800">
          🤖 AI-Powered Legal Guidance
        </h2>
        <p className="mb-4 text-blue-700">
          This AI assistant is trained on Bhutan&apos;s legal code, regulations,
          and precedents to provide accurate legal guidance for residents and
          businesses.
        </p>

        <div className="space-y-3">
          <div className="flex items-center">
            <span className="mr-2 text-green-500">✓</span>
            <span className="text-blue-700">Business & Corporate Law</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-green-500">✓</span>
            <span className="text-blue-700">Immigration & Citizenship</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-green-500">✓</span>
            <span className="text-blue-700">Tax & Financial Regulations</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-green-500">✓</span>
            <span className="text-blue-700">Property & Land Law</span>
          </div>
        </div>
      </div>
    </div>
  );
}
