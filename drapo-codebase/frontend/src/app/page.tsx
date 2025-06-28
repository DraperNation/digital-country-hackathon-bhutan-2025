// app/page.js
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="mx-auto max-w-md rounded bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-2xl font-bold">{"Welcome"}</h1>
        <form>
          <div className="mb-4">
            <label className="mb-1 block font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-1 block font-medium">Password</label>
            <input
              type="password"
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 font-semibold text-white"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <span>Don&apos;t have an account? </span>
          <Link
            href="/auth/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
