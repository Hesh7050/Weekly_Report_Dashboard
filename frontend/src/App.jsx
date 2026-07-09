import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import DashboardShell from "./components/common/DashboardShell";

import MemberDashboard from "./pages/member/MemberDashboard";
import MyReportsPage from "./pages/member/MyReportsPage";
import CreateReportPage from "./pages/member/CreateReportPage";
import EditReportPage from "./pages/member/EditReportPage";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user?.role === "manager") {
    return <Navigate to="/manager/dashboard" replace />;
  }

  if (isAuthenticated && user?.role === "member") {
    return <Navigate to="/member/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4">
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

const ManagerDashboard = () => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Manager dashboard will be developed in the next phase.
      </p>
    </div>
  );
};

const TeamReportsPage = () => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">Team Reports</h1>
      <p className="mt-2 text-gray-600">
        Team reports page will be developed in the next phase.
      </p>
    </div>
  );
};

const ProjectsPage = () => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
      <p className="mt-2 text-gray-600">
        Project management page will be developed in the next phase.
      </p>
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
          element={
            <ProtectedRoute>
              <DashboardShell />
            </ProtectedRoute>
          }
        >
          <Route
            path="/member/dashboard"
            element={
              <RoleRoute allowedRole="member">
                <MemberDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/member/reports"
            element={
              <RoleRoute allowedRole="member">
                <MyReportsPage />
              </RoleRoute>
            }
          />

          <Route
            path="/member/reports/create"
            element={
              <RoleRoute allowedRole="member">
                <CreateReportPage />
              </RoleRoute>
            }
          />

          <Route
            path="/member/reports/edit/:id"
            element={
              <RoleRoute allowedRole="member">
                <EditReportPage />
              </RoleRoute>
            }
          />

          <Route
            path="/manager/dashboard"
            element={
              <RoleRoute allowedRole="manager">
                <ManagerDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/manager/team-reports"
            element={
              <RoleRoute allowedRole="manager">
                <TeamReportsPage />
              </RoleRoute>
            }
          />

          <Route
            path="/manager/projects"
            element={
              <RoleRoute allowedRole="manager">
                <ProjectsPage />
              </RoleRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;