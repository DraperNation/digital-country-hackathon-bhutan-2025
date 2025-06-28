"use client";

import React, { useState, useRef, useEffect } from "react";

interface LegalQuery {
  id: string;
  legalArea: string;
  question: string;
  response: string;
  timestamp: Date;
}

const AssistantLegalPage = () => {
  const [selectedLegalArea, setSelectedLegalArea] = useState("");
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [legalQueries, setLegalQueries] = useState<LegalQuery[]>([]);
  const [userId] = useState("user123"); // In production, get from auth context
  const responseEndRef = useRef<HTMLDivElement>(null);

  const legalAreas = [
    {
      value: "general",
      label: "General",
      description: "General questions about Bhutanese law",
      icon: "⚖️",
      color: "bg-gray-50 border-gray-200",
      textColor: "text-gray-700",
    },
    {
      value: "business",
      label: "Business Law",
      description: "Legal requirements for businesses",
      icon: "🏢",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
    },
    {
      value: "tax",
      label: "Tax Law",
      description: "Tax regulations and compliance",
      icon: "💰",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
    },
    {
      value: "property",
      label: "Property Law",
      description: "Property rights and regulations",
      icon: "🏠",
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-700",
    },
    {
      value: "employment",
      label: "Employment Law",
      description: "Workplace rights and obligations",
      icon: "👥",
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-700",
    },
    {
      value: "family",
      label: "Family Law",
      description: "Marriage, divorce, and family matters",
      icon: "👨‍👩‍👧‍👦",
      color: "bg-pink-50 border-pink-200",
      textColor: "text-pink-700",
    },
    {
      value: "criminal",
      label: "Criminal Law",
      description: "Criminal procedures and penalties",
      icon: "🚔",
      color: "bg-red-50 border-red-200",
      textColor: "text-red-700",
    },
    {
      value: "administrative",
      label: "Administrative Law",
      description: "Government procedures and regulations",
      icon: "🏛️",
      color: "bg-indigo-50 border-indigo-200",
      textColor: "text-indigo-700",
    },
  ];

  const scrollToBottom = () => {
    responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [legalQueries]);

  const handleLegalAreaSelect = (area: string) => {
    setSelectedLegalArea(area);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLegalArea || !question.trim()) {
      alert("Please select a legal area and enter your question.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/legal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          legalArea: selectedLegalArea,
          question: question.trim(),
          userId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newQuery: LegalQuery = {
          id: Date.now().toString(),
          legalArea: selectedLegalArea,
          question: question.trim(),
          response: data.response,
          timestamp: new Date(),
        };

        setLegalQueries((prev) => [newQuery, ...prev]);
        setQuestion("");
      } else {
        alert("Failed to get legal guidance. Please try again.");
      }
    } catch (error) {
      console.error("Error getting legal guidance:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: Date) => {
    return new Date(timestamp).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLegalAreaLabel = (value: string) => {
    const area = legalAreas.find((a) => a.value === value);
    return area ? area.label : value;
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Legal Assistant
        </h1>
        <p className="text-gray-600">
          Get legal guidance and information on Bhutanese laws and regulations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Legal Areas Selection */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Select Legal Area</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {legalAreas.map((area) => (
                <div
                  key={area.value}
                  onClick={() => handleLegalAreaSelect(area.value)}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-lg ${
                    selectedLegalArea === area.value
                      ? "border-blue-500 bg-blue-50"
                      : area.color
                  }`}
                >
                  <div className="mb-2 text-2xl">{area.icon}</div>
                  <h3
                    className={`mb-1 font-semibold ${
                      selectedLegalArea === area.value
                        ? "text-blue-700"
                        : area.textColor
                    }`}
                  >
                    {area.label}
                  </h3>
                  <p className="text-sm text-gray-600">{area.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Question Form */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Ask Legal Question</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Selected Legal Area
                </label>
                <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700">
                  {selectedLegalArea
                    ? getLegalAreaLabel(selectedLegalArea)
                    : "Please select a legal area above"}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Your Question
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Describe your legal question in detail..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !selectedLegalArea || !question.trim()}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isLoading ? "Getting Legal Guidance..." : "Get Legal Guidance"}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          {/* Recent Legal Queries */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">
              Legal Queries & Responses
            </h3>
            <div className="max-h-96 space-y-4 overflow-y-auto">
              {legalQueries.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <p>No legal queries yet.</p>
                  <p className="text-sm">
                    Select a legal area and ask a question to get started.
                  </p>
                </div>
              ) : (
                legalQueries.map((query) => (
                  <div
                    key={query.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="mb-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {getLegalAreaLabel(query.legalArea)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(query.timestamp)} at{" "}
                          {formatTime(query.timestamp)}
                        </span>
                      </div>
                      <p className="mb-2 font-medium text-gray-900">
                        Q: {query.question}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="whitespace-pre-wrap text-sm text-gray-700">
                        {query.response}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={responseEndRef} />
            </div>
          </div>

          {/* Legal Resources */}
          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-900">
              Legal Resources
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Bhutanese Constitution</p>
              <p>• Business Registration Act</p>
              <p>• Tax Laws and Regulations</p>
              <p>• Property Rights Act</p>
              <p>• Employment Law Guide</p>
              <p>• Family Law Code</p>
              <p>• Criminal Procedure Code</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-lg bg-yellow-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-yellow-900">
              ⚠️ Important Disclaimer
            </h3>
            <div className="space-y-2 text-sm text-yellow-800">
              <p>• This is for informational purposes only</p>
              <p>• Not a substitute for professional legal advice</p>
              <p>• Consult a qualified Bhutanese lawyer for specific cases</p>
              <p>• Laws may change over time</p>
              <p>• Always verify information with official sources</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantLegalPage;
