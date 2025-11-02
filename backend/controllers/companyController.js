import Company from "../models/Company.js";
import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateCompanyId } from "../utils/generateCompanyId.js";

/**
 * Helper: remove sensitive fields from objects before returning to client
 */
const sanitizeCompany = (companyDoc) => {
  if (!companyDoc) return null;
  const obj = companyDoc.toObject ? companyDoc.toObject() : { ...companyDoc };
  delete obj.password;
  return obj;
};

const sanitizeEmployee = (employeeDoc) => {
  if (!employeeDoc) return null;
  const obj = employeeDoc.toObject
    ? employeeDoc.toObject()
    : { ...employeeDoc };
  delete obj.password;
  return obj;
};

/**
 * Register a new company and create an admin employee
 */
export const registerCompany = async (req, res) => {
  try {
    const { name, email, code, password, adminName, adminEmail, admin } =
      req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ msg: "Company name and email are required" });
    }

    // Check if company already exists
    const existing = await Company.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ msg: "Company with this email already exists" });
    }

    // Generate or use provided company code
    const companyId = code || (await generateCompanyId());
    const hashedCompanyPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    // Create company
    const company = await Company.create({
      companyId,
      name,
      email,
      password: hashedCompanyPassword,
      subscriptionPlan: "free",
      subscriptionStatus: "inactive",
    });

    // Prepare admin details (either passed directly or via 'admin' object)
    let adminEmailFinal, adminNameFinal, adminPasswordFinal;

    if (admin && admin.email) {
      adminEmailFinal = admin.email;
      adminNameFinal = admin.name || "Admin User";
      adminPasswordFinal =
        admin.password || Math.random().toString(36).slice(2, 10);
    } else {
      adminEmailFinal =
        adminEmail || `admin@${name.toLowerCase().replace(/\s+/g, "")}.com`;
      adminNameFinal = adminName || "Admin User";
      adminPasswordFinal = password || Math.random().toString(36).slice(2, 10);
    }

    const hashedAdminPass = await bcrypt.hash(adminPasswordFinal, 10);

    // Create admin employee
    const adminEmployee = await Employee.create({
      companyId: company.companyId,
      name: adminNameFinal,
      email: adminEmailFinal,
      password: hashedAdminPass,
      role: "admin",
    });

    // JWT for admin
    const token = jwt.sign(
      {
        id: adminEmployee._id,
        companyId: company.companyId,
        role: adminEmployee.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      msg: "Company registered and admin created",
      company: sanitizeCompany(company),
      admin: sanitizeEmployee(adminEmployee),
      token,
      ...(password ? {} : { tempPassword: adminPasswordFinal }),
    });
  } catch (err) {
    console.error("registerCompany:", err);
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ msg: "Duplicate key error", error: err.keyValue });
    }
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * Step 1: Company Login (by name + code)
 */
export const loginCompany = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res
        .status(400)
        .json({ message: "Company name and code are required" });
    }

    const company = await Company.findOne({ name, companyId: code });
    if (!company) {
      return res.status(400).json({ message: "Invalid company name or code" });
    }

    // Fetch all employees (no password field)
    const employees = await Employee.find({
      companyId: company.companyId,
    }).select("-password");
    if (!employees.length) {
      return res
        .status(400)
        .json({ message: "No employees found for this company" });
    }

    return res.json({
      message: "Company verified successfully",
      companyId: company.companyId,
      companyName: company.name,
      employees: employees.map((emp) => ({
        id: emp._id,
        name: emp.name,
        email: emp.email,
        role: emp.role,
      })),
    });
  } catch (err) {
    console.error("loginCompany:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * Get all companies (Admin-only)
 */
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    console.error("getCompanies:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * Update company (Admin-only)
 */
export const updateCompany = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.companyId;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const company = await Company.findOneAndUpdate(
      { companyId: req.params.companyId },
      updates,
      { new: true }
    ).select("-password");

    if (!company) return res.status(404).json({ msg: "Company not found" });

    res.json({ msg: "Company updated", company });
  } catch (err) {
    console.error("updateCompany:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * Delete company (cascade delete employees)
 */
export const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findOneAndDelete({ companyId });
    if (!company) return res.status(404).json({ msg: "Company not found" });

    await Employee.deleteMany({ companyId });
    // Future: cascade delete tasks, meetings, subscriptions, etc.

    res.json({ msg: "Company and related employees removed" });
  } catch (err) {
    console.error("deleteCompany:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findOne(req.params.id);
    if (!company) {
      return res.status(404).json({ msg: "Company not found" });
    }
    res.status(200).json({ company });
  } catch (err) {
    console.error("getCompanyById:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
