import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { motion } from "framer-motion";
import { PlusCircle, Loader2, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
  });

  const isAdmin = user.role === "admin";

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `http://localhost:5000/api/tasks/${
          isAdmin ? `company/${user.companyId}` : `employee/${user._id}`
        }`
      );
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees for admin (for assigning tasks)
  const fetchEmployees = async () => {
    if (!isAdmin) return;
    try {
      const res = await axiosInstance.get(
        `http://localhost:5000/api/employees/company/${user.companyId}`
      );
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  // Add new task (admin only)
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignedTo) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await axiosInstance.post("http://localhost:5000/api/tasks", {
        ...newTask,
        companyId: user.companyId,
      });
      setShowModal(false);
      setNewTask({ title: "", description: "", assignedTo: "", dueDate: "" });
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Update task status (admin only)
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosInstance.put(`http://localhost:5000/api/tasks/${taskId}`, {
        status: newStatus,
      });
      fetchTasks();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-400">
          {isAdmin ? "All Tasks" : "My Tasks"}
        </h2>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all"
          >
            <PlusCircle size={18} />
            Add Task
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-blue-400" size={28} />
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-gray-400 text-center mt-6">No tasks found.</p>
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
              <h3 className="text-lg font-semibold text-blue-300 mb-2">
                {task.title}
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                {task.description || "No description provided."}
              </p>
              {isAdmin && (
                <p className="text-sm text-gray-500 mb-1">
                  Assigned To:{" "}
                  <span className="text-blue-400 font-medium">
                    {task.assignedTo?.name || "N/A"}
                  </span>
                </p>
              )}
              <p className="text-sm text-gray-500 mb-1">
                Due:{" "}
                <span className="text-gray-300">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </p>

              {/* Status */}
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
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task._id, e.target.value)
                    }
                    className="bg-gray-800 text-gray-200 text-sm rounded-lg px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-blue-800"
          >
            <h3 className="text-xl font-semibold text-blue-400 mb-4">
              Add New Task
            </h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-gray-800 text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-gray-800 text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Assign To
                </label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignedTo: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-gray-800 text-gray-200"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-gray-800 text-gray-200"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                >
                  Add Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
