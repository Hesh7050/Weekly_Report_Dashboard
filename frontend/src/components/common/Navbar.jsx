import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          >
            <Menu size={22} />
          </button>

          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Weekly Report Dashboard
            </h1>
            <p className="hidden text-xs text-gray-500 sm:block">
              Team reports, insights, and project tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs capitalize text-gray-500">{user?.role}</p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;