// controllers/employeeController.js
import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Sanitize employee before returning
 */
const sanitizeEmployee = (emp) => {
  if (!emp) return null;
  const obj = emp.toObject ? emp.toObject() : { ...emp };
  delete obj.password;
  return obj;
};

// ✅ Add employee (Admin only)

export const addEmployee = async (req, res) => {
  try {
    // Only admin can add employee
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    const { name, email, password, role, position, phone, salary, bonus } = req.body;
    const companyId = req.user.companyId;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Name, email & password required" });
    }

    // Check if employee already exists
    const existing = await Employee.findOne({ companyId, email });
    if (existing) {
      return res
        .status(400)
        .json({ msg: "Employee with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const numericSalary = Number(salary) || 0;
    const numericBonus = Number(bonus) || 0;

    // 👇 Ensure salary and bonus are numeric and stored properly
    const newEmp = await Employee.create({
      companyId,
      name,
      email,
      password: hashedPassword,
      role: role || "employee",
      position,
      phone,
      salary: numericSalary,
      bonus: numericBonus,
    });

    // Convert to plain object & sanitize
    const cleanEmp = newEmp.toObject();
    delete cleanEmp.password;

    cleanEmp.salary = numericSalary;
    cleanEmp.bonus = numericBonus;

    return res.status(201).json({
      msg: "Employee created successfully",
      employee: cleanEmp,
    });
  } catch (err) {
    console.error("addEmployee:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Employee login
export const loginEmployee = async (req, res) => {
  try {
    const { email, password, companyId } = req.body;

    if (!email || !password || !companyId)
      return res
        .status(400)
        .json({ msg: "Email, password & companyId required" });

    const employee = await Employee.findOne({ email, companyId });
    if (!employee) return res.status(404).json({ msg: "Employee not found" });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: employee._id, companyId: employee.companyId, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login successful",
      token,
      employee: sanitizeEmployee(employee),
    });
  } catch (err) {
    console.error("loginEmployee:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Get all employees (Admin only)
export const getEmployees = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    const companyId = req.user.companyId;
    const employees = await Employee.find({ companyId }).select("-password");
    res.json(employees);
  } catch (err) {
    console.error("getEmployees:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Get single employee (Admin or Self)
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    // Allow admin or the same employee to view
    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const employee = await Employee.findOne({ _id: id, companyId }).select(
      "-password"
    );
    if (!employee) return res.status(404).json({ msg: "Employee not found" });

    res.json(employee);
  } catch (err) {
    console.error("getEmployeeById:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Update employee (Admin only)
export const updateEmployee = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    const { id } = req.params;
    const updates = { ...req.body };
    const companyId = req.user.companyId;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const employee = await Employee.findOneAndUpdate(
      { _id: id, companyId },
      updates,
      { new: true }
    ).select("-password");

    if (!employee) return res.status(404).json({ msg: "Employee not found" });
    res.json({ msg: "Employee updated successfully", employee });
  } catch (err) {
    console.error("updateEmployee:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Delete employee (Admin only, with optional admin password)
export const deleteEmployee = async (req, res) => {
  try {
    // Ensure only admins can delete
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    const { id } = req.params;
    const { adminPassword } = req.body || {};
    const companyId = req.user.companyId;

    // 🔒 Optional: Check admin password from .env
    if (process.env.ADMIN_PASSWORD && adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ msg: "Invalid admin password" });
    }

    // ✅ Delete employee only if belongs to same company
    const employee = await Employee.findOneAndDelete({ _id: id, companyId });
    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    res.json({ msg: "Employee deleted successfully", deletedId: id });
  } catch (err) {
    console.error("deleteEmployee:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Get all employees by companyId (for stats, dashboard, etc.)
export const getEmployeesByCompany = async (req, res) => {
  try {
    // Match companyId field from Employee model
    const { companyId } = req.params;
    const employees = await Employee.find({ companyId });

    res.json({
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("getEmployeesByCompany:", error);
    res.status(500).json({
      message: "Error fetching employees",
      error: error.message,
    });
  }
};
