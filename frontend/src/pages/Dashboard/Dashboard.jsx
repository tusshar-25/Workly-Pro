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
  FaUserCircle,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyRes, empRes, taskRes, meetingRes] = await Promise.all([
          axiosInstance.get(`/api/companies/${companyId}`),
          axiosInstance.get(`/api/employees/company/${companyId}`),
          axiosInstance.get(`/api/tasks/company/${companyId}`),
          axiosInstance.get(`/api/meetings/company/${companyId}`),
        ]);

        const companyData = companyRes.data.company || companyRes.data || {};
        const employeesData = empRes.data.employees || empRes.data || [];
        const tasksData = taskRes.data.tasks || taskRes.data || [];
        const meetingsData = Array.isArray(meetingRes.data)
          ? meetingRes.data
          : meetingRes.data.meetings || [];

        setCompany(companyData);
        setEmployees(employeesData);
        setTasks(tasksData);
        setMeetings(meetingsData);
        setMeetingCount(meetingsData.length);
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

  // ✅ Stats and Computations
  const employeeCount = employees.length;
  const activeTasks = tasks.filter((t) =>
    ["In Progress", "assigned", "pending", "active"].includes(t.status)
  ).length;
  const completedTasks = tasks.filter((t) =>
    ["Completed", "completed"].includes(t.status)
  ).length;

  const todayMeetings = meetings.filter((m) => {
    if (!m.date) return false;
    const today = new Date().toISOString().split("T")[0];
    return m.date.startsWith(today);
  }).length;

  const employeeTasks = tasks.filter(
    (t) => t.assignedTo === user._id || t.assignedTo?._id === user._id
  );

  // ✅ Performance Overview
  const totalTasks = employeeTasks.length || tasks.length;
  const completedByUser = tasks.filter(
    (t) =>
      (t.assignedTo === user._id || t.assignedTo?._id === user._id) &&
      ["Completed", "completed"].includes(t.status)
  ).length;
  const performanceRate =
    totalTasks > 0 ? Math.round((completedByUser / totalTasks) * 100) : 0;

  // ✅ Weekly Productivity (Mock Data)
  const weekData = [
    { day: "Mon", completed: Math.floor(Math.random() * 5) },
    { day: "Tue", completed: Math.floor(Math.random() * 5) },
    { day: "Wed", completed: Math.floor(Math.random() * 5) },
    { day: "Thu", completed: Math.floor(Math.random() * 5) },
    { day: "Fri", completed: Math.floor(Math.random() * 5) },
    { day: "Sat", completed: Math.floor(Math.random() * 5) },
    { day: "Sun", completed: Math.floor(Math.random() * 5) },
  ];

  // ✅ Upcoming Deadlines (Next 15)
  const upcomingDeadlines = tasks
    .filter((t) => t.dueDate && new Date(t.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 15);

  // ✅ Cards
  const adminCards = [
    {
      title: "Company Profile",
      icon: <FaBuilding size={28} />,
      value: company?.name || "N/A",
      description: company?.companyId,
      color: "from-blue-600/90 to-indigo-700/90",
    },
    {
      title: "Employees",
      icon: <FaUsers size={28} />,
      value: employeeCount,
      description: "Active Employees",
      color: "from-cyan-600/90 to-blue-700/90",
    },
    {
      title: "Tasks",
      icon: <FaTasks size={28} />,
      value: `${activeTasks} Active`,
      description: `${completedTasks} Completed`,
      color: "from-green-600/90 to-emerald-700/90",
    },
    {
      title: "Meetings",
      icon: <FaCalendarAlt size={28} />,
      value: `${meetingCount}`,
      description: "Upcoming Meetings",
      color: "from-purple-600/90 to-pink-700/90",
    },
  ];

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
      description: `${employeeTasks.filter((t) => t.status === "Completed").length
        } Completed`,
      color: "from-green-600/90 to-emerald-700/90",
    },
    {
      title: "Meetings",
      icon: <FaCalendarAlt size={28} />,
      value: `${meetings.length}`,
      description: "Scheduled Meetings",
      color: "from-purple-600/90 to-pink-700/90",
    },
     {
    title: "Performance",
    icon: <FaChartLine size={28} />,
    value: `${performanceRate}%`,
    description: "Task completion rate",
    color: "from-pink-600/90 to-purple-700/90",
  },
  ];

  const announcements = meetings.slice(0, 3).map((m) => ({
    title: m.title,
    date: new Date(m.date).toDateString(),
    detail: `Meeting with ${m.participants?.length || 0} members`,
  }));

  const recentActivities = tasks.slice(0, 5).map((t) => ({
    user:
      employees.find(
        (e) => e._id === t.assignedTo || e._id === t.assignedTo?._id
      )?.name || "Unassigned",
    activity: `${t.title} (${t.status})`,
    time: new Date(t.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden scrollbar-hide">
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

        {/* Weekly Productivity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 rounded-2xl p-6 border border-white/10 shadow-md backdrop-blur-lg mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaChartLine className="text-yellow-400" />
            <h3 className="text-xl font-semibold">Weekly Productivity</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "none",
                  color: "#fff",
                }}
              />
              <Bar dataKey="completed" fill="#4ade80" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Announcements + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Announcements */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
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
            transition={{ delay: 0.9 }}
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

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white/10 rounded-2xl p-6 border border-white/10 shadow-md backdrop-blur-lg mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaCalendarAlt className="text-pink-400" />
            <h3 className="text-xl font-semibold">Upcoming Deadlines (Next 15)</h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <ul className="space-y-4">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((t, i) => (
                  <li key={i} className="border-b border-white/10 pb-3">
                    <p className="font-medium text-white">{t.title}</p>
                    <p className="text-sm text-blue-200">{t.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Due: {new Date(t.dueDate).toLocaleDateString()}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-400">No upcoming deadlines.</p>
              )}
            </ul>
          </div>
        </motion.div>

        {/* Employee Personal Info Snapshot */}
        {user.role === "employee" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white/10 rounded-2xl p-6 border border-white/10 shadow-md backdrop-blur-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <FaUserCircle className="text-cyan-400" />
              <h3 className="text-xl font-semibold">Personal Info: {company.name}</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <p>
                <span className="text-blue-200">Name:</span> {user.name}
              </p>
              <p>
                <span className="text-blue-200">Email:</span> {user.email}
              </p>
              <p>
                <span className="text-blue-200">Mobile:</span>{" "}
                {user?.phone || "N/A"}
              </p>
              <p>
                <span className="text-blue-200">Designation:</span>{" "}
                {user.position || "N/A"}
              </p>
              <p>
                <span className="text-blue-200">Joining Date:</span>{" "}
                {user?.joinedAt
                  ? new Date(user.joinedAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <span className="text-blue-200">Employee Code:</span>{" "}
                {user?.companyId || "N/A"}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
