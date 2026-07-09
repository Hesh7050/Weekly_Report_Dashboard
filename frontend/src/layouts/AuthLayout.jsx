import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Weekly Report Generator
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage weekly reports and team progress in one place.
            </p>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;