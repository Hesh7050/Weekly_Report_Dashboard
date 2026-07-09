import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../../api/axios";
import { formatDate } from "../../utils/formatDate";

const ManagerDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [tasksTrend, setTasksTrend] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState([]);
  const [projectWorkload, setProjectWorkload] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = new Date();
  const monday = new Date(today);
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  monday.setDate(today.getDate() + diffToMonday);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const [filters, setFilters] = useState({
    weekStart: monday.toISOString().split("T")[0],
    weekEnd: friday.toISOString().split("T")[0],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const query = `weekStart=${filters.weekStart}&weekEnd=${filters.weekEnd}`;

      const [
        summaryResponse,
        trendResponse,
        statusResponse,
        workloadResponse,
        activityResponse,
      ] = await Promise.all([
        api.get(`/dashboard/summary?${query}`),
        api.get("/dashboard/tasks-trend"),
        api.get(`/dashboard/submission-status?${query}`),
        api.get("/dashboard/project-workload"),
        api.get("/dashboard/recent-activity?limit=6"),
      ]);

      setSummary(summaryResponse.data.data);
      setTasksTrend(trendResponse.data.data.trend);
      setSubmissionStatus(statusResponse.data.data.statusByMember);
      setProjectWorkload(workloadResponse.data.data.workload);
      setRecentActivity(activityResponse.data.data.activity);
    } catch (error) {
      setError("Failed to load dashboard data. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchDashboardData();
  };

  const submissionPieData = summary
    ? [
        {
          name: "Submitted",
          value: summary.submittedMembersCount || 0,
        },
        {
          name: "Pending",
          value: summary.pendingMembersCount || 0,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-gray-600">Loading manager dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manager Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              View weekly report submissions, blockers, workload, and team
              progress.
            </p>
          </div>

          <form
            onSubmit={handleApplyFilters}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="date"
              name="weekStart"
              value={filters.weekStart}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />

            <input
              type="date"
              name="weekEnd"
              value={filters.weekEnd}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />

            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Apply
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Reports Submitted This Week
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {summary?.totalReportsSubmittedThisWeek || 0}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Submission Compliance
          </p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {summary?.submissionComplianceRate || 0}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Open Blockers</p>
          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {summary?.openBlockersCount || 0}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Hours</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {summary?.totalHoursWorked || 0}
          </h2>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            Tasks Completed Trend
          </h2>

          {tasksTrend.length === 0 ? (
            <p className="text-sm text-gray-500">No trend data available.</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tasksTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="weekStartDate"
                    tickFormatter={(value) => formatDate(value)}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => `Week: ${formatDate(value)}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalTasksCompleted"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            Submission Status
          </h2>

          {submissionStatus.length === 0 ? (
            <p className="text-sm text-gray-500">No submission data.</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={submissionStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="memberName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="submitted" stackId="a" fill="#16a34a" />
                  <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="late" stackId="a" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            Workload by Project
          </h2>

          {projectWorkload.length === 0 ? (
            <p className="text-sm text-gray-500">No workload data.</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectWorkload}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="projectName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalTasksCompleted" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            Submitted vs Pending
          </h2>

          {submissionPieData.every((item) => item.value === 0) ? (
            <p className="text-sm text-gray-500">No submission data.</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={submissionPieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {submissionPieData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={index === 0 ? "#16a34a" : "#f59e0b"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Recent Activity
        </h2>

        {recentActivity.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity.</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.reportId}
                className="rounded-lg border border-gray-200 p-4"
              >
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{activity.memberName}</span>{" "}
                  {activity.action} for{" "}
                  <span className="font-semibold">{activity.projectName}</span>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Week: {formatDate(activity.weekStartDate)} -{" "}
                  {formatDate(activity.weekEndDate)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;