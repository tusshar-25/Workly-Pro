import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Mail, Shield, Trash2, Phone, DollarSign, Plus, Edit } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  const [deleteName, setDeleteName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "employee",
    position: "",
    salary: "",
    bonus: "",
  });

  const [updateData, setUpdateData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [adding, setAdding] = useState(false);

  // 🧩 Fetch Employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get("/employees");
        setEmployees(res.data.employees || res.data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [user]);

  // ✅ Delete Employee
  const handleDeleteEmployee = async () => {
    if (!deleteName || !adminPassword) {
      alert("Please enter both employee name and admin password!");
      return;
    }

    const employeeToDelete = employees.find(
      (emp) => emp.name.toLowerCase() === deleteName.toLowerCase()
    );
    if (!employeeToDelete) return alert("Employee not found!");

    setDeleting(true);
    try {
      const res = await axiosInstance.delete(`/employees/${employeeToDelete._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: { adminPassword },
      });
      alert(res.data.msg || "Employee deleted successfully!");
      setEmployees(employees.filter((emp) => emp._id !== employeeToDelete._id));
      setShowDeletePopup(false);
      setDeleteName("");
      setAdminPassword("");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to delete employee.");
    } finally {
      setDeleting(false);
    }
  };

  // ✅ Add Employee
const handleAddEmployee = async () => {
  const { name, email, password, phone, role, position, salary, bonus } = formData;
  if (!name || !email || !password) {
    alert("Name, email & password required!");
    return;
  }

  const newEmployee = {
    ...formData,
    salary: Number(salary) || 0,
    bonus: Number(bonus) || 0,
  };

  setAdding(true);
  try {
    const res = await axiosInstance.post("/employees", newEmployee, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    alert("Employee added successfully!");
    setEmployees([...employees, res.data.employee || res.data]); // now has numeric salary
    setShowAddPopup(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "employee",
      position: "",
      salary: "",
      bonus: "",
    });
  } catch (err) {
    alert(err.response?.data?.msg || "Failed to add employee.");
  } finally {
    setAdding(false);
  }
};


  // ✅ Update Employee
  const handleUpdateEmployee = async () => {
    if (!updateData._id) return alert("No employee selected!");

    setUpdating(true);
    try {
      const res = await axiosInstance.put(`/employees/${updateData._id}`, updateData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Employee updated successfully!");
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === updateData._id ? res.data.employee : emp))
      );
      setShowUpdatePopup(false);
      setUpdateData({});
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to update employee.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-400 text-lg font-semibold">
        Loading employees...
      </div>
    );
  if (error)
    return <div className="text-center text-red-400 py-20 font-medium">{error}</div>;

  return (
    <div className="p-6 md:p-10 relative">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users size={36} className="text-blue-400" />
            <h2 className="text-3xl font-bold text-white">All Employees</h2>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowAddPopup(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus size={18} /> Add
            </button>
            <button
              onClick={() => setShowDeletePopup(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <Trash2 size={18} /> Delete
            </button>
          </div>
        </div>

        {/* Table */}
      
<div className="overflow-x-auto bg-gradient-to-br from-gray-900/80 via-blue-950/40 to-black text-white shadow-xl rounded-2xl border border-blue-400/30">
  <table className="w-full table-auto border-collapse text-left">
    <thead className="bg-blue-900/40">
      <tr>
        <th className="px-6 py-3 border-b border-blue-400/30 font-semibold">Name</th>
        <th className="px-6 py-3 border-b border-blue-400/30 font-semibold">Email</th>
        <th className="px-6 py-3 border-b border-blue-400/30 font-semibold">Position</th>
        <th className="px-6 py-3 border-b border-blue-400/30 font-semibold">CTC</th>
        <th className="px-6 py-3 border-b border-blue-400/30 font-semibold">Mobile No.</th>
        <th className="px-6 py-3 border-b border-blue-400/30 font-semibold">Update</th>
      </tr>
    </thead>
    <tbody>
      {employees.map((emp, i) => {
        const ctc = (emp.salary || 0) + (emp.bonus || 0);
        return (
          <motion.tr
            key={emp._id || i}
            whileHover={{ backgroundColor: "rgba(59,130,246,0.1)" }}
            transition={{ duration: 0.2 }}
            className="text-sm md:text-base"
          >
            <td className="px-6 py-4 border-b border-blue-400/10">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-blue-400" />
                {emp.name}
              </div>
            </td>

            <td className="px-6 py-4 border-b border-blue-400/10">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                {emp.email}
              </div>
            </td>

            <td className="px-6 py-4 border-b border-blue-400/10 capitalize">
              {emp.position || "—"}
            </td>

            <td className="px-6 py-4 border-b border-blue-400/10">
              <div className="flex items-center gap-1">
                <DollarSign size={16} className="text-green-400" />₹{ctc.toLocaleString()}
              </div>
            </td>

            <td className="px-6 py-4 border-b border-blue-400/10">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-green-400" /> {emp.phone || "—"}
              </div>
            </td>

            <td className="px-6 py-4 border-b border-blue-400/10">
              <button
                onClick={() => {
                  setUpdateData(emp);
                  setShowUpdatePopup(true);
                }}
                className="text-blue-400 hover:text-blue-500 flex items-center gap-1"
              >
                <Edit size={16} /> Edit
              </button>
            </td>
          </motion.tr>
        );
      })}
    </tbody>
  </table>
</div>

      </motion.div>

      {/* 🔴 Delete Popup */}
      <AnimatePresence>
        {showDeletePopup && (
          <Popup
            title="Delete Employee"
            fields={[
              { label: "Employee Name", type: "text", value: deleteName, setValue: setDeleteName },
              { label: "Admin Password", type: "password", value: adminPassword, setValue: setAdminPassword },
            ]}
            onClose={() => setShowDeletePopup(false)}
            onConfirm={handleDeleteEmployee}
            loading={deleting}
            confirmLabel="Delete"
            color="red"
          />
        )}
      </AnimatePresence>

      {/* 🟢 Add Employee Popup */}
      <AnimatePresence>
        {showAddPopup && (
          <Popup
            title="Add Employee"
            fields={[
              { label: "Name", type: "text", value: formData.name, setValue: (v) => setFormData({ ...formData, name: v }) },
              { label: "Email", type: "email", value: formData.email, setValue: (v) => setFormData({ ...formData, email: v }) },
              { label: "Password", type: "password", value: formData.password, setValue: (v) => setFormData({ ...formData, password: v }) },
              { label: "Position", type: "text", value: formData.position, setValue: (v) => setFormData({ ...formData, position: v }) },
              { label: "Salary", type: "number", value: formData.salary, setValue: (v) => setFormData({ ...formData, salary: parseFloat(v) || 0 }) },
              { label: "Bonus", type: "number", value: formData.bonus, setValue: (v) => setFormData({ ...formData, bonus: parseFloat(v) || 0 }) },
              { label: "Phone", type: "text", value: formData.phone, setValue: (v) => setFormData({ ...formData, phone: v }) },
            ]}
            onClose={() => setShowAddPopup(false)}
            onConfirm={handleAddEmployee}
            loading={adding}
            confirmLabel="Add"
            color="green"
          />
        )}
      </AnimatePresence>

      {/* 🔵 Update Employee Popup */}
      <AnimatePresence>
        {showUpdatePopup && (
          <Popup
            title="Update Employee"
            fields={[
              { label: "Name", type: "text", value: updateData.name || "", setValue: (v) => setUpdateData({ ...updateData, name: v }) },
              { label: "Position", type: "text", value: updateData.position || "", setValue: (v) => setUpdateData({ ...updateData, position: v }) },
              { label: "Salary", type: "number", value: updateData.salary || "", setValue: (v) => setUpdateData({ ...updateData, salary: v }) },
              { label: "Bonus", type: "number", value: updateData.bonus || "", setValue: (v) => setUpdateData({ ...updateData, bonus: v }) },
              { label: "Phone", type: "text", value: updateData.phone || "", setValue: (v) => setUpdateData({ ...updateData, phone: v }) },
            ]}
            onClose={() => setShowUpdatePopup(false)}
            onConfirm={handleUpdateEmployee}
            loading={updating}
            confirmLabel="Update"
            color="blue"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// 🧱 Reusable Popup Component
const Popup = ({ title, fields, onClose, onConfirm, loading, confirmLabel, color }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 p-8 rounded-2xl shadow-lg w-96 border border-blue-400/30"
    >
      <h3 className={`text-xl font-bold text-${color}-400 mb-4`}>{title}</h3>
      {fields.map((f, i) => (
        <div key={i} className="mb-3">
          <label className="block text-gray-300 mb-1">{f.label}</label>
          <input
            type={f.type}
            value={f.value}
            onChange={(e) => f.setValue(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-600"
          />
        </div>
      ))}
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`px-4 py-2 bg-${color}-600 hover:bg-${color}-700 rounded-md text-white font-semibold`}
        >
          {loading ? "Saving..." : confirmLabel}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default Employees;
