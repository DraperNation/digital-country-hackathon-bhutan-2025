"use client";

import React, { useState, useRef, useEffect } from "react";

interface DzongkhaService {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  text: string;
  response: string;
  serviceType: string;
  timestamp: Date;
}

const AssistantDzongkhaPage = () => {
  const [selectedService, setSelectedService] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("English");
  const [targetLanguage, setTargetLanguage] = useState("Dzongkha");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dzongkhaServices, setDzongkhaServices] = useState<DzongkhaService[]>(
    [],
  );
  const [userId] = useState("user123"); // In production, get from auth context
  const responseEndRef = useRef<HTMLDivElement>(null);

  const serviceTypes = [
    {
      id: "translation",
      title: "Translation",
      description: "Translate between Dzongkha and English",
      icon: "🔄",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
      placeholder: "Enter text to translate...",
    },
    {
      id: "document_help",
      title: "Document Help",
      description: "Help with Dzongkha documents",
      icon: "📄",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
      placeholder: "Ask about Dzongkha documents...",
    },
    {
      id: "language_learning",
      title: "Language Learning",
      description: "Learn Dzongkha language basics",
      icon: "📚",
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-700",
      placeholder: "Ask about learning Dzongkha...",
    },
    {
      id: "cultural_guide",
      title: "Cultural Guide",
      description: "Bhutanese cultural information",
      icon: "🏔️",
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-700",
      placeholder: "Ask about Bhutanese culture...",
    },
  ];

  const scrollToBottom = () => {
    responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [dzongkhaServices]);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    // Reset form when service changes
    setText("");
  };

  const handleLanguageSwap = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !text.trim()) {
      alert("Please select a service and enter your text.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/dzongkha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceLanguage,
          targetLanguage,
          text: text.trim(),
          userId,
          serviceType: selectedService,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newService: DzongkhaService = {
          id: Date.now().toString(),
          sourceLanguage,
          targetLanguage,
          text: text.trim(),
          response: data.response,
          serviceType: selectedService,
          timestamp: new Date(),
        };

        setDzongkhaServices((prev) => [newService, ...prev]);
        setText("");
      } else {
        alert("Failed to get Dzongkha service. Please try again.");
      }
    } catch (error) {
      console.error("Error getting Dzongkha service:", error);
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

  const getServiceLabel = (serviceId: string) => {
    const service = serviceTypes.find((s) => s.id === serviceId);
    return service ? service.title : serviceId;
  };

  const getSelectedService = () => {
    return serviceTypes.find((s) => s.id === selectedService);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Dzongkha Assistant
        </h1>
        <p className="text-gray-600">
          Get help with Dzongkha language and Bhutanese cultural services.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Service Selection */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Select Service</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {serviceTypes.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-lg ${
                    selectedService === service.id
                      ? "border-blue-500 bg-blue-50"
                      : service.color
                  }`}
                >
                  <div className="mb-2 text-2xl">{service.icon}</div>
                  <h3
                    className={`mb-1 font-semibold ${
                      selectedService === service.id
                        ? "text-blue-700"
                        : service.textColor
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Service Form */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">
              {getSelectedService()?.title || "Select a Service"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedService === "translation" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        From
                      </label>
                      <select
                        value={sourceLanguage}
                        onChange={(e) => setSourceLanguage(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="English">English</option>
                        <option value="Dzongkha">Dzongkha</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleLanguageSwap}
                        className="mb-2 rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200"
                      >
                        🔄
                      </button>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        To
                      </label>
                      <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Dzongkha">Dzongkha</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {selectedService === "translation"
                    ? "Text to Translate"
                    : "Your Question"}
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={
                    getSelectedService()?.placeholder || "Enter your text..."
                  }
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !selectedService || !text.trim()}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isLoading
                  ? "Processing..."
                  : selectedService === "translation"
                    ? "Translate"
                    : "Get Help"}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          {/* Recent Services */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Recent Services</h3>
            <div className="max-h-96 space-y-4 overflow-y-auto">
              {dzongkhaServices.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <p>No services used yet.</p>
                  <p className="text-sm">
                    Select a service and make a request to get started.
                  </p>
                </div>
              ) : (
                dzongkhaServices.map((service) => (
                  <div
                    key={service.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="mb-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {getServiceLabel(service.serviceType)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(service.timestamp)} at{" "}
                          {formatTime(service.timestamp)}
                        </span>
                      </div>
                      {service.serviceType === "translation" && (
                        <div className="mb-2 text-xs text-gray-500">
                          {service.sourceLanguage} → {service.targetLanguage}
                        </div>
                      )}
                      <p className="mb-2 font-medium text-gray-900">
                        {service.serviceType === "translation"
                          ? "Original:"
                          : "Question:"}{" "}
                        {service.text}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="whitespace-pre-wrap text-sm text-gray-700">
                        {service.response}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={responseEndRef} />
            </div>
          </div>

          {/* Language Features */}
          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-900">
              Language Features
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Accurate translations</p>
              <p>• Cultural context</p>
              <p>• Document formatting</p>
              <p>• Audio pronunciation</p>
              <p>• Formal vs informal</p>
            </div>
          </div>

          {/* Cultural Information */}
          <div className="rounded-lg bg-green-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-green-900">
              Cultural Information
            </h3>
            <div className="space-y-2 text-sm text-green-800">
              <p>• Traditional customs</p>
              <p>• Official protocols</p>
              <p>• Cultural etiquette</p>
              <p>• Historical context</p>
              <p>• Modern applications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantDzongkhaPage;
