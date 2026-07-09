import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MemberDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Member Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Welcome, {user?.name}. You can create, edit, submit, and view your
          weekly reports here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/member/reports/create"
          className="rounded-xl bg-blue-600 p-6 text-white shadow-sm hover:bg-blue-700"
        >
          <h2 className="text-xl font-bold">Create Weekly Report</h2>
          <p className="mt-2 text-sm text-blue-100">
            Add your completed tasks, next week plans, blockers, hours, and
            notes.
          </p>
        </Link>

        <Link
          to="/member/reports"
          className="rounded-xl bg-white p-6 shadow-sm hover:bg-gray-50"
        >
          <h2 className="text-xl font-bold text-gray-900">My Report History</h2>
          <p className="mt-2 text-sm text-gray-600">
            View your draft and submitted reports organized by week.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default MemberDashboard;