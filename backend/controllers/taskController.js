// controllers/taskController.js
import Task from "../models/Task.js";

/**
 * Create a new Task (Admin or Manager only)
 */
export const createTask = async (req, res) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied. Admins or Managers only." });
    }

    const { title, description, assignedTo, dueDate, status, priority } = req.body;
    const companyId = req.user.companyId;

    if (!title || !assignedTo) {
      return res.status(400).json({ msg: "Title and assignedTo are required" });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      dueDate,
      status,
      priority,
      companyId,
      createdBy: req.user.id,
    });

    const populatedTask = await task.populate("assignedTo", "name email");

    res.status(201).json({ msg: "Task created successfully", task: populatedTask });
  } catch (error) {
    console.error("createTask:", error);
    res.status(400).json({ msg: "Error creating task", error: error.message });
  }
};

/**
 * Get all Tasks (for Admin or Employee)
 */
export const getTasks = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    let filter = { companyId };

    // Admin can fetch all, employee only their tasks
    if (req.user.role !== "admin") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    console.error("getTasks:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/**
 * Get single Task by ID
 */
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, companyId: req.user.companyId })
      .populate("assignedTo", "name email");

    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json(task);
  } catch (error) {
    console.error("getTaskById:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/**
 * Update a Task (Admin or Manager only)
 */
export const updateTask = async (req, res) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied. Admins or Managers only." });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    ).populate("assignedTo", "name email");

    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json({ msg: "Task updated successfully", task });
  } catch (error) {
    console.error("updateTask:", error);
    res.status(400).json({ msg: "Error updating task", error: error.message });
  }
};

/**
 * Delete a Task (Admin or Manager only)
 */
export const deleteTask = async (req, res) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied. Admins or Managers only." });
    }

    const task = await Task.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
    if (!task) return res.status(404).json({ msg: "Task not found" });

    res.json({ msg: "Task deleted successfully" });
  } catch (error) {
    console.error("deleteTask:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/**
 * Get tasks by companyId (for admin dashboard)
 */
export const getTasksByCompany = async (req, res) => {
  try {
    const tasks = await Task.find({ companyId: req.params.companyId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
    res.json({ tasks, count: tasks.length });
  } catch (error) {
    console.error("getTasksByCompany:", error);
    res.status(500).json({ msg: "Error fetching tasks", error: error.message });
  }
};

/**
 * Get tasks by employeeId (for employee dashboard)
 */
export const getTasksByEmployee = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.employeeId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    console.error("getTasksByEmployee:", error);
    res.status(500).json({ msg: "Error fetching tasks", error: error.message });
  }
};
