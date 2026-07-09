const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    weekStartDate: {
      type: Date,
      required: [true, "Week start date is required"],
    },

    weekEndDate: {
      type: Date,
      required: [true, "Week end date is required"],
    },

    tasksCompleted: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return value && value.length > 0;
        },
        message: "At least one completed task is required",
      },
    },

    tasksPlannedNextWeek: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return value && value.length > 0;
        },
        message: "At least one planned task is required",
      },
    },

    blockers: {
      type: [String],
      default: [],
    },

    hoursWorked: {
      type: Number,
      default: 0,
      min: [0, "Hours worked cannot be negative"],
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "submitted"],
      default: "draft",
    },

    submittedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ user: 1, project: 1, weekStartDate: 1 });

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;