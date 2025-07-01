"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AssistantChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId] = useState("user123"); // In production, get from auth context
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChatSession = useCallback(async () => {
    try {
      // Create a new chat session
      const response = await fetch("/api/ai/chat/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        setSessionId(data.sessionId);
        // Add welcome message
        setMessages([
          {
            role: "assistant",
            content:
              "Tashi Delek! I am your Bhutanese Sovereign AI Assistant. How can I help you today with government services or any questions about Bhutan?",
            timestamp: new Date(),
          },
        ]);
      } else {
        console.error("Failed to create chat session:", data.message);
        // Fallback welcome message
        setMessages([
          {
            role: "assistant",
            content:
              "Tashi Delek! I am your Bhutanese Sovereign AI Assistant. How can I help you today with government services or any questions about Bhutan?",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error initializing chat session:", error);
      // Fallback welcome message
      setMessages([
        {
          role: "assistant",
          content:
            "Tashi Delek! I am your Bhutanese Sovereign AI Assistant. How can I help you today with government services or any questions about Bhutan?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [userId]);

  useEffect(() => {
    initializeChatSession();
  }, [initializeChatSession]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          message: currentInput,
          userId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.response, // Backend returns 'response' not 'message'
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Handle error
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`/api/ai/chat/session/${sessionId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Reset messages to just the welcome message
        setMessages([
          {
            role: "assistant",
            content:
              "Tashi Delek! I am your Bhutanese Sovereign AI Assistant. How can I help you today with government services or any questions about Bhutan?",
            timestamp: new Date(),
          },
        ]);
        // Create a new session
        await initializeChatSession();
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to format AI response content
  const formatMessageContent = (content: string) => {
    // Split content into paragraphs
    const paragraphs = content.split("\n\n").filter((p) => p.trim());

    return paragraphs.map((paragraph, index) => {
      // Check if it's a bullet point list
      if (paragraph.includes("* **") || paragraph.includes("• **")) {
        const items = paragraph
          .split(/\* \*\*|\• \*\*/)
          .filter((item) => item.trim());
        if (items.length > 1) {
          return (
            <div key={index} className="space-y-2">
              {items.slice(1).map((item, itemIndex) => {
                const [title, ...description] = item.split("**:");
                return (
                  <div key={itemIndex} className="flex items-start space-x-2">
                    <span className="font-semibold text-blue-600">•</span>
                    <div>
                      <span className="font-semibold text-gray-900">
                        {title}
                      </span>
                      {description.length > 0 && (
                        <span className="text-gray-700">
                          : {description.join("**:")}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }
      }

      // Check if it's a numbered list
      if (paragraph.match(/^\d+\./)) {
        const items = paragraph.split(/\d+\./).filter((item) => item.trim());
        if (items.length > 1) {
          return (
            <div key={index} className="space-y-2">
              {items.slice(1).map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start space-x-2">
                  <span className="font-semibold text-blue-600">
                    {itemIndex + 1}.
                  </span>
                  <span className="text-gray-700">{item.trim()}</span>
                </div>
              ))}
            </div>
          );
        }
      }

      // Regular paragraph
      return (
        <p key={index} className="leading-relaxed text-gray-700">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Sovereign AI Assistant
        </h1>
        <p className="text-gray-600">
          Your Bhutanese AI assistant for government services and cultural
          guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Chat with Sovereign AI
                </h2>
                <button
                  onClick={clearChat}
                  className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-200"
                >
                  Clear Chat
                </button>
              </div>
            </div>

            <div className="h-96 space-y-4 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-2xl rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 bg-gray-50"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="space-y-3">
                        {formatMessageContent(message.content)}
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                    <p
                      className={`mt-2 text-xs ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Press Enter to send)"
                  disabled={isLoading}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() =>
                  setInputMessage("How do I register my business?")
                }
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-left text-sm transition-colors hover:bg-gray-100"
              >
                💼 Business Registration Help
              </button>
              <button
                onClick={() =>
                  setInputMessage("What documents do I need for tax filing?")
                }
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-left text-sm transition-colors hover:bg-gray-100"
              >
                📄 Document Request Guide
              </button>
              <button
                onClick={() => setInputMessage("How do I file my taxes?")}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-left text-sm transition-colors hover:bg-gray-100"
              >
                💰 Tax Filing Assistance
              </button>
              <button
                onClick={() =>
                  setInputMessage("Tell me about Bhutanese culture")
                }
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-left text-sm transition-colors hover:bg-gray-100"
              >
                🏔️ Cultural Information
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-900">
              Sovereign AI Features
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Bhutanese government services</p>
              <p>• Cultural guidance</p>
              <p>• Document assistance</p>
              <p>• Multi-language support</p>
            </div>
          </div>

          <div className="rounded-lg bg-green-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-green-900">
              Privacy & Security
            </h3>
            <div className="space-y-2 text-sm text-green-800">
              <p>• End-to-end encryption</p>
              <p>• No personal data storage</p>
              <p>• Secure government standards</p>
              <p>• Privacy-first design</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantChatPage;
