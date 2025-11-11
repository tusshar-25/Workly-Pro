import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  Loader2,
  Users,
  Clock3,
  MapPin,
  Trash2,
  Edit2,
  PlusCircle,
} from "lucide-react";

const Meetings = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteMeetingId, setDeleteMeetingId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    time: "",
    participants: [],
    status: "scheduled",
  });

  // Fetch meetings
  const fetchMeetings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/api/meetings");
      setMeetings(res.data);
    } catch (err) {
      console.error("Error fetching meetings:", err);
      setError("Failed to load meetings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees for participants dropdown
  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get("/api/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchMeetings();
    fetchEmployees();
  }, []);

  // Open popup
  const openPopup = (meeting = null) => {
    setEditingMeeting(meeting);
    setFormData(
      meeting
        ? {
            title: meeting.title,
            description: meeting.description,
            location: meeting.location,
            time: meeting.datetime ? new Date(meeting.datetime).toISOString().slice(0,16) : "",
            participants: meeting.participants?.map((p) => p._id) || [],
            status: meeting.status || "scheduled",
          }
        : {
            title: "",
            description: "",
            location: "",
            time: "",
            participants: [],
            status: "scheduled",
          }
    );
    setShowPopup(true);
  };

  // Add/Update meeting
  const handleSave = async () => {
    if (!adminPassword) {
      alert("Please enter admin password!");
      return;
    }
    if (!formData.title || !formData.time) {
      alert("Please fill all required fields!");
      return;
    }


    const payload = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      datetime: new Date(formData.time).toISOString(),  // convert here,
      participants: formData.participants,
      status: formData.status.toLowerCase(),
      adminPassword,
    };

    try {
      if (editingMeeting) {
        const res = await axiosInstance.put(
          `/api/meetings/${editingMeeting._id}`,
          payload
        );
        alert(res.data.message || "Meeting updated successfully!");
      } else {
        const res = await axiosInstance.post("/api/meetings", payload);
        alert(res.data.message || "Meeting added successfully!");
      }

      setShowPopup(false);
      setEditingMeeting(null);
      setFormData({
        title: "",
        description: "",
        location: "",
        time: "",
        participants: [],
        status: "scheduled",
      });
      setAdminPassword("");
      fetchMeetings();
    } catch (err) {
      console.error("Error saving meeting:", err);
      alert(err.response?.data?.message || "Failed to save meeting.");
    }
  };

  // Delete confirmation
  const confirmDelete = (id) => {
    setDeleteMeetingId(id);
    setShowDeletePopup(true);
  };

  // Delete meeting
  const handleDelete = async () => {
    if (!adminPassword) {
      alert("Enter admin password to delete!");
      return;
    }

    try {
      await axiosInstance.delete(`/api/meetings/${deleteMeetingId}`, {
        data: { adminPassword },
      });
      setMeetings((prev) => prev.filter((m) => m._id !== deleteMeetingId));
      alert("Meeting deleted successfully!");
      setShowDeletePopup(false);
      setAdminPassword("");
      setDeleteMeetingId(null);
    } catch (err) {
      console.error("Error deleting meeting:", err);
      alert(err.response?.data?.message || "Failed to delete meeting.");
    }
  };

  return (
    <div className="p-6 min-h-screen text-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-400">📅 Company Meetings</h1>
          {user?.role === "admin" && (
            <button
              onClick={() => openPopup()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 text-white font-medium shadow"
            >
              <PlusCircle size={18} /> Add Meeting
            </button>
          )}
        </div>

        {/* Loading/Error/Empty */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-400" size={32} />
          </div>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : meetings.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No meetings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting, index) => (
              <motion.div
                key={meeting._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-b from-gray-900 to-blue-950/40 border border-blue-900/50 rounded-2xl p-5 shadow-lg"
              >
                <h2 className="text-lg font-semibold text-blue-300 mb-1">{meeting.title}</h2>
                <p className="text-gray-400 text-sm mb-3">{meeting.description || "No description provided."}</p>
                <div className="text-sm space-y-1 text-gray-400">
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-blue-400" />
                    <span>{meeting.location || "—"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock3 size={14} className="text-blue-400" />
                    <span>{new Date(meeting.datetime).toLocaleString()}</span>
                  </p>
                  {meeting.participants?.length > 0 && (
                    <p className="flex items-start gap-2">
                      <Users size={14} className="text-blue-400 mt-0.5" />
                      <span>{meeting.participants.map((p) => p.name || p).join(", ")}</span>
                    </p>
                  )}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    meeting.status === "completed"
                      ? "bg-green-900/30 text-green-400"
                      : meeting.status === "cancelled"
                      ? "bg-red-900/30 text-red-400"
                      : "bg-yellow-900/30 text-yellow-400"
                  }`}>
                    {meeting.status}
                  </span>

                  {user?.role === "admin" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => openPopup(meeting)}
                      className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition"
                    >
                      <Edit2 size={16} /> Update
                    </button>
                    <button
                      onClick={() => confirmDelete(meeting._id)}
                      className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Update Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-blue-800 shadow-xl"
            >
              <h2 className="text-xl font-semibold text-blue-400 mb-4">
                {editingMeeting ? "Update Meeting" : "Add New Meeting"}
              </h2>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 text-gray-100 outline-none border border-gray-700"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 text-gray-100 outline-none border border-gray-700"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 text-gray-100 outline-none border border-gray-700"
                />
                <input
                  type="datetime-local"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 text-gray-100 outline-none border border-gray-700"
                />

                {/* Participants Multi-Select Dropdown */}
                <div className="relative">
                  <div
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 cursor-pointer flex justify-between items-center"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    <div className="flex flex-wrap gap-1 max-w-[80%]">
                      {formData.participants.length > 0 ? (
                        formData.participants.map((id) => {
                          const emp = employees.find((e) => e._id === id);
                          if (!emp) return null;
                          return (
                            <span
                              key={id}
                              className="bg-blue-600 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                            >
                              {emp.name}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFormData({
                                    ...formData,
                                    participants: formData.participants.filter((p) => p !== id),
                                  });
                                }}
                                className="ml-1 text-white hover:text-gray-200"
                              >
                                ✕
                              </button>
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-gray-400">Select Participants</span>
                      )}
                    </div>
                    <span className="text-gray-300">{dropdownOpen ? "▲" : "▼"}</span>
                  </div>

                  {dropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {employees.map((emp) => {
                        const selected = formData.participants.includes(emp._id);
                        return (
                          <div
                            key={emp._id}
                            onClick={() => {
                              if (selected) {
                                setFormData({
                                  ...formData,
                                  participants: formData.participants.filter((p) => p !== emp._id),
                                });
                              } else {
                                if (formData.participants.length >= 10) {
                                  alert("You can select up to 10 participants only");
                                  return;
                                }
                                setFormData({
                                  ...formData,
                                  participants: [...formData.participants, emp._id],
                                });
                              }
                            }}
                            className={`px-4 py-2 cursor-pointer flex justify-between items-center transition-colors ${
                              selected ? "bg-blue-600 text-white" : "hover:bg-blue-500/30 text-gray-200"
                            }`}
                          >
                            <span>{emp.name} ({emp.role})</span>
                            {selected && <span>✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Select up to 10 participants</p>

                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 text-gray-100 border border-gray-700"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <input
                  type="password"
                  placeholder="Admin Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-gray-100 outline-none border border-gray-700"
                />
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  {editingMeeting ? "Update" : "Add"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation popup */}
      <AnimatePresence>
        {showDeletePopup && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 p-6 rounded-2xl w-full max-w-sm border border-red-600 shadow-xl"
            >
              <h2 className="text-xl font-semibold text-red-400 mb-4">Delete Meeting</h2>
              <p className="mb-4 text-gray-300">
                Do you really want to delete this meeting? Enter admin password to confirm.
              </p>
              <input
                type="password"
                placeholder="Admin Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-gray-100 outline-none border border-gray-700 mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Meetings;
