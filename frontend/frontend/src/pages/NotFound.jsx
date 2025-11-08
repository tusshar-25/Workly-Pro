import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // ✅ use user instead of logout

  useEffect(() => {
    const timer = setTimeout(() => {
      // ✅ If user is logged in, go back or to dashboard
      if (user) {
        if (location.key !== "default") {
          navigate(-1); // Go back to previous page
        } else {
          navigate("/dashboard", { replace: true });
        }
      } 
      // ✅ If not logged in, go to login
      else {
        navigate("/login", { replace: true });
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigate, user, location]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-white overflow-hidden relative"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, #0a217d, #111827, #1e293b)",
      }}
    >
      {/* Floating Glow Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-80 h-80 bg-blue-600/20 rounded-full blur-3xl left-[10%] top-[15%] animate-pulse-slow"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl right-[5%] bottom-[10%] animate-pulse"></div>
      </div>

      {/* Logo */}
      <motion.img
        src="/src/assets/logo.png"
        alt="Workly Pro Logo"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-28 h-28 mb-6 drop-shadow-xl z-10"
      />

      {/* Text */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-xl sm:text-2xl font-semibold text-center text-blue-100 z-10"
      >
        Oops! Page not found.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-3 text-blue-200 text-sm sm:text-base z-10"
      >
        Redirecting you to your previous page...
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, rotate: 360 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        className="mt-6 w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin z-10"
      />
    </div>
  );
};

export default NotFound;
