const Report = require("../models/Report");
const Project = require("../models/Project");
const User = require("../models/User");

// @desc    Create weekly report
// @route   POST /api/reports
// @access  Member only
const createReport = async (req, res, next) => {
  try {
    const {
      project,
      weekStartDate,
      weekEndDate,
      tasksCompleted,
      tasksPlannedNextWeek,
      blockers,
      hoursWorked,
      notes,
      status,
    } = req.body;

    const existingProject = await Project.findById(project);

    if (!existingProject) {
      res.status(404);
      throw new Error("Project/category not found");
    }

    const assignedMembers = existingProject.assignedMembers.map((memberId) =>
      memberId.toString()
    );

    if (
      assignedMembers.length > 0 &&
      !assignedMembers.includes(req.user._id.toString())
    ) {
      res.status(403);
      throw new Error("You are not assigned to this project/category");
    }

    const existingReport = await Report.findOne({
      user: req.user._id,
      project,
      weekStartDate: new Date(weekStartDate),
    });

    if (existingReport) {
      res.status(400);
      throw new Error(
        "You already have a report for this project/category and week"
      );
    }

    const reportStatus = status || "draft";

    const report = await Report.create({
      user: req.user._id,
      project,
      weekStartDate,
      weekEndDate,
      tasksCompleted,
      tasksPlannedNextWeek,
      blockers: blockers || [],
      hoursWorked: hoursWorked || 0,
      notes: notes || "",
      status: reportStatus,
      submittedAt: reportStatus === "submitted" ? new Date() : null,
    });

    const populatedReport = await Report.findById(report._id)
      .populate("user", "name email role")
      .populate("project", "name description");

    res.status(201).json({
      success: true,
      message: "Weekly report created successfully",
      data: {
        report: populatedReport,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's reports
// @route   GET /api/reports/my
// @access  Member only
const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ user: req.user._id })
      .populate("project", "name description")
      .sort({ weekStartDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "My weekly reports fetched successfully",
      count: reports.length,
      data: {
        reports,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Owner or manager
const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("user", "name email role")
      .populate("project", "name description");

    if (!report) {
      res.status(404);
      throw new Error("Weekly report not found");
    }

    const isOwner = report.user._id.toString() === req.user._id.toString();
    const isManager = req.user.role === "manager";

    if (!isOwner && !isManager) {
      res.status(403);
      throw new Error("You do not have permission to view this report");
    }

    res.status(200).json({
      success: true,
      message: "Weekly report fetched successfully",
      data: {
        report,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update weekly report
// @route   PUT /api/reports/:id
// @access  Member only, owner only
const updateReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      res.status(404);
      throw new Error("Weekly report not found");
    }

    if (report.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You can only update your own report");
    }

    const {
      project,
      weekStartDate,
      weekEndDate,
      tasksCompleted,
      tasksPlannedNextWeek,
      blockers,
      hoursWorked,
      notes,
    } = req.body;

    if (project) {
      const existingProject = await Project.findById(project);

      if (!existingProject) {
        res.status(404);
        throw new Error("Project/category not found");
      }

      const assignedMembers = existingProject.assignedMembers.map((memberId) =>
        memberId.toString()
      );

      if (
        assignedMembers.length > 0 &&
        !assignedMembers.includes(req.user._id.toString())
      ) {
        res.status(403);
        throw new Error("You are not assigned to this project/category");
      }

      report.project = project;
    }

    if (weekStartDate) {
      report.weekStartDate = weekStartDate;
    }

    if (weekEndDate) {
      report.weekEndDate = weekEndDate;
    }

    if (tasksCompleted) {
      report.tasksCompleted = tasksCompleted;
    }

    if (tasksPlannedNextWeek) {
      report.tasksPlannedNextWeek = tasksPlannedNextWeek;
    }

    if (blockers !== undefined) {
      report.blockers = blockers;
    }

    if (hoursWorked !== undefined) {
      report.hoursWorked = hoursWorked;
    }

    if (notes !== undefined) {
      report.notes = notes;
    }

    const updatedReport = await report.save();

    const populatedReport = await Report.findById(updatedReport._id)
      .populate("user", "name email role")
      .populate("project", "name description");

    res.status(200).json({
      success: true,
      message: "Weekly report updated successfully",
      data: {
        report: populatedReport,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit weekly report
// @route   PATCH /api/reports/:id/submit
// @access  Member only, owner only
const submitReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      res.status(404);
      throw new Error("Weekly report not found");
    }

    if (report.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You can only submit your own report");
    }

    if (report.status === "submitted") {
      return res.status(200).json({
        success: true,
        message: "Weekly report is already submitted",
        data: {
          report,
        },
      });
    }

    report.status = "submitted";
    report.submittedAt = new Date();

    const submittedReport = await report.save();

    const populatedReport = await Report.findById(submittedReport._id)
      .populate("user", "name email role")
      .populate("project", "name description");

    res.status(200).json({
      success: true,
      message: "Weekly report submitted successfully",
      data: {
        report: populatedReport,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete weekly report
// @route   DELETE /api/reports/:id
// @access  Member only, owner only
const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      res.status(404);
      throw new Error("Weekly report not found");
    }

    if (report.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You can only delete your own report");
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: "Weekly report deleted successfully",
      data: {
        deletedReportId: req.params.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manager: get all team reports with filters
// @route   GET /api/reports/team/all
// @access  Manager only
const getTeamReports = async (req, res, next) => {
  try {
    const { member, project, weekStart, weekEnd, dateFrom, dateTo, status } =
      req.query;

    const query = {};

    if (member) {
      query.user = member;
    }

    if (project) {
      query.project = project;
    }

    if (status) {
      query.status = status;
    }

    if (weekStart && weekEnd) {
      query.weekStartDate = { $gte: new Date(weekStart) };
      query.weekEndDate = { $lte: new Date(weekEnd) };
    } else if (dateFrom || dateTo) {
      query.weekStartDate = {};

      if (dateFrom) {
        query.weekStartDate.$gte = new Date(dateFrom);
      }

      if (dateTo) {
        query.weekStartDate.$lte = new Date(dateTo);
      }
    }

    const reports = await Report.find(query)
      .populate("user", "name email role")
      .populate("project", "name description")
      .sort({ weekStartDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Team reports fetched successfully",
      count: reports.length,
      data: {
        reports,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manager: get submission status for selected week
// @route   GET /api/reports/team/status
// @access  Manager only
const getTeamSubmissionStatus = async (req, res, next) => {
  try {
    const { weekStart, weekEnd } = req.query;

    if (!weekStart || !weekEnd) {
      res.status(400);
      throw new Error("weekStart and weekEnd query parameters are required");
    }

    const members = await User.find({ role: "member" }).select("name email role");

    const reports = await Report.find({
      weekStartDate: { $gte: new Date(weekStart) },
      weekEndDate: { $lte: new Date(weekEnd) },
      status: "submitted",
    })
      .populate("user", "name email role")
      .populate("project", "name description");

    const deadline = new Date(weekEnd);
    deadline.setHours(23, 59, 59, 999);

    const statusList = members.map((member) => {
      const memberReports = reports.filter(
        (report) => report.user._id.toString() === member._id.toString()
      );

      if (memberReports.length === 0) {
        return {
          member: {
            id: member._id,
            name: member.name,
            email: member.email,
          },
          status: "pending",
          submittedReports: [],
          submittedAt: null,
        };
      }

      const hasLateReport = memberReports.some(
        (report) => report.submittedAt && report.submittedAt > deadline
      );

      return {
        member: {
          id: member._id,
          name: member.name,
          email: member.email,
        },
        status: hasLateReport ? "late" : "submitted",
        submittedReports: memberReports,
        submittedAt: memberReports[0].submittedAt,
      };
    });

    res.status(200).json({
      success: true,
      message: "Team submission status fetched successfully",
      data: {
        weekStart,
        weekEnd,
        totalMembers: members.length,
        submittedCount: statusList.filter(
          (item) => item.status === "submitted" || item.status === "late"
        ).length,
        pendingCount: statusList.filter((item) => item.status === "pending")
          .length,
        lateCount: statusList.filter((item) => item.status === "late").length,
        statusList,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getMyReports,
  getReportById,
  updateReport,
  submitReport,
  deleteReport,
  getTeamReports,
  getTeamSubmissionStatus,
};