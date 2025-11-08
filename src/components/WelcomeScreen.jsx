import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const WelcomeScreen = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center text-white z-[9999] overflow-hidden animate-fadeOut"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, #0a217d, #111827, #1e293b)",
      }}
    >
      {/* ===== Floating glowing circles ===== */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float-slow left-[-10%] top-[20%]" />
        <div className="absolute w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-float-medium right-[5%] bottom-[10%]" />
        <div className="absolute w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-float-fast left-[30%] top-[10%]" />
      </div>

      {/* ===== Logo Reveal ===== */}
      <div className="animate-zoom-in mb-6 flex flex-col items-center">
        <img
          src="/logo.png"
          alt="Workly Pro Logo"
          className="w-48 h-48 object-contain drop-shadow-lg"
        />
      </div>

      {/* ===== Text Animation ===== */}
      <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-up text-center">
        Welcome to <span className="text-cyan-300">Workly Pro</span>
      </h1>
      <p className="text-lg md:text-xl opacity-90 animate-fade-in-slow text-center max-w-2xl">
        Manage your company, empower your team, and simplify your workflow.
      </p>
    </div>
  );
};

export default WelcomeScreen;
