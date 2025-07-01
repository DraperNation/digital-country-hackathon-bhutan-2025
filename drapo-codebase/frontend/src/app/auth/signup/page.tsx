import MultiStepSignup from "./MultiStepSignup";

export default function SignupPage() {
  return (
    <div className="mx-auto mt-10 max-w-xl rounded bg-white p-6 shadow">
      <h1 className="mb-6 text-2xl font-bold">Sign Up</h1>
      <MultiStepSignup />
    </div>
  );
}
