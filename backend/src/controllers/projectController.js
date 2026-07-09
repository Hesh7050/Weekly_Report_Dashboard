const Project = require("../models/Project");
const User = require("../models/User");

// @desc    Create project/category
// @route   POST /api/projects
// @access  Manager only
const createProject = async (req, res, next) => {
  try {
    const { name, description, assignedMembers } = req.body;

    const existingProject = await Project.findOne({ name });

    if (existingProject) {
      res.status(400);
      throw new Error("Project/category already exists with this name");
    }

    const project = await Project.create({
      name,
      description: description || "",
      assignedMembers: assignedMembers || [],
      createdBy: req.user._id,
    });

    if (assignedMembers && assignedMembers.length > 0) {
      await User.updateMany(
        { _id: { $in: assignedMembers } },
        { $addToSet: { assignedProjects: project._id } }
      );
    }

    const populatedProject = await Project.findById(project._id)
      .populate("assignedMembers", "name email role")
      .populate("createdBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Project/category created successfully",
      data: {
        project: populatedProject,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects/categories
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === "member") {
      query = {
        $or: [
          { assignedMembers: req.user._id },
          { assignedMembers: { $size: 0 } },
        ],
      };
    }

    const projects = await Project.find(query)
      .populate("assignedMembers", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Projects/categories fetched successfully",
      count: projects.length,
      data: {
        projects,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project/category
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("assignedMembers", "name email role")
      .populate("createdBy", "name email role");

    if (!project) {
      res.status(404);
      throw new Error("Project/category not found");
    }

    res.status(200).json({
      success: true,
      message: "Project/category fetched successfully",
      data: {
        project,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project/category
// @route   PUT /api/projects/:id
// @access  Manager only
const updateProject = async (req, res, next) => {
  try {
    const { name, description, assignedMembers } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error("Project/category not found");
    }

    if (name && name !== project.name) {
      const existingProject = await Project.findOne({ name });

      if (existingProject) {
        res.status(400);
        throw new Error("Another project/category already has this name");
      }

      project.name = name;
    }

    if (description !== undefined) {
      project.description = description;
    }

    if (assignedMembers !== undefined) {
      const oldAssignedMembers = project.assignedMembers;

      await User.updateMany(
        { _id: { $in: oldAssignedMembers } },
        { $pull: { assignedProjects: project._id } }
      );

      await User.updateMany(
        { _id: { $in: assignedMembers } },
        { $addToSet: { assignedProjects: project._id } }
      );

      project.assignedMembers = assignedMembers;
    }

    const updatedProject = await project.save();

    const populatedProject = await Project.findById(updatedProject._id)
      .populate("assignedMembers", "name email role")
      .populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Project/category updated successfully",
      data: {
        project: populatedProject,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project/category
// @route   DELETE /api/projects/:id
// @access  Manager only
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error("Project/category not found");
    }

    await User.updateMany(
      { _id: { $in: project.assignedMembers } },
      { $pull: { assignedProjects: project._id } }
    );

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project/category deleted successfully",
      data: {
        deletedProjectId: req.params.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};