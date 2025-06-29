import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Scale, MessageCircle, Send } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const LawsPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (userMessage: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://tjssth84ak.loclx.io/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const answer = data?.result?.answer || 'Sorry, I could not get an answer.';
      const sources = data?.result?.sources;
      let botText = answer;
      if (sources && Array.isArray(sources) && sources.length > 0) {
        botText += `\n\nSources: ${sources.join(', ')}`;
      }
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botText,
        },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'Sorry, there was an error fetching the answer.',
        },
      ]);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    await sendMessage(userMessage);
  };

  const goBackToChat = () => {
    navigate('/chatbot');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      {/* Sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-white/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                BhutanAI Legal
              </h1>
              <p className="text-sm text-gray-600 font-medium">Legal Information Assistant</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 p-6">
          <nav className="space-y-3">
            <button className="w-full flex items-center gap-4 px-4 py-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all duration-300 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">Legal Chat</span>
            </button>
            <button 
              onClick={goBackToChat}
              className="w-full flex items-center gap-4 px-4 py-3 text-left text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">Back to Chat</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm">
        {/* Header */}
        <div className="p-8 border-b border-white/20 bg-white/40 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Legal Assistant</h2>
              <p className="text-gray-600 font-medium">Ask me about Bhutan's laws, legal procedures, and legal information</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Scale className="w-12 h-12 text-white" />
              </div>
              <div className="max-w-md space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Welcome to BhutanAI Legal Assistant!</h3>
                <p className="text-gray-600 leading-relaxed">
                  I'm your specialized AI assistant for Bhutan's legal information. Ask me about laws, 
                  legal procedures, rights, and legal documents.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Ready to help with legal questions</span>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-6 py-4 rounded-3xl max-w-[75%] shadow-lg backdrop-blur-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-xl"
                      : "bg-white/80 text-gray-900 rounded-bl-xl border border-white/20"
                  }`}
                >
                  <div className="text-sm leading-relaxed">{msg.text}</div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-6 py-4 rounded-3xl bg-white/80 text-gray-900 rounded-bl-xl border border-white/20 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">BhutanAI Legal Assistant is typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-8 border-t border-white/20 bg-white/40 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Bhutan's laws..."
                className="w-full bg-white/70 border-white/30 focus:border-green-500 focus:ring-green-500/20 rounded-2xl px-6 py-4 text-lg shadow-lg backdrop-blur-sm"
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-6 h-6 text-white" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LawsPage;
