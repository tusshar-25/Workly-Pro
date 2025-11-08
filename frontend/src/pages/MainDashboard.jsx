import React, { useState } from "react";
import { motion } from "framer-motion";
import LoginModal from "../components/LoginModel";
import RegisterCompanyModal from "../components/RegisterModel";

const MainDashboard = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const closeAllModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  // ✅ Feature list for WorklyPro
  const features = [
    {
      icon: "👥",
      title: "Employee Management",
      desc: "Add, organize, and monitor your employees with role-based access for Admin and Staff."
    },
    {
      icon: "✅",
      title: "Task & Project Tracking",
      desc: "Assign, prioritize, and track progress for tasks in real-time with clear visibility."
    },
    {
      icon: "📅",
      title: "Meeting Scheduler",
      desc: "Easily schedule and manage company meetings with reminders and notes."
    },
    {
      icon: "💳",
      title: "Subscription & Billing",
      desc: "Control your plan, manage payments, and receive renewal alerts in one dashboard."
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      desc: "Monitor team performance and company productivity with intuitive charts."
    },
    {
      icon: "🔐",
      title: "Secure Authentication",
      desc: "Token-based login, company-specific access, and secure employee authorization."
    },
  ];

  // ✅ How it works steps
  const steps = [
    {
      step: "1️⃣ Register Company",
      desc: "Admin registers a company. A unique Company Code (e.g., COMP-1234) is generated automatically."
    },
    {
      step: "2️⃣ Set Company Password",
      desc: "Admin sets a single password for the entire company. Employees use the same password to log in."
    },
    {
      step: "3️⃣ Invite Employees",
      desc: "Share your Company Name & Code with team members. They can log in using that info."
    },
    {
      step: "4️⃣ Manage & Grow",
      desc: "Admins can track employees, manage meetings, assign tasks, and review analytics seamlessly."
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white  px-6 relative overflow-hidden">
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="text-center z-10 mt-20"
      >
        <h1 className="text-5xl sm:text-6xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Welcome to WorklyPro
        </h1>
        <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
          The all-in-one company management platform — simplify workflows,
          boost productivity, and empower your teams.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!showLogin && !showRegister && (
            <>
              <motion.button
                onClick={openLogin}
                whileHover={{ scale: 1.1 }}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-blue-500 hover:to-blue-700 transition-all"
              >
                Login
              </motion.button>

              <motion.button
                onClick={openRegister}
                whileHover={{ scale: 1.1 }}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-green-400 hover:to-green-600 transition-all"
              >
                Register Company
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      {/* Features Section */}
      <section className="mt-20 max-w-6xl mx-auto text-center z-10">
        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">
          What WorklyPro Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/10 border border-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:bg-white/20 transition-all"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-100">{f.title}</h3>
              <p className="text-sm text-blue-200">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mt-24 max-w-5xl mb-16 mx-auto text-center z-10">
        <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 border border-white/10 backdrop-blur-md rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-blue-100 mb-2">{s.step}</h3>
              <p className="text-sm text-blue-200">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose WorklyPro */}
<section className="mt-20 max-w-6xl mb-16 mx-auto text-center z-10">
  <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
    Why Choose WorklyPro?
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      { number: "500+", label: "Companies Registered" },
      { number: "3,000+", label: "Active Employees" },
      { number: "10K+", label: "Tasks Completed" },
      { number: "99.9%", label: "Uptime & Security" },
    ].map((stat, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
        className="bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/20 transition-all shadow-lg"
      >
        <h3 className="text-4xl font-bold text-blue-300 mb-2">{stat.number}</h3>
        <p className="text-blue-200 text-sm">{stat.label}</p>
      </motion.div>
    ))}
  </div>

  {/* CTA */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.4 }}
    className="mt-14"
  >
    <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-100">
      Join hundreds of growing companies using WorklyPro
    </h3>
    <motion.button
      onClick={() => setShowRegister(true)}
      whileHover={{ scale: 1.1 }}
      className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-blue-500 hover:to-cyan-400 transition-all"
    >
      Get Started for Free →
    </motion.button>
  </motion.div>
</section>


      {/* Modals */}
      {showLogin && <LoginModal show={showLogin} onClose={closeAllModals} />}
      {showRegister && <RegisterCompanyModal show={showRegister} onClose={closeAllModals} />}
    </div>
  );
};

export default MainDashboard;
