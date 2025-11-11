import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginModel = ({ show, onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);


  if (!show) return null;

  // ===== Step 1: Verify company =====
  const handleCompanyLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!companyName || !companyCode) {
      setError("Please enter company name and code");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/companies/login", {
        name: companyName,
        code: companyCode,
      });
      const { companyId: compId, employees: empList = [] } = res.data;
      setCompanyId(compId);
      setEmployees(empList);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid company credentials");
    } finally {
      setLoading(false);
    }
  };

  // ===== Step 2: Employee/Admin login =====
  const handleEmployeeLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!selectedUser || !password) {
      setError("Please select an employee and enter password");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/employees/login", {
        email: selectedUser.email,
        password,
        companyId,
      });
      if (res.data?.token) {
        login({ ...res.data.employee, token: res.data.token });
        navigate("/dashboard");
        onClose();
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Incorrect credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-[#0f172a] text-white rounded-2xl p-8 w-[90%] max-w-md shadow-2xl border border-white/10 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
            >
              ✖
            </button>

            <h2 className="text-2xl font-semibold mb-2 text-center">
              {step === 1 ? "Company Login" : "Employee Login"}
            </h2>
            {error && (
              <p className="text-red-400 text-sm text-center mb-3">{error}</p>
            )}

            {step === 1 ? (
              <form onSubmit={handleCompanyLogin} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-blue-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="Company Code (e.g. COMP-1234)"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-blue-400 outline-none"
                />
                <button
                  type="submit"
                  className="py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition-all font-semibold"
                >
                  {loading ? "Verifying..." : "Continue"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleEmployeeLogin} className="flex flex-col gap-4">
                <p className="text-blue-200 text-sm text-center">
                  Company: <strong>{companyName}</strong>
                </p>
                <div className="relative">
  <div
    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white cursor-pointer flex justify-between items-center"
    onClick={() => setDropdownOpen((prev) => !prev)}
  >
    <span>
      {selectedUser
        ? `${selectedUser.name} (${selectedUser.role})`
        : "Select Employee"}
    </span>
    <span className="text-gray-300 text-sm">
      {dropdownOpen ? "▲" : "▼"}
    </span>
  </div>

  {dropdownOpen && (
    <div
      className="absolute left-0 right-0 mt-2 bg-[#0f172a] border border-white/20 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
    >
      {employees.map((emp, idx) => (
        <div
          key={emp.id || emp._id || idx}
          onClick={() => {
            setSelectedUser(emp);
            setDropdownOpen(false);
          }}
          className={`px-4 py-2 cursor-pointer transition-colors ${
            selectedUser?.email === emp.email
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-500/30 text-gray-200"
          }`}
        >
          {emp.name} ({emp.role})
        </div>
      ))}
    </div>
  )}
</div>          
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-blue-400 outline-none"
                />
                <button
                  type="submit"
                  className="py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition-all font-semibold"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-blue-400 hover:underline mt-2"
                >
                  ← Back to Company Details
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModel;
