// models/Meeting.js
import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  companyId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  status: { 
    type: String, 
    enum: ["scheduled", "completed", "cancelled"], 
    default: "scheduled" 
  },
  location: { type: String, default: "Online" },
}, {
  timestamps: true,
});

export default mongoose.models.Meeting || mongoose.model("Meeting", meetingSchema);
