import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaTasks,
  FaCalendarAlt,
  FaBuilding,
  FaMoneyBillWave,
  FaChartLine,
  FaBell,
  FaRegNewspaper,
  FaClipboardCheck,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState({});
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [meetingCount, setMeetingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const companyId = user.companyRef || user.companyId || user._id;

  // ✅ Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const base = "http://localhost:5000/api";

        const [companyRes, empRes, taskRes, meetingRes] = await Promise.all([
          axiosInstance.get(`${base}/companies/${companyId}`),
          axiosInstance.get(`${base}/employees/company/${companyId}`),
          axiosInstance.get(`${base}/tasks/company/${companyId}`),
          axiosInstance.get(`${base}/meetings/company/${companyId}`),
        ]);

        console.log("Meetings API raw response:", meetingRes.data);

        console.log("Company:", companyRes.data);
        console.log("Employees:", empRes.data);
        console.log("Tasks:", taskRes.data);
        console.log("Meetings:", meetingRes.data);

        const companyData = companyRes.data.company || companyRes.data || {};
        const employeesData = empRes.data.employees || empRes.data || [];
        const tasksData = taskRes.data.tasks || taskRes.data || [];
        const meetingsData = Array.isArray(meetingRes.data)
          ? meetingRes.data
          : meetingRes.data.meetings || [];
        const countData =
          meetingRes.data.count ??
          (Array.isArray(meetingRes.data)
            ? meetingRes.data.length
            : meetingsData.length);

        setMeetings(meetingsData);

        setCompany(companyData);
        setEmployees(employeesData);
        setTasks(tasksData);
        setMeetings(meetingsData);
        setMeetingCount(countData);
      } catch (error) {
        console.error("❌ Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white text-lg">
        Loading Dashboard...
      </div>
    );

  // ✅ Computed values
  const employeeCount = employees.length;
  const activeTasks = tasks.filter((t) =>
    ["In Progress", "in progress", "active"].includes(t.status)
  ).length;
  const completedTasks = tasks.filter((t) =>
    ["Completed", "completed"].includes(t.status)
  ).length;
  const todayMeetings = meetings.filter((m) => {
    if (!m.date) return false;
    const today = new Date().toISOString().split("T")[0];
    return m.date.startsWith(today);
  }).length;

  // ✅ Admin Dashboard Cards
  const adminCards = [
    {
      title: "Company Profile",
      icon: <FaBuilding size={28} />,
      value: company?.name || "N/A",
      description: user?.industry || "Business Overview",
      color: "from-blue-600/90 to-indigo-700/90",
    },
    {
      title: "Employees",
      icon: <FaUsers size={28} />,
      value: employeeCount || "+35",
      description: "Active Employees",
      color: "from-cyan-600/90 to-blue-700/90",
    },
    {
      title: "Tasks",
      icon: <FaTasks size={28} />,
      value: `${activeTasks} Active`,
      description: `${"+160"} Completed`,
      color: "from-green-600/90 to-emerald-700/90",
    },
    {
      title: "Meetings",
      icon: <FaCalendarAlt size={28} />,
      value: `${meetingCount}`,
      description: "Upcoming meetings",
      color: "from-purple-600/90 to-pink-700/90",
    },
  ];

  // ✅ Employee Dashboard Cards
  const employeeTasks = tasks.filter((t) => t.assignedTo === user._id);
  const employeeCards = [
    {
      title: "Your Salary",
      icon: <FaMoneyBillWave size={28} />,
      value: `₹${user.salary?.toLocaleString() || "0"}`,
      description: `Bonus ₹${user.bonus?.toLocaleString() || "0"}`,
      color: "from-yellow-600/90 to-orange-700/90",
    },
    {
      title: "Your Tasks",
      icon: <FaTasks size={28} />,
      value: `${employeeTasks.length}`,
      description: `${
        employeeTasks.filter((t) => t.status === "Completed").length
      } completed`,
      color: "from-green-600/90 to-emerald-700/90",
    },
    {
      title: "Meetings",
      icon: <FaCalendarAlt size={28} />,
      value: `${meetings.length}`,
      description: "Scheduled meetings",
      color: "from-purple-600/90 to-pink-700/90",
    },
  ];

  // ✅ Stats section
  const stats = [
    {
      label: "Total Revenue",
      value: Math.floor(Math.random() * 50) + 330 + " B",
      icon: <FaMoneyBillWave />,
    },
    {
      label: "Growth Rate",
      value: (Math.random() * 15 + 5).toFixed(1) + "%",
      icon: <FaChartLine />,
    },
    {
      label: "Notifications",
      value: `${Math.floor(Math.random() * 20 + 1)} New`,
      icon: <FaBell />,
    },
    { label: "Total Tasks", value: 254, icon: <FaTasks /> },
    { label: "Completed", value: 165, icon: <FaClipboardCheck /> },
    {
      label: "Meetings Today",
      value: Math.floor(Math.random() * 5) + 5,
      icon: <FaCalendarAlt />,
    },
  ];

  const announcements = meetings.slice(0, 3).map((m) => ({
    title: m.title,
    date: new Date(m.date).toDateString(),
    detail: `Meeting with ${m.participants?.length || 0} members`,
  }));

  const recentActivities = tasks.slice(0, 5).map((t) => ({
    user: employees.find((e) => e._id === t.assignedTo)?.name || "Unassigned",
    activity: `${t.title} (${t.status})`,
    time: new Date(t.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-1">
              {user.role === "admin" ? "Admin Dashboard" : "Employee Dashboard"}
            </h2>
            <p className="text-blue-200 text-base sm:text-lg">
              Welcome back {user.name}! Here’s your real-time performance
              snapshot.
            </p>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {(user.role === "admin" ? adminCards : employeeCards).map(
            (card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.05 }}
                className={`rounded-2xl p-6 border border-white/10 bg-gradient-to-br ${card.color} shadow-lg backdrop-blur-md`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-full bg-white/20 shadow-inner">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-sm text-blue-100">{card.description}</p>
                </div>
              </motion.div>
            )
          )}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 rounded-xl p-6 flex items-center gap-4 backdrop-blur-md border border-white/10 shadow-md hover:shadow-blue-500/30 transition-all"
            >
              <div className="text-blue-400 text-3xl">{stat.icon}</div>
              <div>
                <p className="text-sm text-blue-200">{stat.label}</p>
                <p className="text-xl font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Announcements + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Announcements */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 rounded-2xl p-6 border border-white/10 shadow-md backdrop-blur-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <FaRegNewspaper className="text-blue-400" />
              <h3 className="text-xl font-semibold">Company Announcements</h3>
            </div>
            <ul className="space-y-4">
              {announcements.length > 0 ? (
                announcements.map((item, i) => (
                  <li key={i} className="border-b border-white/10 pb-3">
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-sm text-blue-200">{item.detail}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-400">No announcements yet.</p>
              )}
            </ul>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 rounded-2xl p-6 border border-white/10 shadow-md backdrop-blur-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <FaClipboardCheck className="text-green-400" />
              <h3 className="text-xl font-semibold">Recent Activities</h3>
            </div>
            <ul className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((a, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b border-white/10 pb-3"
                  >
                    <div>
                      <p className="font-medium text-white">{a.user}</p>
                      <p className="text-sm text-blue-200">{a.activity}</p>
                    </div>
                    <span className="text-xs text-gray-400">{a.time}</span>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-400">No recent activity yet.</p>
              )}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
