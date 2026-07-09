import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-soft px-4">
      <div className="max-w-md rounded-xl bg-white p-8 text-center shadow">
        <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>
        <p className="mt-3 text-gray-600">
          You do not have permission to access this page.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-primary px-5 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;