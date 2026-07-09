const { body } = require("express-validator");

const createProjectValidator = [
  body("name")
    .notEmpty()
    .withMessage("Project/category name is required")
    .isLength({ min: 2 })
    .withMessage("Project/category name must be at least 2 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be text"),

  body("assignedMembers")
    .optional()
    .isArray()
    .withMessage("Assigned members must be an array"),
];

const updateProjectValidator = [
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Project/category name must be at least 2 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be text"),

  body("assignedMembers")
    .optional()
    .isArray()
    .withMessage("Assigned members must be an array"),
];

module.exports = {
  createProjectValidator,
  updateProjectValidator,
};