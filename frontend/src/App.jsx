import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user?.role === "manager") {
    return <Navigate to="/manager/dashboard" replace />;
  }

  if (isAuthenticated && user?.role === "member") {
    return <Navigate to="/member/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-3xl text-center">
        <p className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          Software Engineering Internship Assignment
        </p>

        <h1 className="text-4xl font-bold text-gray-900 md:text-6xl">
          Weekly Report Generator & Team Dashboard
        </h1>

        <p className="mt-5 text-lg text-gray-600">
          A MERN full-stack application for weekly reports, team progress,
          projects, and manager dashboard analytics.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/login"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Login
          </a>

          <a
            href="/register"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

const MemberDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Member Dashboard
            </h1>
            <p className="mt-1 text-gray-600">Welcome, {user?.name}</p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg bg-gray-900 px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 p-4 text-blue-800">
          Login is working. Next we will add create report and my reports pages.
        </div>
      </div>
    </div>
  );
};

const ManagerDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manager Dashboard
            </h1>
            <p className="mt-1 text-gray-600">Welcome, {user?.name}</p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg bg-gray-900 px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-800">
          Manager login is working. Next we will add charts and team reports.
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RoleRoute = ({ allowedRole, children }) => {
  const { user } = useAuth();

  if (!user || user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/member/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="member">
                <MemberDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="manager">
                <ManagerDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;