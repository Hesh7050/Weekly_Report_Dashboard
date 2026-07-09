import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { formatDate } from "../../utils/formatDate";

const MyReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reports/my");
      setReports(response.data.data.reports);
    } catch (error) {
      setError("Failed to load your reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmitReport = async (reportId) => {
    try {
      await api.patch(`/reports/${reportId}/submit`);
      fetchReports();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit report");
    }
  };

  const handleDeleteReport = async (reportId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/reports/${reportId}`);
      fetchReports();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete report");
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-gray-600">Loading your reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 rounded-xl bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
          <p className="mt-1 text-sm text-gray-600">
            View your weekly report history.
          </p>
        </div>

        <Link
          to="/member/reports/create"
          className="rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
        >
          Create New Report
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">No reports yet</h2>
          <p className="mt-2 text-gray-600">
            Start by creating your first weekly report.
          </p>
          <Link
            to="/member/reports/create"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white"
          >
            Create Report
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">
                      {report.project?.name}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        report.status === "submitted"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(report.weekStartDate)} -{" "}
                    {formatDate(report.weekEndDate)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/member/reports/edit/${report._id}`}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </Link>

                  {report.status === "draft" && (
                    <button
                      onClick={() => handleSubmitReport(report._id)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteReport(report._id)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Tasks Completed
                  </h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                    {report.tasksCompleted.map((task, index) => (
                      <li key={index}>{task}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Next Week Plan
                  </h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                    {report.tasksPlannedNextWeek.map((task, index) => (
                      <li key={index}>{task}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {report.blockers.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900">Blockers</h3>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReportsPage;