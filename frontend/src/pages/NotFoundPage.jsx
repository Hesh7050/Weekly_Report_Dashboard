import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NotFoundPage = () => {
  const { user, isAuthenticated } = useAuth();

  const dashboardPath =
    user?.role === "manager" ? "/manager/dashboard" : "/member/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>

        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-600">
          The page you are looking for does not exist.
        </p>

        <Link
          to={isAuthenticated ? dashboardPath : "/"}
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;