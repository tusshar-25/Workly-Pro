import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !companyName ||
      !companyEmail ||
      !adminName ||
      !adminEmail ||
      !adminPassword
    ) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/companies/register", {
        name: companyName,
        email: companyEmail,
        adminName,
        adminEmail,
        adminPassword,
      });

      // ✅ Store admin + token properly in context
      login({
        ...res.data.admin,
        token: res.data.token,
        role: "admin",
        companyId: res.data.company.companyId,
      });

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
      {/* ===== Animated backdrop circles ===== */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 bg-blue-700/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-[450px] sm:h-[450px] bg-indigo-700/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl mx-auto gap-10 md:gap-16 lg:gap-20">
        {/* ===== LEFT SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left px-3 sm:px-6"
        >
          <h1 className="text-3xl mt-5 sm:text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-400">
            Register Your Company 🚀
          </h1>
          <p className="text-blue-100 mb-6 text-sm sm:text-base max-w-md mx-auto lg:mx-0">
            Create your company workspace on Workly — manage employees, schedule
            meetings, and track performance in one smart dashboard.
          </p>

          <ul className="space-y-2 text-blue-200 mb-8 text-sm sm:text-base">
            <li>✔ Secure company and admin registration</li>
            <li>✔ Manage unlimited employees easily</li>
            <li>✔ Track performance and tasks</li>
            <li>✔ Upgrade to premium anytime</li>
          </ul>
        </motion.div>

        {/* ===== RIGHT SECTION ===== */}
        <motion.form
          onSubmit={handleRegister}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 mb-10 w-full max-w-sm sm:max-w-md bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-lg"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-50 mb-6">
            Company Registration
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

          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-lg px-4 py-2 text-gray-900 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            />
            <input
              type="email"
              placeholder="Company Email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              className="w-full rounded-lg px-4 py-2 text-gray-900 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="Admin Name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full rounded-lg px-4 py-2 text-gray-900 bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
            />
            <input
              type="email"
              placeholder="Admin Email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full rounded-lg px-4 py-2 text-gray-900 bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full rounded-lg px-4 py-2 text-gray-900 bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 text-sm sm:text-base"
          >
            {loading ? "Registering..." : "Register Company"}
          </button>

          <p className="mt-6 text-xs sm:text-sm text-blue-100 text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="font-semibold text-blue-300 cursor-pointer hover:underline"
            >
              Login here
            </span>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Register;
