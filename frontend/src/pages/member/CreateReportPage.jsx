import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CreateReportPage = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [formData, setFormData] = useState({
    project: "",
    weekStartDate: "",
    weekEndDate: "",
    tasksCompleted: "",
    tasksPlannedNextWeek: "",
    blockers: "",
    hoursWorked: "",
    notes: "",
    status: "draft",
  });

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const response = await api.get("/projects");
      setProjects(response.data.data.projects);
    } catch (error) {
      setError("Failed to load projects. Please check backend.");
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const convertLinesToArray = (text) => {
    return text
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  };

  const handleSubmit = async (e, submitStatus) => {
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
        status: submitStatus,
      };

      await api.post("/reports", payload);

      navigate("/member/reports");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create report. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Create Weekly Report
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Fill the fixed weekly report fields. Write each task in a new line.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-5">
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
            <option value="">
              {projectsLoading ? "Loading projects..." : "Select project"}
            </option>

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
            placeholder={"Example:\nCreated login page\nFixed API error"}
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
            placeholder={"Example:\nCreate dashboard charts\nTest report APIs"}
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
            placeholder={"Example:\nMongoDB connection issue\nCORS issue"}
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
              placeholder="Example: 18"
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
              placeholder="Optional notes or links"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, "draft")}
            className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save as Draft"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, "submitted")}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReportPage;