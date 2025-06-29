// pages/index.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import ChatMessage from "../../components/ChatMessage";
import ChatInput from "../../components/ChatInput";
import Navbar from "../../components/Navbar";
import { Message, ApiResponse } from "../../types/index";
import { WalletProvider } from "@/context/WalletConnect";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"online" | "offline" | "checking">(
    "checking"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check server status
  useEffect(() => {
    checkServerStatus();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const checkServerStatus = async () => {
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: "test" }),
      });
      setStatus(response.ok ? "online" : "offline");
    } catch {
      setStatus("offline");
    }
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: content }),
      });

      const data: ApiResponse = await response.json();

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.success
          ? data.answer
          : data.error || "Sorry, something went wrong.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Failed to connect to the server. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navbar */}
      <WalletProvider>
        <Navbar />
      </WalletProvider>

      {/* Messages with improved scrolling */}
      <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-sm">
                <span className="text-2xl">⚖️</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-3 tracking-tight">
                Welcome to Bhutan Law Assistant
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Get expert guidance on Bhutan's legal system, regulations, and
                legal procedures. Ask me anything about civil law, criminal law,
                constitutional matters, or legal processes.
              </p>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="bg-slate-50/80 px-3 py-2 rounded-lg border border-slate-200/60 text-slate-600">
                  💡 Try asking: "What are the criminal offences in Bhutan?"
                </div>
                <div className="bg-slate-50/80 px-3 py-2 rounded-lg border border-slate-200/60 text-slate-600">
                  📋 Or: "Is Smoking a Crime in Bhutan?"
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-5 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">
                      Analyzing your query...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Enhanced Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
