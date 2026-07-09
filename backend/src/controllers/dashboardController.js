const Report = require("../models/Report");
const User = require("../models/User");
const Project = require("../models/Project");

// Helper: get current week date range if query dates are not provided
const getDefaultWeekRange = () => {
  const now = new Date();

  const day = now.getDay(); // Sunday = 0, Monday = 1
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + diffToMonday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return {
    weekStart,
    weekEnd,
  };
};

// Helper: build date filter
const buildDateFilter = (weekStart, weekEnd, dateFrom, dateTo) => {
  const filter = {};

  if (weekStart && weekEnd) {
    filter.weekStartDate = { $gte: new Date(weekStart) };
    filter.weekEndDate = { $lte: new Date(weekEnd) };
  } else if (dateFrom || dateTo) {
    filter.weekStartDate = {};

    if (dateFrom) {
      filter.weekStartDate.$gte = new Date(dateFrom);
    }

    if (dateTo) {
      filter.weekStartDate.$lte = new Date(dateTo);
    }
  }

  return filter;
};

// Helper: count real blockers
const countBlockers = (reports) => {
  let totalBlockers = 0;

  reports.forEach((report) => {
    if (Array.isArray(report.blockers)) {
      const validBlockers = report.blockers.filter((blocker) => {
        const text = blocker.trim().toLowerCase();

        return (
          text !== "" &&
          text !== "none" &&
          text !== "no" &&
          text !== "no blockers" &&
          text !== "n/a"
        );
      });

      totalBlockers += validBlockers.length;
    }
  });

  return totalBlockers;
};

// @desc    Manager dashboard summary metrics
// @route   GET /api/dashboard/summary
// @access  Manager only
const getDashboardSummary = async (req, res, next) => {
  try {
    let { weekStart, weekEnd } = req.query;

    if (!weekStart || !weekEnd) {
      const defaultRange = getDefaultWeekRange();
      weekStart = defaultRange.weekStart;
      weekEnd = defaultRange.weekEnd;
    }

    const startDate = new Date(weekStart);
    const endDate = new Date(weekEnd);
    endDate.setHours(23, 59, 59, 999);

    const totalMembers = await User.countDocuments({ role: "member" });

    const reportsThisWeek = await Report.find({
      weekStartDate: { $gte: startDate },
      weekEndDate: { $lte: endDate },
    })
      .populate("user", "name email role")
      .populate("project", "name description");

    const submittedReports = reportsThisWeek.filter(
      (report) => report.status === "submitted"
    );

    const submittedMemberIds = [
      ...new Set(
        submittedReports.map((report) => report.user._id.toString())
      ),
    ];

    const submittedCount = submittedMemberIds.length;
    const pendingCount = Math.max(totalMembers - submittedCount, 0);

    const complianceRate =
      totalMembers === 0
        ? 0
        : Number(((submittedCount / totalMembers) * 100).toFixed(2));

    const openBlockersCount = countBlockers(reportsThisWeek);

    const totalTasksCompleted = reportsThisWeek.reduce((total, report) => {
      return total + report.tasksCompleted.length;
    }, 0);

    const totalHoursWorked = reportsThisWeek.reduce((total, report) => {
      return total + (report.hoursWorked || 0);
    }, 0);

    res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully",
      data: {
        weekStart: startDate,
        weekEnd: endDate,
        totalMembers,
        totalReportsThisWeek: reportsThisWeek.length,
        totalReportsSubmittedThisWeek: submittedReports.length,
        submittedMembersCount: submittedCount,
        pendingMembersCount: pendingCount,
        submissionComplianceRate: complianceRate,
        openBlockersCount,
        totalTasksCompleted,
        totalHoursWorked,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tasks completed trend over time
// @route   GET /api/dashboard/tasks-trend
// @access  Manager only
const getTasksTrend = async (req, res, next) => {
  try {
    const { dateFrom, dateTo, member } = req.query;

    const query = buildDateFilter(null, null, dateFrom, dateTo);

    if (member) {
      query.user = member;
    }

    const trend = await Report.aggregate([
      {
        $match: query,
      },
      {
        $addFields: {
          tasksCompletedCount: {
            $size: {
              $ifNull: ["$tasksCompleted", []],
            },
          },
        },
      },
      {
        $group: {
          _id: {
            weekStartDate: "$weekStartDate",
          },
          totalTasksCompleted: {
            $sum: "$tasksCompletedCount",
          },
          totalReports: {
            $sum: 1,
          },
          totalHoursWorked: {
            $sum: "$hoursWorked",
          },
        },
      },
      {
        $sort: {
          "_id.weekStartDate": 1,
        },
      },
      {
        $project: {
          _id: 0,
          weekStartDate: "$_id.weekStartDate",
          totalTasksCompleted: 1,
          totalReports: 1,
          totalHoursWorked: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Tasks completed trend fetched successfully",
      data: {
        trend,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submission status by team member
// @route   GET /api/dashboard/submission-status
// @access  Manager only
const getSubmissionStatusChart = async (req, res, next) => {
  try {
    let { weekStart, weekEnd } = req.query;

    if (!weekStart || !weekEnd) {
      const defaultRange = getDefaultWeekRange();
      weekStart = defaultRange.weekStart;
      weekEnd = defaultRange.weekEnd;
    }

    const startDate = new Date(weekStart);
    const endDate = new Date(weekEnd);
    endDate.setHours(23, 59, 59, 999);

    const members = await User.find({ role: "member" }).select("name email role");

    const reports = await Report.find({
      weekStartDate: { $gte: startDate },
      weekEndDate: { $lte: endDate },
      status: "submitted",
    })
      .populate("user", "name email role")
      .populate("project", "name description");

    const statusByMember = members.map((member) => {
      const memberReports = reports.filter(
        (report) => report.user._id.toString() === member._id.toString()
      );

      if (memberReports.length === 0) {
        return {
          memberId: member._id,
          memberName: member.name,
          email: member.email,
          status: "pending",
          submitted: 0,
          pending: 1,
          late: 0,
          submittedReportsCount: 0,
        };
      }

      const isLate = memberReports.some(
        (report) => report.submittedAt && report.submittedAt > endDate
      );

      return {
        memberId: member._id,
        memberName: member.name,
        email: member.email,
        status: isLate ? "late" : "submitted",
        submitted: isLate ? 0 : 1,
        pending: 0,
        late: isLate ? 1 : 0,
        submittedReportsCount: memberReports.length,
      };
    });

    const summary = {
      submitted: statusByMember.filter((item) => item.status === "submitted")
        .length,
      pending: statusByMember.filter((item) => item.status === "pending")
        .length,
      late: statusByMember.filter((item) => item.status === "late").length,
    };

    res.status(200).json({
      success: true,
      message: "Submission status chart data fetched successfully",
      data: {
        weekStart: startDate,
        weekEnd: endDate,
        summary,
        statusByMember,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Workload / task distribution by project
// @route   GET /api/dashboard/project-workload
// @access  Manager only
const getProjectWorkload = async (req, res, next) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const query = buildDateFilter(null, null, dateFrom, dateTo);

    const workload = await Report.aggregate([
      {
        $match: query,
      },
      {
        $addFields: {
          tasksCompletedCount: {
            $size: {
              $ifNull: ["$tasksCompleted", []],
            },
          },
          blockersCount: {
            $size: {
              $ifNull: ["$blockers", []],
            },
          },
        },
      },
      {
        $group: {
          _id: "$project",
          totalReports: {
            $sum: 1,
          },
          totalTasksCompleted: {
            $sum: "$tasksCompletedCount",
          },
          totalHoursWorked: {
            $sum: "$hoursWorked",
          },
          totalBlockers: {
            $sum: "$blockersCount",
          },
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $project: {
          _id: 0,
          projectId: "$project._id",
          projectName: "$project.name",
          totalReports: 1,
          totalTasksCompleted: 1,
          totalHoursWorked: 1,
          totalBlockers: 1,
        },
      },
      {
        $sort: {
          totalTasksCompleted: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Project workload chart data fetched successfully",
      data: {
        workload,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Recent reports / activity feed
// @route   GET /api/dashboard/recent-activity
// @access  Manager only
const getRecentActivity = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;

    const recentReports = await Report.find()
      .populate("user", "name email role")
      .populate("project", "name description")
      .sort({ updatedAt: -1 })
      .limit(limit);

    const activity = recentReports.map((report) => {
      let action = "updated a weekly report";

      if (report.status === "submitted") {
        action = "submitted a weekly report";
      }

      if (report.status === "draft") {
        action = "saved a weekly report draft";
      }

      return {
        reportId: report._id,
        memberName: report.user.name,
        memberEmail: report.user.email,
        projectName: report.project.name,
        action,
        status: report.status,
        weekStartDate: report.weekStartDate,
        weekEndDate: report.weekEndDate,
        updatedAt: report.updatedAt,
        submittedAt: report.submittedAt,
      };
    });

    res.status(200).json({
      success: true,
      message: "Recent activity fetched successfully",
      data: {
        activity,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Dashboard overview in one API
// @route   GET /api/dashboard/overview
// @access  Manager only
const getDashboardOverview = async (req, res, next) => {
  try {
    let { weekStart, weekEnd } = req.query;

    if (!weekStart || !weekEnd) {
      const defaultRange = getDefaultWeekRange();
      weekStart = defaultRange.weekStart;
      weekEnd = defaultRange.weekEnd;
    }

    const startDate = new Date(weekStart);
    const endDate = new Date(weekEnd);
    endDate.setHours(23, 59, 59, 999);

    const totalMembers = await User.countDocuments({ role: "member" });
    const totalProjects = await Project.countDocuments();

    const reportsThisWeek = await Report.find({
      weekStartDate: { $gte: startDate },
      weekEndDate: { $lte: endDate },
    })
      .populate("user", "name email role")
      .populate("project", "name description")
      .sort({ updatedAt: -1 });

    const submittedReports = reportsThisWeek.filter(
      (report) => report.status === "submitted"
    );

    const submittedMemberIds = [
      ...new Set(
        submittedReports.map((report) => report.user._id.toString())
      ),
    ];

    const submittedMembersCount = submittedMemberIds.length;
    const pendingMembersCount = Math.max(totalMembers - submittedMembersCount, 0);

    const complianceRate =
      totalMembers === 0
        ? 0
        : Number(((submittedMembersCount / totalMembers) * 100).toFixed(2));

    const openBlockersCount = countBlockers(reportsThisWeek);

    const recentActivity = reportsThisWeek.slice(0, 5).map((report) => ({
      reportId: report._id,
      memberName: report.user.name,
      projectName: report.project.name,
      status: report.status,
      weekStartDate: report.weekStartDate,
      weekEndDate: report.weekEndDate,
      updatedAt: report.updatedAt,
    }));

    res.status(200).json({
      success: true,
      message: "Dashboard overview fetched successfully",
      data: {
        summary: {
          weekStart: startDate,
          weekEnd: endDate,
          totalMembers,
          totalProjects,
          totalReportsThisWeek: reportsThisWeek.length,
          totalReportsSubmittedThisWeek: submittedReports.length,
          submittedMembersCount,
          pendingMembersCount,
          submissionComplianceRate: complianceRate,
          openBlockersCount,
        },
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
  getTasksTrend,
  getSubmissionStatusChart,
  getProjectWorkload,
  getRecentActivity,
  getDashboardOverview,
};