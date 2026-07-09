import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DashboardShell = () => {
  const { user, logout } = useAuth();

  const memberLinks = [
    { label: "Dashboard", path: "/member/dashboard" },
    { label: "My Reports", path: "/member/reports" },
    { label: "Create Report", path: "/member/reports/create" },
  ];

  const managerLinks = [
    { label: "Dashboard", path: "/manager/dashboard" },
    { label: "Team Reports", path: "/manager/team-reports" },
    { label: "Projects", path: "/manager/projects" },
  ];

  const links = user?.role === "manager" ? managerLinks : memberLinks;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-bold text-gray-900">
            Weekly Report Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {user?.name}
              </p>
              <p className="text-xs capitalize text-gray-500">{user?.role}</p>
            </div>

            <button
              onClick={logout}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-xl bg-white p-4 shadow-sm">
          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;