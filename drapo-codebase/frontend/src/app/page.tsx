// app/page.js
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <img
            src="/assets/logos/main.svg"
            alt="E-Bhutan Logo"
            className="mx-auto mb-4 h-16"
          />
          <h1 className="mb-4 text-4xl font-extrabold text-gray-900">
            Welcome to E-Bhutan Digital Identity & Citizenship Platform
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            A comprehensive decentralized platform for digital identity,
            eResidency, business, government services, and more—empowering
            Bhutanese citizens and residents.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Digital Identity */}
          <FeatureCard
            title="Digital Identity"
            description="Manage your decentralized identity, credentials, and biometric authentication."
            href="/dashboard/identity"
            icon="🪪"
          />
          {/* eResidency */}
          <FeatureCard
            title="eResidency"
            description="Apply for eResidency, manage certificates, KYC, and digital company incorporation."
            href="/dashboard/eresidency"
            icon="🌏"
          />
          {/* Business Services */}
          <FeatureCard
            title="Business Services"
            description="Register businesses, manage tax, documents, and access business dashboards."
            href="/dashboard/business"
            icon="🏢"
          />
          {/* Wallet & Currency */}
          <FeatureCard
            title="Wallet & Currency"
            description="Access your digital wallet, transfer funds, view transactions, and manage BhutanBTC."
            href="/dashboard/wallet"
            icon="💸"
          />
          {/* AI Government Assistant */}
          <FeatureCard
            title="AI Government Assistant"
            description="Get instant help with government services, Bhutanese law, and Dzongkha support."
            href="/dashboard/assistant"
            icon="🤖"
          />
          {/* Reputation & Attestations */}
          <FeatureCard
            title="Reputation & Attestations"
            description="View your reputation score, proof of personhood, and verifiable attestations."
            href="/dashboard/reputation"
            icon="⭐"
          />
          {/* Documents */}
          <FeatureCard
            title="Documents"
            description="Request, apply, eSign, and manage your official documents."
            href="/dashboard/documents"
            icon="📄"
          />
          {/* Community Contributions */}
          <FeatureCard
            title="Community Contributions"
            description="Track your volunteer activities and community engagement."
            href="/dashboard/reputation/contributions"
            icon="🎯"
          />
          {/* Settings & Profile */}
          <FeatureCard
            title="Profile & Settings"
            description="Manage your personal information, security, and preferences."
            href="/profile"
            icon="👤"
          />
        </div>
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} E-Bhutan Digital Identity
            Platform. Powered by blockchain & AI.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      className="block h-full rounded-lg border border-gray-200 bg-white p-6 shadow transition hover:shadow-lg"
    >
      <div className="mb-4 flex items-center">
        <span className="mr-3 text-3xl">{icon}</span>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <p className="mb-2 text-gray-600">{description}</p>
      <span className="mt-2 inline-block font-medium text-blue-600">
        Explore &rarr;
      </span>
    </a>
  );
}
