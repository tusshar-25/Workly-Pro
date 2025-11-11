import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  Edit2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    status: "Pending",
  });

  const isAdmin = user.role === "admin";

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        isAdmin
          ? `/api/tasks/company/${user.companyId}`
          : `/api/tasks/employee/${user._id}`
      );
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    if (!isAdmin) return;
    try {
      const res = await axiosInstance.get(`/api/employees/company/${user.companyId}`);
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  // Open modal for Add or Update
  const openModal = (task = null) => {
    setEditingTask(task);
    setFormData(
      task
        ? {
            title: task.title,
            description: task.description,
            assignedTo: task.assignedTo?._id || "",
            dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
            status: task.status || "Pending",
          }
        : {
            title: "",
            description: "",
            assignedTo: "",
            dueDate: "",
            status: "Pending",
          }
    );
    setAdminPassword("");
    setShowModal(true);
  };

  // Save (Add/Update) task
  const handleSaveTask = async () => {
    if (!formData.title || !formData.assignedTo || !formData.dueDate) {
      alert("Please fill all required fields!");
      return;
    }
    if (!adminPassword) {
      alert("Please enter admin password!");
      return;
    }

    const payload = { ...formData, companyId: user.companyId, adminPassword };

    try {
      if (editingTask) {
        await axiosInstance.put(`/api/tasks/${editingTask._id}`, payload);
        alert("Task updated successfully!");
      } else {
        await axiosInstance.post("/api/tasks", payload);
        alert("Task added successfully!");
      }

      setShowModal(false);
      setEditingTask(null);
      setFormData({ title: "", description: "", assignedTo: "", dueDate: "", status: "Pending" });
      setAdminPassword("");
      fetchTasks();
    } catch (err) {
      console.error("Error saving task:", err);
      alert(err.response?.data?.msg || "Failed to save task.");
    }
  };

  // Delete task
  const confirmDelete = (taskId) => {
    setDeleteTaskId(taskId);
    setAdminPassword("");
    setShowDeleteModal(true);
  };

  const handleDeleteTask = async () => {
    if (!adminPassword) {
      alert("Enter admin password to delete!");
      return;
    }

    try {
      await axiosInstance.delete(`/api/tasks/${deleteTaskId}`, { data: { adminPassword } });
      setTasks((prev) => prev.filter((t) => t._id !== deleteTaskId));
      alert("Task deleted successfully!");
      setShowDeleteModal(false);
      setDeleteTaskId(null);
      setAdminPassword("");
    } catch (err) {
      console.error("Error deleting task:", err);
      alert(err.response?.data?.msg || "Failed to delete task.");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-400">
          {isAdmin ? "All Tasks" : "My Tasks"}
        </h2>
        {isAdmin && (
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all"
          >
            <PlusCircle size={18} /> Add Task
          </button>
        )}
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-blue-400" size={32} />
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">No tasks found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-b from-gray-900 to-blue-950/40 p-5 rounded-2xl border border-blue-900/50 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-blue-300 mb-2">{task.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{task.description || "No description provided."}</p>
              {isAdmin && (
                <p className="text-sm text-gray-500 mb-1">
                  Assigned To: <span className="text-blue-400 font-medium">{task.assignedTo?.name || "N/A"}</span>
                </p>
              )}
              <p className="text-sm text-gray-500 mb-1">
                Due: <span className="text-gray-300">{new Date(task.dueDate).toLocaleDateString()}</span>
              </p>

              {/* Status & Actions */}
              <div className="flex items-center justify-between mt-4">
                <span
                  className={`flex items-center gap-2 text-sm ${
                    task.status === "Completed"
                      ? "text-green-400"
                      : task.status === "Pending"
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  {task.status === "Completed" && <CheckCircle2 size={16} />}
                  {task.status === "Pending" && <Clock size={16} />}
                  {task.status === "Cancelled" && <XCircle size={16} />}
                  {task.status}
                </span>

                {isAdmin && (
                  <div className="flex gap-2">
                    <button onClick={() => openModal(task)} className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      <Edit2 size={16} /> Edit
                    </button>
                    <button onClick={() => confirmDelete(task._id)} className="text-red-400 hover:text-red-300 flex items-center gap-1">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Update Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-blue-800"
            >
              <h3 className="text-xl font-semibold text-blue-400 mb-4">
                {editingTask ? "Update Task" : "Add New Task"}
              </h3>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 text-gray-100 border border-gray-700"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 text-gray-100 border border-gray-700"
                />
                {isAdmin && (
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full p-2 rounded bg-gray-800 text-gray-100 border border-gray-700"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.designation})
                      </option>
                    ))}
                  </select>
                )}
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 text-gray-100 border border-gray-700"
                />
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 text-gray-100 border border-gray-700"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <input
                  type="password"
                  placeholder="Admin Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-gray-100 border border-gray-700"
                />
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Cancel</button>
                <button onClick={handleSaveTask} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                  {editingTask ? "Update" : "Add"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 p-6 rounded-2xl w-full max-w-sm border border-red-600"
            >
              <h3 className="text-xl font-semibold text-red-400 mb-4">Delete Task</h3>
              <p className="mb-4 text-gray-300">Enter admin password to confirm deletion.</p>
              <input
                type="password"
                placeholder="Admin Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-gray-100 border border-gray-700 mb-4"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Cancel</button>
                <button onClick={handleDeleteTask} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
