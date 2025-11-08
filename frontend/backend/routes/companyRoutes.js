// routes/companyRoutes.js
import express from "express";
import {
  registerCompany,
  loginCompany,
  getCompanies,
  updateCompany,
  deleteCompany,
  getCompanyById,
} from "../controllers/companyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkAdmin } from "../middleware/checkAdmin.js";

const router = express.Router();

// Public routes
router.post("/register", registerCompany);
router.post("/login", loginCompany);

// Admin-only routes (protected)
router.get("/", protect, checkAdmin, getCompanies);
router.put("/:companyId", protect, checkAdmin, updateCompany);
router.delete("/:companyId", protect, checkAdmin, deleteCompany);
router.get("/:id", getCompanyById);

export default router;
