import { NavLink } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  FolderKanban,
  Home,
  LayoutDashboard,
  PlusCircle,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const memberLinks = [
    {
      name: "Dashboard",
      path: "/member/dashboard",
      icon: Home,
    },
    {
      name: "My Reports",
      path: "/member/reports",
      icon: ClipboardList,
    },
    {
      name: "Create Report",
      path: "/member/reports/create",
      icon: PlusCircle,
    },
  ];

  const managerLinks = [
    {
      name: "Dashboard",
      path: "/manager/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Team Reports",
      path: "/manager/team-reports",
      icon: Users,
    },
    {
      name: "Projects",
      path: "/manager/projects",
      icon: FolderKanban,
    },
  ];

  const links = user?.role === "manager" ? managerLinks : memberLinks;

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 transform border-r border-gray-200 bg-white transition-transform md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-gray-200 px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <BarChart3 size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">WRG</h2>
              <p className="text-xs text-gray-500">Team Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={18} />
                {link.name}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;