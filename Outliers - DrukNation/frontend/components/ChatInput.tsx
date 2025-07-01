// components/ChatInput.tsx
"use client";
import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200/60 p-4 shadow-lg">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div
          className={`flex items-end gap-3 bg-white rounded-2xl border transition-all duration-200 shadow-sm ${
            isFocused
              ? "border-orange-300 shadow-md shadow-orange-100/50"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask about Bhutan law, regulations, legal procedures..."
              disabled={isLoading}
              rows={1}
              className="w-full px-4 py-3 bg-transparent border-none resize-none outline-none placeholder-slate-400 text-slate-700 text-[15px] leading-relaxed max-h-32 scrollbar-hide disabled:opacity-50"
              style={{
                minHeight: "44px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            />
            {input.trim() && (
              <div className="absolute bottom-1 right-2 text-xs text-slate-400 bg-white px-1 rounded">
                Press Enter to send, Shift+Enter for new line
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`m-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
              !input.trim() || isLoading
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                <span>Sending</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9"></polygon>
                </svg>
              </>
            )}
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
              End-to-end encrypted
            </span>
            <span>Powered by AI</span>
          </div>
          <div className="text-xs text-slate-400">{input.length}/2000</div>
        </div>
      </form>
    </div>
  );
}
