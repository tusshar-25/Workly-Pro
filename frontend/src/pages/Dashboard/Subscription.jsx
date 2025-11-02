import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CalendarDays,
  DollarSign,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Star,
  ShieldCheck,
  Zap,
} from "lucide-react";

const Subscription = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Dummy subscription data
  const subscriptions = [
    {
      _id: "1",
      planName: "Pro Plan",
      description: "Best for growing companies. Includes meetings & tasks.",
      price: 4999,
      duration: 30,
      renewalDate: "2025-11-30",
      status: "Active",
      company: { name: "Workly Pvt. Ltd." },
    },
    {
      _id: "2",
      planName: "Basic Plan",
      description: "Starter plan with limited features and user seats.",
      price: 1999,
      duration: 15,
      renewalDate: "2025-11-15",
      status: "Expired",
      company: { name: "Workly Pvt. Ltd." },
    },
  ];

  // Dummy plan comparison
  const plans = [
    {
      name: "Free",
      price: "₹0",
      features: ["Limited Access", "Basic Tools", "Community Support"],
      highlight: false,
    },
    {
      name: "Basic",
      price: "₹1,999",
      features: ["Meetings Module", "Task Management", "Priority Support"],
      highlight: false,
    },
    {
      name: "Pro",
      price: "₹4,999",
      features: [
        "All Features Unlocked",
        "Unlimited Users",
        "Premium Support",
        "Early Access Updates",
      ],
      highlight: true,
    },
  ];

  const handleRenewClick = () => {
    setShowModal(true);
    setTimeout(() => setShowModal(false), 3000);
  };

  return (
    <div className="p-6 min-h-screen text-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-400">
            💼 Subscription Plans
          </h2>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-400" size={32} />
          </div>
        ) : subscriptions.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No subscription plans found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub, index) => (
              <motion.div
                key={sub._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-b from-gray-900 to-blue-950/40 border border-blue-900/50 rounded-2xl p-5 shadow-lg"
              >
                <h3 className="text-lg font-semibold text-blue-300 mb-2">
                  {sub.planName}
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  {sub.description}
                </p>

                <div className="text-sm text-gray-400 space-y-2">
                  <p className="flex items-center gap-2">
                    <DollarSign size={14} className="text-blue-400" />
                    <span>Price: ₹{sub.price}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-blue-400" />
                    <span>Duration: {sub.duration} days</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <RefreshCcw size={14} className="text-blue-400" />
                    <span>
                      Renewal Date:{" "}
                      {new Date(sub.renewalDate).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                {/* Status */}
                <div className="mt-4 flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-2 ${
                      sub.status === "Active"
                        ? "bg-green-900/30 text-green-400"
                        : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {sub.status === "Active" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}
                    {sub.status}
                  </span>

                  <span className="text-xs text-gray-400">
                    {sub.company.name}
                  </span>
                </div>

                {/* Renew Button */}
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={handleRenewClick}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      sub.status === "Active"
                        ? "bg-gray-800 text-gray-500 hover:cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {sub.status === "Active" ? "Current Plan" : "Renew"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 💡 Modal / Popup Message */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-gray-900 border border-blue-800 rounded-2xl p-6 text-center max-w-md shadow-lg"
              >
                <h3 className="text-xl font-semibold text-blue-400 mb-2">
                  🚀 Subscription Upgrade
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  We’re currently working on bringing you the best subscription
                  experience with exciting new features. 💫
                  <br />
                  Thanks for your patience and support!
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🌟 Plan Comparison Section */}
        <div className="mt-20">
          <h2 className="text-center text-2xl font-semibold text-blue-400 mb-8">
            Compare Our Plans
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl p-6 border shadow-lg ${
                  plan.highlight
                    ? "border-blue-600 bg-gradient-to-b from-blue-900 to-blue-950"
                    : "border-blue-900/50 bg-gradient-to-b from-gray-900 to-blue-950/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className={`text-xl font-bold ${
                      plan.highlight ? "text-blue-300" : "text-gray-200"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  {plan.highlight && <Star className="text-yellow-400" size={18} />}
                </div>

                <p className="text-blue-400 font-semibold text-lg mb-3">
                  {plan.price}
                </p>

                <ul className="text-gray-400 text-sm space-y-2 mb-4">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-blue-400" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleRenewClick}
                  className={`w-full py-2 rounded-lg font-medium transition-all duration-300 ${
                    plan.highlight
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  {plan.name === "Free" ? "Get Started" : "Buy Now"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
