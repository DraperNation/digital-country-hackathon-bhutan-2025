"use client";

export default function ThankYouStep() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
      <svg
        className="mb-4"
        width="64"
        height="64"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="12" fill="#DCFCE7" />
        <path
          d="M7 13l3 3 7-7"
          stroke="#22C55E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h2 className="mb-2 text-2xl font-bold text-green-700">Thank You!</h2>
      <p className="mb-4 text-gray-700">
        Your signup and KYC submission has been received.
        <br />
        We will notify you after verification.
      </p>
      <div className="mt-4">
        <a
          href="/auth/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
}
