const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const {
  createProjectValidator,
  updateProjectValidator,
} = require("../validators/projectValidator");

const validationHandler = require("../utils/validationHandler");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, getProjects)
  .post(
    protect,
    authorizeRoles("manager"),
    createProjectValidator,
    validationHandler,
    createProject
  );

router
  .route("/:id")
  .get(protect, getProjectById)
  .put(
    protect,
    authorizeRoles("manager"),
    updateProjectValidator,
    validationHandler,
    updateProject
  )
  .delete(protect, authorizeRoles("manager"), deleteProject);

module.exports = router;