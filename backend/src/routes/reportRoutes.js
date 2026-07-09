const express = require("express");

const {
  createReport,
  getMyReports,
  getReportById,
  updateReport,
  submitReport,
  deleteReport,
  getTeamReports,
  getTeamSubmissionStatus,
} = require("../controllers/reportController");

const {
  createReportValidator,
  updateReportValidator,
} = require("../validators/reportValidator");

const validationHandler = require("../utils/validationHandler");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    authorizeRoles("member"),
    createReportValidator,
    validationHandler,
    createReport
  );

router.get("/my", protect, authorizeRoles("member"), getMyReports);

router.get(
  "/team/all",
  protect,
  authorizeRoles("manager"),
  getTeamReports
);

router.get(
  "/team/status",
  protect,
  authorizeRoles("manager"),
  getTeamSubmissionStatus
);

router
  .route("/:id")
  .get(protect, getReportById)
  .put(
    protect,
    authorizeRoles("member"),
    updateReportValidator,
    validationHandler,
    updateReport
  )
  .delete(protect, authorizeRoles("member"), deleteReport);

router.patch(
  "/:id/submit",
  protect,
  authorizeRoles("member"),
  submitReport
);

module.exports = router;