"use client";
import { useState, useRef, useEffect } from "react";

const SUGGESTED_QUESTIONS = [
  "How to apply for eResidency?",
  "How to set up a company?",
  "How to pay taxes?",
];

function getBotResponse(userMessage: string): string {
  // Simple hardcoded responses for demo
  if (/e\s*residency/i.test(userMessage)) {
    return "To apply for eResidency, visit the official portal, create an account, and follow the application steps. You will need to provide identification and supporting documents.";
  }
  if (/set up.*company|register.*company/i.test(userMessage)) {
    return "To set up a company, register your business with the Ministry of Economic Affairs online portal. Prepare your business plan, required documents, and pay the registration fee.";
  }
  if (/pay.*tax/i.test(userMessage)) {
    return "You can pay taxes online via the Bhutan Tax Portal. Log in, select your tax type, and follow the payment instructions. For help, contact the Department of Revenue and Customs.";
  }
  return "Sorry, I don't have an answer for that yet. Please contact the relevant government office for more information.";
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const userMsg = input.trim();
    if (!userMsg) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const botReply = getBotResponse(userMsg);
      setMessages((msgs) => [...msgs, { sender: "bot", text: botReply }]);
      setLoading(false);
    }, 700);
  };

  const handleSuggestion = (q: string) => {
    setInput(q);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div className="mx-auto flex h-[80vh] max-w-2xl flex-col py-8">
      <h1 className="mb-2 text-2xl font-bold">
        Chatbot for Citizens & Residents
      </h1>
      <div className="mb-4 flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 transition hover:bg-blue-200"
            onClick={() => handleSuggestion(q)}
            type="button"
          >
            {q}
          </button>
        ))}
      </div>
      <div className="mb-4 flex-1 overflow-y-auto rounded border bg-gray-50 p-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs whitespace-pre-line rounded-lg px-3 py-2 ${msg.sender === "user" ? "bg-blue-500 text-white" : "border bg-white text-gray-900"}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="mb-2 flex justify-start">
            <div className="max-w-xs animate-pulse rounded-lg border bg-white px-3 py-2 text-gray-400">
              Typing…
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
