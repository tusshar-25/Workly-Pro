// backend/routes/meetingRoutes.js
import express from "express";
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  getMeetingsByCompany,
} from "../controllers/meetingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkAdmin } from "../middleware/checkAdmin.js";

const router = express.Router();

// Meetings list for the company (protected)
router.get("/company/:companyId", protect, getMeetingsByCompany);

// Only logged-in employees can view all meetings (general list)
router.get("/", protect, getMeetings);

// Get meeting by ID (protected)
router.get("/:id", protect, getMeetingById);

// Admin/Manager can modify meetings
router.post("/", protect, checkAdmin, createMeeting);
router.put("/:id", protect, checkAdmin, updateMeeting);
router.delete("/:id", protect, checkAdmin, deleteMeeting);

export default router;
