const { body } = require("express-validator");

const createReportValidator = [
  body("project").notEmpty().withMessage("Project/category is required"),

  body("weekStartDate")
    .notEmpty()
    .withMessage("Week start date is required")
    .isISO8601()
    .withMessage("Week start date must be a valid date"),

  body("weekEndDate")
    .notEmpty()
    .withMessage("Week end date is required")
    .isISO8601()
    .withMessage("Week end date must be a valid date")
    .custom((value, { req }) => {
      const startDate = new Date(req.body.weekStartDate);
      const endDate = new Date(value);

      if (endDate < startDate) {
        throw new Error("Week end date cannot be before week start date");
      }

      return true;
    }),

  body("tasksCompleted")
    .isArray({ min: 1 })
    .withMessage("Tasks completed must be an array with at least one task"),

  body("tasksCompleted.*")
    .notEmpty()
    .withMessage("Completed task cannot be empty"),

  body("tasksPlannedNextWeek")
    .isArray({ min: 1 })
    .withMessage("Tasks planned for next week must be an array with at least one task"),

  body("tasksPlannedNextWeek.*")
    .notEmpty()
    .withMessage("Planned task cannot be empty"),

  body("blockers")
    .optional()
    .isArray()
    .withMessage("Blockers must be an array"),

  body("hoursWorked")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Hours worked must be a positive number"),

  body("notes").optional().isString().withMessage("Notes must be text"),

  body("status")
    .optional()
    .isIn(["draft", "submitted"])
    .withMessage("Status must be draft or submitted"),
];

const updateReportValidator = [
  body("project").optional().notEmpty().withMessage("Project cannot be empty"),

  body("weekStartDate")
    .optional()
    .isISO8601()
    .withMessage("Week start date must be a valid date"),

  body("weekEndDate")
    .optional()
    .isISO8601()
    .withMessage("Week end date must be a valid date"),

  body("tasksCompleted")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Tasks completed must be an array with at least one task"),

  body("tasksCompleted.*")
    .optional()
    .notEmpty()
    .withMessage("Completed task cannot be empty"),

  body("tasksPlannedNextWeek")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Tasks planned for next week must be an array with at least one task"),

  body("tasksPlannedNextWeek.*")
    .optional()
    .notEmpty()
    .withMessage("Planned task cannot be empty"),

  body("blockers")
    .optional()
    .isArray()
    .withMessage("Blockers must be an array"),

  body("hoursWorked")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Hours worked must be a positive number"),

  body("notes").optional().isString().withMessage("Notes must be text"),
];

module.exports = {
  createReportValidator,
  updateReportValidator,
};