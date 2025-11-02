// models/Employee.js
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  companyId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "manager", "employee"],
    default: "employee",
  },
  salary: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  position: { type: String, default: null },
  phone: { type: String, default: null },
  joinedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

// prevent duplicate employee emails inside same company
employeeSchema.index({ companyId: 1, email: 1 }, { unique: true });

export default mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
