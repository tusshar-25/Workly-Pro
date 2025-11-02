import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByCompany,
  getTasksByEmployee,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.post("/", protect, createTask);
router.get("/", protect, getTasks);

// More specific listing routes
router.get("/company/:companyId", getTasksByCompany);
router.get("/employee/:employeeId", protect, getTasksByEmployee); // ✅ Now works properly
router.get("/:id", protect, getTaskById);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;
