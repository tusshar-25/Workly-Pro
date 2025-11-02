// controllers/taskController.js
import Task from "../models/Task.js";

/**
 * Create a new Task (Admin or Manager only)
 */
export const createTask = async (req, res) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ msg: "Access denied. Admins or Managers only." });
    }

    const { title, description, assignedTo, dueDate, status, priority } =
      req.body;
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

    const populatedTask = await task
      .populate("assignedTo", "name email")
      .populate("company", "name");

    res.status(201).json({
      msg: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    console.error("createTask:", error);
    res.status(400).json({ msg: "Error creating task", error: error.message });
  }
};

/**
 * Get all Tasks (All employees can view)
 */
export const getTasks = async (req, res) => {
  try {
    const { assignedTo } = req.query;
    const companyId = req.user.companyId;

    let filter = { companyId };
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("company", "name")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("getTasks:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/**
 * Get single Task by ID (All employees can view)
 */
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    })
      .populate("assignedTo", "name email")
      .populate("company", "name");

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
      return res
        .status(403)
        .json({ msg: "Access denied. Admins or Managers only." });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, company: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )
      .populate("assignedTo", "name email")
      .populate("company", "name");

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
      return res
        .status(403)
        .json({ msg: "Access denied. Admins or Managers only." });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      company: req.user.companyId,
    });

    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json({ msg: "Task deleted successfully" });
  } catch (error) {
    console.error("deleteTask:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// ✅ Get all tasks by companyId (for dashboard stats)
export const getTasksByCompany = async (req, res) => {
  try {
    const tasks = await Task.find({ companyId: req.params.companyId });
    const active = tasks.filter((t) => t.status === "active").length;
    const completed = tasks.filter((t) => t.status === "completed").length;

    res.json({
      count: tasks.length,
      active,
      completed,
      tasks,
    });
  } catch (error) {
    console.error("getTasksByCompany:", error);
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

// ✅ Get all tasks by employee (for employee dashboard)
export const getTasksByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const tasks = await Task.find({ assignedTo: employeeId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
