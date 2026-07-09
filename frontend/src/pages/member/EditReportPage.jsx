import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { formatDateForInput } from "../../utils/formatDate";

const EditReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [formData, setFormData] = useState({
    project: "",
    weekStartDate: "",
    weekEndDate: "",
    tasksCompleted: "",
    tasksPlannedNextWeek: "",
    blockers: "",
    hoursWorked: "",
    notes: "",
  });

  const convertArrayToText = (arrayValue) => {
    return Array.isArray(arrayValue) ? arrayValue.join("\n") : "";
  };

  const convertLinesToArray = (text) => {
    return text
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  };

  const fetchData = async () => {
    try {
      setPageLoading(true);

      const [projectsResponse, reportResponse] = await Promise.all([
        api.get("/projects"),
        api.get(`/reports/${id}`),
      ]);

      const report = reportResponse.data.data.report;

      setProjects(projectsResponse.data.data.projects);

      setFormData({
        project: report.project?._id || "",
        weekStartDate: formatDateForInput(report.weekStartDate),
        weekEndDate: formatDateForInput(report.weekEndDate),
        tasksCompleted: convertArrayToText(report.tasksCompleted),
        tasksPlannedNextWeek: convertArrayToText(
          report.tasksPlannedNextWeek
        ),
        blockers: convertArrayToText(report.blockers),
        hoursWorked: report.hoursWorked || "",
        notes: report.notes || "",
      });
    } catch (error) {
      setError("Failed to load report details.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const payload = {
        project: formData.project,
        weekStartDate: formData.weekStartDate,
        weekEndDate: formData.weekEndDate,
        tasksCompleted: convertLinesToArray(formData.tasksCompleted),
        tasksPlannedNextWeek: convertLinesToArray(
          formData.tasksPlannedNextWeek
        ),
        blockers: convertLinesToArray(formData.blockers),
        hoursWorked: Number(formData.hoursWorked || 0),
        notes: formData.notes,
      };

      await api.put(`/reports/${id}`, payload);

      navigate("/member/reports");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update report. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    try {
      setLoading(true);
      await api.patch(`/reports/${id}/submit`);
      navigate("/member/reports");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-gray-600">Loading report...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Weekly Report
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Update your weekly report details.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Project / Category
          </label>
          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Week Start Date
            </label>
            <input
              type="date"
              name="weekStartDate"
              value={formData.weekStartDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Week End Date
            </label>
            <input
              type="date"
              name="weekEndDate"
              value={formData.weekEndDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tasks Completed
          </label>
          <textarea
            name="tasksCompleted"
            value={formData.tasksCompleted}
            onChange={handleChange}
            required
            rows="4"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tasks Planned for Next Week
          </label>
          <textarea
            name="tasksPlannedNextWeek"
            value={formData.tasksPlannedNextWeek}
            onChange={handleChange}
            required
            rows="4"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Blockers / Challenges
          </label>
          <textarea
            name="blockers"
            value={formData.blockers}
            onChange={handleChange}
            rows="3"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Hours Worked
            </label>
            <input
              type="number"
              name="hoursWorked"
              value={formData.hoursWorked}
              onChange={handleChange}
              min="0"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Notes / Links
            </label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Report"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmitReport}
            className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReportPage;