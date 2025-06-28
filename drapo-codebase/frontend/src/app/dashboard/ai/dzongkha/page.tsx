"use client";

export default function DzongkhaPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        🗣️ Dzongkha Language Support
      </h1>
      <p className="mb-8 text-gray-600">
        AI-powered assistance in Bhutan&apos;s national language with cultural
        context understanding.
      </p>

      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-green-800">
          🤖 Dzongkha AI Assistant
        </h2>
        <p className="mb-4 text-green-700">
          This AI assistant provides full support for Dzongkha language
          processing, translation services, and cultural context understanding.
        </p>

        <div className="space-y-3">
          <div className="flex items-center">
            <span className="mr-2 text-green-500">✓</span>
            <span className="text-green-700">Natural Language Processing</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-green-500">✓</span>
            <span className="text-green-700">Translation Services</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-green-500">✓</span>
            <span className="text-green-700">
              Cultural Context Understanding
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
