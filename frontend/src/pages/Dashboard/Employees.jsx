import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Mail, Shield } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Rely on axiosInstance interceptor to attach stored JWT automatically
        const res = await axiosInstance.get("/employees");
        setEmployees(res.data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-400 text-lg font-semibold">
        Loading employees...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-400 py-20 font-medium">{error}</div>
    );

  if (employees.length === 0)
    return (
      <div className="text-center text-gray-400 py-20">
        No employees found 😕
      </div>
    );

  return (
    <div className="p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Users size={36} className="text-blue-400" />
          <h2 className="text-3xl font-bold text-white">All Employees</h2>
        </div>

        <div className="overflow-x-auto bg-gradient-to-br from-gray-900/80 via-blue-950/40 to-black text-white shadow-xl rounded-2xl border border-blue-400/30">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="bg-blue-900/40">
              <tr>
                <th className="px-6 py-3 border-b border-blue-400/30 font-semibold">
                  Name
                </th>
                <th className="px-6 py-3 border-b border-blue-400/30 font-semibold">
                  Email
                </th>
                <th className="px-6 py-3 border-b border-blue-400/30 font-semibold">
                  Position
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <motion.tr
                  key={emp._id || i}
                  whileHover={{ scale: 1, backgroundColor: "rgba(59,130,246,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-6 py-4 border-b border-blue-400/10">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-blue-400" />
                      {emp.name || emp.fullName || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-blue-400/10 flex items-center gap-2">
                    <Mail size={16} className="text-blue-400" />
                    {emp.email}
                  </td>
                  <td className="px-6 py-4 border-b border-blue-400/10 capitalize">
                    {emp.position || "Employee"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Employees;
