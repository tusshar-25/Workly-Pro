import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterModel = ({ show, onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null;

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
      const res = await axiosInstance.post("api/companies/register", {
        name: companyName,
        email: companyEmail,
        adminName,
        adminEmail,
        adminPassword,
      });

      login({
        ...res.data.admin,
        token: res.data.token,
        role: "admin",
        companyId: res.data.company.companyId,
      });
      navigate("/admin/dashboard");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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

            <h2 className="text-2xl font-semibold mb-3 text-center">
              Register Your Company 🚀
            </h2>
            {error && (
              <p className="text-red-400 text-sm text-center mb-3">{error}</p>
            )}

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-blue-400 outline-none"
              />
              <input
                type="email"
                placeholder="Company Email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-blue-400 outline-none"
              />
              <input
                type="text"
                placeholder="Admin Name"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-indigo-400 outline-none"
              />
              <input
                type="email"
                placeholder="Admin Email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-indigo-400 outline-none"
              />
              <input
                type="password"
                placeholder="Admin Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-indigo-400 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition-all font-semibold"
              >
                {loading ? "Registering..." : "Register Company"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModel;
