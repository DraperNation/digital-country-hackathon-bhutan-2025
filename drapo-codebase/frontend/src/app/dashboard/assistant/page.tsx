export default function AssistantPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">AI Government Assistant</h1>
      <p>
        Welcome to the AI-powered government assistant. Features coming soon.
      </p>
      <div className="mt-6 space-y-4">
        <a
          href="/dashboard/assistant/chatbot"
          className="block text-blue-600 underline"
        >
          Chatbot for Citizens & Residents
        </a>
        <a
          href="/dashboard/assistant/bhutanese-law-faq"
          className="block text-blue-600 underline"
        >
          Bhutanese Law FAQs
        </a>
      </div>
    </div>
  );
}
