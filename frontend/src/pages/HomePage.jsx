import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user?.role === "manager") {
    return <Navigate to="/manager/dashboard" replace />;
  }

  if (isAuthenticated && user?.role === "member") {
    return <Navigate to="/member/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 text-center">
        <p className="mb-4 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          Software Engineering Internship Assignment
        </p>

        <h1 className="text-4xl font-bold text-gray-900 md:text-6xl">
          Weekly Report Generator & Team Dashboard
        </h1>

        <p className="mt-5 max-w-2xl text-lg text-gray-600">
          A MERN full-stack application for team members to submit weekly
          reports and managers to view team progress with visual insights.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/login"
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;