"use client";
export default function UserDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded bg-white p-6 shadow">
        <h2 className="mb-2 text-xl font-bold">Welcome, [User Name]</h2>
        <p className="text-gray-600">
          Here is your eResidency dashboard. Track your application, KYC status,
          and more.
        </p>
      </section>
      <section className="rounded bg-white p-6 shadow">
        <h3 className="mb-2 text-lg font-semibold">KYC Status</h3>
        <div className="flex items-center gap-4">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            Pending
          </span>
          <span className="text-gray-500">
            (Your application is under review)
          </span>
        </div>
      </section>
      <section className="rounded bg-white p-6 shadow">
        <h3 className="mb-2 text-lg font-semibold">Notifications</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>No new notifications.</li>
        </ul>
      </section>
      <section className="rounded bg-white p-6 shadow">
        <h3 className="mb-2 text-lg font-semibold">Quick Links</h3>
        <div className="flex gap-4">
          <a
            href="/dashboard/eresidency"
            className="text-blue-600 hover:underline"
          >
            eResidency
          </a>
          <a href="/dashboard/wallet" className="text-blue-600 hover:underline">
            Wallet
          </a>
          <a
            href="/dashboard/assistant"
            className="text-blue-600 hover:underline"
          >
            AI Assistant
          </a>
        </div>
      </section>
      <section className="rounded bg-white p-6 shadow">
        <h3 className="mb-2 text-lg font-semibold">Digital Identity (DID)</h3>
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-2 break-all font-mono text-gray-700">
              <span className="font-semibold">DID:</span>{" "}
              did:example:123456789abcdef
            </div>
            <button className="mt-2 rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
              Backup Metadata
            </button>
          </div>
          <div className="flex flex-col items-center">
            {/* Placeholder QR code */}
            <div className="flex h-24 w-24 items-center justify-center rounded bg-gray-200">
              <span className="text-xs text-gray-500">QR Code</span>
            </div>
            <span className="mt-2 text-xs text-gray-500">
              Scan to share DID
            </span>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Linked Credentials</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              <li>eResidency Application</li>
              <li>KYC Verified</li>
              <li>Digital Passport (pending)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
