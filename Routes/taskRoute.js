import mongoose from "mongoose";
import express from "express";
import Task from "../Models/Tasks.js";
import Project from "../Models/Projects.js";
import sendEmail from "../utils/email.js";
const router = express.Router();
import {
  checkAdminRole,
  checkMemberRole,
  verifyToken,
} from "../Middleware/authMiddleware.js";
import Member from "../Models/Members.js";

// Create task for a project
router.post("/create-task", verifyToken, checkAdminRole, async (req, res) => {
  try {
    const { title, assignedTo, deadline, status, projectId } = req.body;

    if (!title || !assignedTo || !deadline || !projectId) {
      return res.status(400).json({
        message:
          "All fields are required: title, assignedTo, deadline, projectId",
      });
    }
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const newTask = new Task({
      title,
      assignedTo,
      deadline,
      status,
      subOf: projectId,
    });

    const savedTask = await newTask.save();
    await Project.findByIdAndUpdate(
      projectId,
      {
        $push: { hasTask: savedTask._id },
      },
      { new: true }
    );
    const user = await Member.findById(assignedTo);
    await sendEmail({ email: user.email, taskTitle: newTask.title });
    res.status(201).json({
      message: "Task created successfully and assigned to project",
      task: savedTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all tasks
router.get("/get-all-tasks", verifyToken, checkAdminRole, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update task status
router.put(
  "/update-task-status/:taskId",
  verifyToken,
  checkMemberRole,
  async (req, res) => {
    try {
      const { status } = req.body;
      const { taskId } = req.params;
      if (!taskId || !status) {
        return res
          .status(400)
          .json({ message: "Task ID and status are required" });
      }
      const validStatuses = ["Inprogress", "Complete", "NotStarted"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      const task = await Task.findByIdAndUpdate(
        taskId,
        { status: status },
        { new: true, runValidators: true }
      );
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const user = await Member.findById(task.assignedTo);
      console.log(user);
      await sendEmail({
        email: user.email,
        taskTitle: task.title,
        newStatus: task.status,
      });
      res
        .status(200)
        .json({ message: "Task status updated successfully", task });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Get the current status of a task
router.get("/updated-task/:taskId", verifyToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({
      message: "Task status retrieved successfully",
      status: task.status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update task deadline
router.put(
  "/update-deadline-task/:taskId",
  verifyToken,
  checkAdminRole,
  async (req, res) => {
    try {
      const { deadline } = req.body;
      const { taskId } = req.params;
      if (!taskId || !deadline) {
        return res
          .status(400)
          .json({ message: "Task ID and deadline are required" });
      }
      const parsedDeadline = new Date(deadline);
      if (isNaN(parsedDeadline)) {
        return res
          .status(400)
          .json({ message: "Invalid date format for deadline" });
      }
      const task = await Task.findByIdAndUpdate(
        taskId,
        { deadline: parsedDeadline },
        { new: true, runValidators: true }
      );
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res
        .status(200)
        .json({ message: "Task deadline updated successfully", task });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Get task deadline
router.get("/get-task-deadline/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task found", deadline: task.deadline });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all tasks
router.get(
  "/get-my-task/:projectId",
  verifyToken,
  checkMemberRole,
  async (req, res) => {
    try {
      const { projectId } = req.params;
      const id = req.user.id; // Logged-in user's ID
      const tasks = await Task.find({ subOf: projectId, assignedTo: id }) // Filter tasks by assigned user ID
        .populate("assignedTo", "name email") // Populate assigned user details
        .sort({ createdAt: -1 });

      res.status(200).json({ tasks });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.get(
  "/get-tasks/:projectId",
  verifyToken,
  checkAdminRole,
  async (req, res) => {
    try {
      const { projectId } = req.params;
      const tasks = await Task.find({ subOf: projectId }) // Filter tasks by assigned user ID
        .populate("assignedTo", "name email") // Populate assigned user details
        .sort({ createdAt: -1 });

      res.status(200).json({ tasks });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
