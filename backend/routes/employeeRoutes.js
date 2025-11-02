// routes/employeeRoutes.js
import express from "express";
import {
  addEmployee,
  loginEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeesByCompany,
} from "../controllers/employeeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkAdmin } from "../middleware/checkAdmin.js";

const router = express.Router();

// Public route
router.post("/login", loginEmployee);

// Admin protected routes
router.post("/", protect, checkAdmin, addEmployee);
router.get("/", protect, checkAdmin, getEmployees);
router.get("/:id", protect, getEmployeeById);
router.put("/:id", protect, checkAdmin, updateEmployee);
router.delete("/:id", protect, checkAdmin, deleteEmployee);

router.get("/company/:companyId", getEmployeesByCompany);

export default router;
