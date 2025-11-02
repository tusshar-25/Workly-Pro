import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
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

  // ===== Step 1: Company verification =====
  const handleCompanyLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!companyName || !companyCode) {
      setError("Please enter company name and code");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post("/companies/login", {
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

  // ===== Step 2: Employee login =====
  const handleEmployeeLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!selectedUser || !password) {
      setError("Please select an employee and enter password");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post("/employees/login", {
        email: selectedUser.email,
        password,
        companyId,
      });

      if (res.data?.token) {
        login({ ...res.data.employee, token: res.data.token });

        // Redirect to common dashboard route
        navigate("/dashboard");
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
    <div
      className="relative flex items-center justify-center min-h-screen overflow-hidden text-white px-4 sm:px-6 md:px-10"
      style={{
        background:
          "linear-gradient(120deg, rgba(10,33,125,0.95), rgba(17,24,39,0.95), rgba(30,41,59,0.95))",
        backgroundSize: "400% 400%",
        animation: "gradientShift 16s ease infinite",
      }}
    >
      {/* Background Blur Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 bg-blue-700/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-[450px] sm:h-[450px] bg-indigo-700/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl mx-auto gap-10 md:gap-16 lg:gap-20">
        {/* LEFT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left px-3 sm:px-6"
        >
          <h1 className="text-3xl mt-5 sm:text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-400">
            Login to Your Workspace
          </h1>
          <p className="text-blue-100 mb-6 text-sm sm:text-base max-w-md mx-auto lg:mx-0">
            Access your personalized Workly dashboard — manage meetings, tasks,
            and productivity.
          </p>
        </motion.div>

        {/* RIGHT SECTION (Card) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 mb-10 w-full max-w-sm sm:max-w-md bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-lg"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-50 mb-6">
            {step === 1 ? "Company Login" : "Employee Login"}
          </h2>

          {error && (
            <motion.p
              className="text-red-400 text-sm text-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              // --- Step 1 ---
              <motion.form
                key="step1"
                onSubmit={handleCompanyLogin}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Enter Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-lg px-4 py-2 text-gray-900 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                />
                <input
                  type="text"
                  placeholder="Enter Company Code"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  className="w-full rounded-lg px-4 py-2 text-gray-900 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 text-sm sm:text-base"
                >
                  {loading ? "Verifying..." : "Continue"}
                </button>
              </motion.form>
            ) : (
              // --- Step 2 ---
              <motion.form
                key="step2"
                onSubmit={handleEmployeeLogin}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <p className="text-blue-100 text-xs sm:text-sm text-center">
                  Company: <strong>{companyName}</strong>
                </p>

                <div className="relative">
                  <div className="w-full bg-white/90 rounded-lg text-gray-800 text-sm sm:text-base focus-within:ring-2 focus-within:ring-blue-400">
                    <select
                      value={selectedUser ? selectedUser.email : ""}
                      onChange={(e) => {
                        const user = employees.find(
                          (u) => u.email === e.target.value
                        );
                        setSelectedUser(user);
                      }}
                      className="w-full rounded-lg px-4 py-2 bg-transparent focus:outline-none"
                    >
                      <option value="">Select Employee</option>
                      {employees?.map((emp, idx) => (
                        <option key={emp.id || emp._id || idx} value={emp.email}>
                          {emp.name} ({emp.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg px-4 py-2 text-gray-900 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 text-sm sm:text-base"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError("");
                    }}
                    className="flex-1 bg-white/90 text-gray-800 py-2 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base"
                  >
                    Back
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
