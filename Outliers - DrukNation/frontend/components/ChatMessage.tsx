// components/ChatMessage.tsx
import React, { JSX } from "react";
import { Message } from "../types";

interface ChatMessageProps {
  message: Message;
}

// Simple markdown parser for common formatting
const parseMarkdown = (text: string): React.ReactElement => {
  // Split text into lines for processing
  const lines = text.split("\n");
  const elements: JSX.Element[] = [];
  let currentListItems: string[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLanguage = "";

  const flushList = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul
          key={elements.length}
          className="list-disc list-inside space-y-1 my-2 ml-4"
        >
          {currentListItems.map((item, idx) => (
            <li key={idx} className="text-sm leading-relaxed">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      currentListItems = [];
    }
  };

  const flushCodeBlock = () => {
    if (codeBlockContent.length > 0) {
      elements.push(
        <div key={elements.length} className="my-3">
          {codeBlockLanguage && (
            <div className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-t-lg border-b">
              {codeBlockLanguage}
            </div>
          )}
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{codeBlockContent.join("\n")}</code>
          </pre>
        </div>
      );
      codeBlockContent = [];
      codeBlockLanguage = "";
    }
  };

  lines.forEach((line, index) => {
    // Handle code blocks
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        inCodeBlock = false;
        flushCodeBlock();
      } else {
        flushList();
        inCodeBlock = true;
        codeBlockLanguage = line.slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    // Handle lists
    if (line.match(/^[\s]*[-*+]\s+/)) {
      const listItem = line.replace(/^[\s]*[-*+]\s+/, "");
      currentListItems.push(listItem);
      return;
    }

    if (line.match(/^[\s]*\d+\.\s+/)) {
      flushList();
      const numberedItem = line.replace(/^[\s]*\d+\.\s+/, "");
      elements.push(
        <ol
          key={elements.length}
          className="list-decimal list-inside space-y-1 my-2 ml-4"
        >
          <li className="text-sm leading-relaxed">
            {parseInlineMarkdown(numberedItem)}
          </li>
        </ol>
      );
      return;
    }

    // Flush any pending lists
    flushList();

    // Handle headers
    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={elements.length}
          className="text-lg font-semibold mt-4 mb-2 text-slate-800"
        >
          {parseInlineMarkdown(line.slice(4))}
        </h3>
      );
      return;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={elements.length}
          className="text-xl font-bold mt-4 mb-2 text-slate-800"
        >
          {parseInlineMarkdown(line.slice(3))}
        </h2>
      );
      return;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={elements.length}
          className="text-2xl font-bold mt-4 mb-2 text-slate-800"
        >
          {parseInlineMarkdown(line.slice(2))}
        </h1>
      );
      return;
    }

    // Handle blockquotes
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={elements.length}
          className="border-l-4 border-orange-300 pl-4 my-2 italic text-slate-600"
        >
          {parseInlineMarkdown(line.slice(2))}
        </blockquote>
      );
      return;
    }

    // Handle horizontal rules
    if (line.match(/^---+$/)) {
      elements.push(
        <hr key={elements.length} className="my-4 border-slate-200" />
      );
      return;
    }

    // Handle regular paragraphs
    if (line.trim()) {
      elements.push(
        <p key={elements.length} className="mb-2 leading-relaxed">
          {parseInlineMarkdown(line)}
        </p>
      );
    } else if (elements.length > 0) {
      // Add spacing for empty lines
      elements.push(<br key={elements.length} />);
    }
  });

  // Flush any remaining items
  flushList();
  flushCodeBlock();

  return <div>{elements}</div>;
};

// Parse inline markdown (bold, italic, code, links)
const parseInlineMarkdown = (text: string): React.ReactElement => {
  const parts: (string | JSX.Element)[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold text (**text**)
    const boldMatch = remaining.match(/^\*\*(.*?)\*\*/);
    if (boldMatch) {
      parts.push(
        <strong key={key++} className="font-semibold">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic text (*text*)
    const italicMatch = remaining.match(/^\*(.*?)\*/);
    if (italicMatch) {
      parts.push(
        <em key={key++} className="italic">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Inline code (`code`)
    const codeMatch = remaining.match(/^`(.*?)`/);
    if (codeMatch) {
      parts.push(
        <code
          key={key++}
          className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Links [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      parts.push(
        <a
          key={key++}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-600 hover:text-orange-700 underline"
        >
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // No match found, add the next character
    parts.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  return <span>{parts}</span>;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6 group`}
    >
      <div
        className={`flex items-start gap-3 max-w-[85%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shadow-sm ${
            isUser
              ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
              : "bg-white border-2 border-slate-200 text-slate-600"
          }`}
        >
          {isUser ? "U" : "⚖"}
        </div>

        {/* Message bubble */}
        <div
          className={`relative rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 group-hover:shadow-md ${
            isUser
              ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
              : "bg-white border border-slate-200/80 text-slate-800"
          }`}
        >
          {/* Message tail */}
          <div
            className={`absolute top-3 w-2 h-2 rotate-45 ${
              isUser
                ? "right-[-4px] bg-gradient-to-br from-orange-500 to-red-500"
                : "left-[-4px] bg-white border-l border-b border-slate-200/80"
            }`}
          />

          {/* Content with markdown parsing */}
          <div className="text-[15px] leading-relaxed prose prose-sm max-w-none">
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              parseMarkdown(message.content)
            )}
          </div>

          {/* Timestamp */}
          <div
            className={`text-xs mt-2 flex items-center gap-1 ${
              isUser ? "text-orange-100/80" : "text-slate-500"
            }`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-60"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {isUser && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 opacity-60"
              >
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
