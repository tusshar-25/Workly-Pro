// models/Company.js
import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyId: {
  type: String,
  required: true,
  default: () => `COMP-${Math.floor(1000 + Math.random() * 9000)}`,
},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String }, // optional if you want company-level password; primary auth is employee-based
  subscriptionPlan: { type: String, enum: ["free", "basic", "premium"], default: "free" },
  subscriptionStatus: { type: String, enum: ["active", "inactive"], default: "inactive" },
  subscriptionExpiry: { type: Date, default: null },
  maxEmployees: { type: Number, default: 5 },
  maxTasks: { type: Number, default: 20 },
  maxMeetings: { type: Number, default: 10 },
  employeeCount: { type: Number, default: 0 },
  taskCount: { type: Number, default: 0 },
  meetingCount: { type: Number, default: 0 },
  logoUrl: { type: String, default: null }, // optional file upload URL
}, {
  timestamps: true
});

export default mongoose.models.Company || mongoose.model("Company", companySchema);
