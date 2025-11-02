import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    companyId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    dueDate: { type: Date, default: null },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "On Hold"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
