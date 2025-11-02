import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import companyRoutes from "./routes/companyRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/companies", companyRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/tasks", taskRoutes);

// Root
app.get("/", (req, res) => {
  res.send(`
    <h1>Workly CRM Backend Running</h1>
    <p>Note: Subscription plans and real-time video meetings are currently under development. 
    All other features like tasks, employees, and meetings (assignment only) are fully functional.</p>
  `);
});

// Error handling for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));