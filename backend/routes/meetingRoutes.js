// routes/meetingRoutes.js
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

// Only logged-in employees can view meetings
router.get("/", protect, getMeetings);
router.get("/:id", protect, getMeetingById);

// Admin/Manager can modify meetings
router.post("/", protect, checkAdmin, createMeeting);
router.put("/:id", protect, checkAdmin, updateMeeting);
router.delete("/:id", protect, checkAdmin, deleteMeeting);
router.get("/company/:companyId", getMeetingsByCompany);

export default router;
