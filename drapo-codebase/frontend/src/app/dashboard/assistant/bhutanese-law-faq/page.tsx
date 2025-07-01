"use client";
import { useState } from "react";

const FAQS = [
  {
    question: "What is the Constitution of Bhutan?",
    answer:
      "The Constitution of Bhutan is the supreme law of the Kingdom of Bhutan, adopted in 2008. It establishes Bhutan as a democratic constitutional monarchy and outlines the rights, duties, and responsibilities of the government and citizens.",
  },
  {
    question: "How can I access Bhutanese laws and regulations?",
    answer:
      "You can access Bhutanese laws and regulations through the official website of the Bhutan National Legal Institute (BNLI) or the Royal Government of Bhutan's online legal resources.",
  },
  {
    question: "What are the fundamental rights of citizens in Bhutan?",
    answer:
      "Fundamental rights include the right to life, liberty, security, freedom of speech, religion, and equality before the law, as enshrined in the Constitution of Bhutan.",
  },
  {
    question: "How do I register a business in Bhutan?",
    answer:
      "To register a business, visit the Ministry of Economic Affairs' online portal, submit the required documents, and follow the registration process. You may need to obtain sector-specific licenses depending on your business type.",
  },
  {
    question: "What is the legal age for marriage in Bhutan?",
    answer:
      "The legal age for marriage in Bhutan is 18 years for both men and women.",
  },
  {
    question: "How do I report a crime or seek police assistance?",
    answer:
      "You can report a crime by contacting the nearest police station or calling the Royal Bhutan Police emergency number: 113.",
  },
  {
    question: "What are the penalties for drug-related offenses in Bhutan?",
    answer:
      "Drug-related offenses are treated seriously in Bhutan, with penalties ranging from fines to imprisonment, depending on the nature and severity of the offense.",
  },
  {
    question: "How can I apply for citizenship in Bhutan?",
    answer:
      "Citizenship applications are processed by the Ministry of Home and Cultural Affairs. Requirements include proof of residency, parental citizenship, and other legal criteria as per the Citizenship Act of Bhutan.",
  },
  {
    question: "What are the tax obligations for residents and businesses?",
    answer:
      "Residents and businesses must file annual tax returns and pay applicable taxes to the Department of Revenue and Customs. Tax rates and requirements vary based on income and business type.",
  },
  {
    question: "How do I obtain a work permit or visa in Bhutan?",
    answer:
      "Work permits and visas are issued by the Department of Immigration. Employers typically apply on behalf of foreign workers, and requirements include valid contracts and supporting documents.",
  },
  {
    question: "What is the process for land ownership and registration?",
    answer:
      "Land ownership and registration are managed by the National Land Commission. Applications must be submitted with supporting documents, and ownership is subject to verification and approval.",
  },
  {
    question: "How can I appeal a court decision in Bhutan?",
    answer:
      "You can appeal a court decision to a higher court within the prescribed time frame, following the procedures outlined in the Civil and Criminal Procedure Code of Bhutan.",
  },
  {
    question: "Are there laws protecting the environment in Bhutan?",
    answer:
      "Yes, Bhutan has strong environmental protection laws, including the Environmental Protection Act and policies promoting conservation and sustainable development.",
  },
  {
    question: "What are the labor laws and workers' rights in Bhutan?",
    answer:
      "The Labour and Employment Act of Bhutan governs employment conditions, workers' rights, minimum wage, working hours, and dispute resolution.",
  },
  {
    question: "How do I file a complaint against a government agency?",
    answer:
      "You can file complaints through the Anti-Corruption Commission or the relevant government agency's grievance redressal system.",
  },
  {
    question: "Where can I get legal aid or assistance?",
    answer:
      "Legal aid is available through the Bhutan National Legal Institute and some non-governmental organizations. You may also consult private legal practitioners for assistance.",
  },
];

export default function BhutaneseLawFaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-2xl py-8">
      <h1 className="mb-4 text-2xl font-bold">Bhutanese Law FAQs</h1>
      <p className="mb-6 text-gray-600">
        Find answers to common questions about Bhutanese law, rights, and
        government procedures. Click a question to view the answer.
      </p>
      <div className="space-y-3">
        {FAQS.map((faq, idx) => (
          <div
            key={faq.question}
            className="rounded-lg border bg-white shadow-sm"
          >
            <button
              className="flex w-full items-center justify-between px-4 py-3 text-left font-medium focus:bg-blue-50 focus:outline-none"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              aria-expanded={openIndex === idx}
            >
              <span>{faq.question}</span>
              <span className="ml-2 text-blue-600">
                {openIndex === idx ? "-" : "+"}
              </span>
            </button>
            {openIndex === idx && (
              <div className="animate-fade-in px-4 pb-4 text-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
