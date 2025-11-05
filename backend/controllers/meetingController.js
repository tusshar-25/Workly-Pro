// controllers/meetingController.js
import Meeting from "../models/Meeting.js";

/**
 * Helper function to validate admin password
 */
const validateAdminPassword = (password) => {
  return password === process.env.ADMIN_PASSWORD; // Set strong password in .env
};

/**
 * Create a new meeting (Admin or Manager only)
 */
export const createMeeting = async (req, res) => {
  try {
    const { title, description, datetime, participants, location, adminPassword } = req.body;
    const companyId = req.user.companyId;
    const createdBy = req.user.id;

    // Role check
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied. Admins or Managers only." });
    }

    // Admin password check
    if (!adminPassword) return res.status(400).json({ msg: "Admin password is required" });
    if (!validateAdminPassword(adminPassword)) return res.status(401).json({ msg: "Invalid admin password" });

    // Required fields check
    if (!title || !datetime) return res.status(400).json({ msg: "Title and date are required" });

    const dt = new Date(datetime);
    if (isNaN(dt.getTime())) return res.status(400).json({ msg: "Invalid date format" });

    // Create meeting
    const meeting = await Meeting.create({
      companyId,
      title,
      description,
      datetime: dt,
      createdBy,
      participants,
      location,
    });

    res.status(201).json({ msg: "Meeting created successfully", meeting });
  } catch (err) {
    console.error("createMeeting:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * Get all meetings (All employees can view)
 */
export const getMeetings = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const meetings = await Meeting.find({ companyId })
      .populate("participants", "name email")
      .populate("createdBy", "name email")
      .sort({ datetime: -1 });

    res.json(meetings);
  } catch (err) {
    console.error("getMeetings:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * Get meeting by ID (All employees can view)
 */
export const getMeetingById = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const meeting = await Meeting.findOne({ _id: req.params.id, companyId })
      .populate("participants", "name email")
      .populate("createdBy", "name email");

    if (!meeting) return res.status(404).json({ msg: "Meeting not found" });

    res.json(meeting);
  } catch (err) {
    console.error("getMeetingById:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * Update a meeting (Admin or Manager only)
 */
export const updateMeeting = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { adminPassword, ...updates } = req.body;

    // Role check
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied. Admins or Managers only." });
    }

    // Admin password check
    if (!adminPassword) return res.status(400).json({ msg: "Admin password is required" });
    if (!validateAdminPassword(adminPassword)) return res.status(401).json({ msg: "Invalid admin password" });

    const meeting = await Meeting.findOneAndUpdate(
      { _id: req.params.id, companyId },
      updates,
      { new: true }
    );

    if (!meeting) return res.status(404).json({ msg: "Meeting not found" });

    res.json({ msg: "Meeting updated successfully", meeting });
  } catch (err) {
    console.error("updateMeeting:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * Delete a meeting (Admin or Manager only)
 */
export const deleteMeeting = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { adminPassword } = req.body;

    // Role check
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied. Admins or Managers only." });
    }

    // Admin password check
    if (!adminPassword) return res.status(400).json({ msg: "Admin password is required" });
    if (!validateAdminPassword(adminPassword)) return res.status(401).json({ msg: "Invalid admin password" });

    const meeting = await Meeting.findOneAndDelete({
      _id: req.params.id,
      companyId,
    });

    if (!meeting) return res.status(404).json({ msg: "Meeting not found" });

    res.json({ msg: "Meeting deleted successfully" });
  } catch (err) {
    console.error("deleteMeeting:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * Get all meetings by companyId (for dashboard stats)
 */
export const getMeetingsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const meetings = await Meeting.find({ companyId });

    res.json({
      count: meetings.length,
      meetings,
    });
  } catch (error) {
    console.error("getMeetingsByCompany:", error);
    res.status(500).json({
      message: "Error fetching meetings",
      error: error.message,
    });
  }
};
