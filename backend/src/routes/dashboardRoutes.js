const express = require("express");

const {
  getDashboardSummary,
  getTasksTrend,
  getSubmissionStatusChart,
  getProjectWorkload,
  getRecentActivity,
  getDashboardOverview,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/summary",
  protect,
  authorizeRoles("manager"),
  getDashboardSummary
);

router.get(
  "/tasks-trend",
  protect,
  authorizeRoles("manager"),
  getTasksTrend
);

router.get(
  "/submission-status",
  protect,
  authorizeRoles("manager"),
  getSubmissionStatusChart
);

router.get(
  "/project-workload",
  protect,
  authorizeRoles("manager"),
  getProjectWorkload
);

router.get(
  "/recent-activity",
  protect,
  authorizeRoles("manager"),
  getRecentActivity
);

router.get(
  "/overview",
  protect,
  authorizeRoles("manager"),
  getDashboardOverview
);

module.exports = router;