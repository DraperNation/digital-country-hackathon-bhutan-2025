export default function LoginPage() {
  return (
    <div className="mx-auto mt-10 max-w-md rounded bg-white p-6 shadow">
      <h1 className="mb-6 text-2xl font-bold">Login</h1>
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
          Login
        </button>
      </form>
    </div>
  );
}
