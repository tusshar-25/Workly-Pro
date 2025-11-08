import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import Employee from "../models/Employee.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info (employee) to request
      const employee = await Employee.findById(decoded.id).select("-password");

      if (!employee) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = {
        id: employee._id,
        companyId: employee.companyId,
        role: employee.role,
      };

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
