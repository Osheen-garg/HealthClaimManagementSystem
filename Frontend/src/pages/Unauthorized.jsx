import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 shadow-xl text-center">

        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-5">
            <ShieldAlert className="h-16 w-16 text-red-600" />
          </div>
        </div>

        <h1 className="mt-6 text-4xl font-bold text-gray-800">
          403 - Unauthorized
        </h1>

        <p className="mt-4 text-gray-600">
          You don't have permission to access this page.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Please log in with an account that has the required permissions.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Go to Login
          </Link>

          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;