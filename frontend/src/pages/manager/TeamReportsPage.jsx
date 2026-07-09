import { useEffect, useState } from "react";
import api from "../../api/axios";
import { formatDate } from "../../utils/formatDate";

const TeamReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    member: "",
    project: "",
    status: "",
    weekStart: "",
    weekEnd: "",
  });

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      const [reportsResponse, projectsResponse] = await Promise.all([
        api.get("/reports/team/all"),
        api.get("/projects"),
      ]);

      setReports(reportsResponse.data.data.reports);
      setAllReports(reportsResponse.data.data.reports);
      setProjects(projectsResponse.data.data.projects);
    } catch (error) {
      setError("Failed to load team reports.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredReports = async () => {
    try {
      setLoading(true);
      setError("");

      const queryParams = new URLSearchParams();

      if (filters.member) queryParams.append("member", filters.member);
      if (filters.project) queryParams.append("project", filters.project);
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.weekStart) queryParams.append("weekStart", filters.weekStart);
      if (filters.weekEnd) queryParams.append("weekEnd", filters.weekEnd);

      const response = await api.get(`/reports/team/all?${queryParams}`);
      setReports(response.data.data.reports);

      if (filters.weekStart && filters.weekEnd) {
        const statusResponse = await api.get(
          `/reports/team/status?weekStart=${filters.weekStart}&weekEnd=${filters.weekEnd}`
        );
        setSubmissionStatus(statusResponse.data.data);
      } else {
        setSubmissionStatus(null);
      }
    } catch (error) {
      setError("Failed to filter team reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const members = Array.from(
    new Map(
      allReports
        .filter((report) => report.user)
        .map((report) => [
          report.user._id,
          {
            id: report.user._id,
            name: report.user.name,
            email: report.user.email,
          },
        ])
    ).values()
  );

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchFilteredReports();
  };

  const clearFilters = () => {
    setFilters({
      member: "",
      project: "",
      status: "",
      weekStart: "",
      weekEnd: "",
    });

    setSubmissionStatus(null);
    fetchInitialData();
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-gray-600">Loading team reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Team Reports</h1>
        <p className="mt-1 text-sm text-gray-600">
          View all weekly reports and filter by member, project, status, or
          week.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleFilterSubmit}
        className="rounded-xl bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Team Member
            </label>
            <select
              name="member"
              value={filters.member}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All members</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Project
            </label>
            <select
              name="project"
              value={filters.project}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All projects</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Week Start
            </label>
            <input
              type="date"
              name="weekStart"
              value={filters.weekStart}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Week End
            </label>
            <input
              type="date"
              name="weekEnd"
              value={filters.weekEnd}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Apply Filters
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </form>

      {submissionStatus && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Submitted</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {submissionStatus.submittedCount}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
              {submissionStatus.pendingCount}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Late</p>
            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {submissionStatus.lateCount}
            </h2>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Reports ({reports.length})
        </h2>

        {reports.length === 0 ? (
          <p className="text-sm text-gray-500">No reports found.</p>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report._id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {report.user?.name} — {report.project?.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(report.weekStartDate)} -{" "}
                      {formatDate(report.weekEndDate)}
                    </p>
                  </div>

                  <span
                    className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      report.status === "submitted"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Tasks Completed
                    </h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                      {report.tasksCompleted.map((task, index) => (
                        <li key={index}>{task}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Next Week Plan
                    </h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                      {report.tasksPlannedNextWeek.map((task, index) => (
                        <li key={index}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {report.blockers.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900">Blockers</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-600">
                      {report.blockers.map((blocker, index) => (
                        <li key={index}>{blocker}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>Hours: {report.hoursWorked || 0}</span>
                  {report.notes && <span>Notes: {report.notes}</span>}
                  {report.submittedAt && (
                    <span>Submitted: {formatDate(report.submittedAt)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamReportsPage;