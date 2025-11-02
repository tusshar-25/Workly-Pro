import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { motion } from "framer-motion";
import { Loader2, Users, Clock3, MapPin, Trash2 } from "lucide-react";

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch all meetings
  const fetchMeetings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/meetings");
      setMeetings(res.data);
    } catch (err) {
      console.error("Error fetching meetings:", err);
      setError("Failed to load meetings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // ✅ Delete meeting
  const deleteMeeting = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;
    try {
      await axiosInstance.delete(`/meetings/${id}`);
      setMeetings((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Error deleting meeting:", err);
      alert("Failed to delete meeting");
    }
  };

  return (
    <div className="p-6 min-h-screen  text-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-400">📅 Company Meetings</h1>
        </div>

        {/* Loading / Error / Empty */}
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
                <h2 className="text-lg font-semibold text-blue-300 mb-1">
                  {meeting.title}
                </h2>
                <p className="text-gray-400 text-sm mb-3">
                  {meeting.description || "No description provided."}
                </p>

                <div className="text-sm space-y-1 text-gray-400">
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-blue-400" />
                    <span>{meeting.location || "—"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock3 size={14} className="text-blue-400" />
                    <span>{new Date(meeting.time).toLocaleString()}</span>
                  </p>
                  {meeting.participants?.length > 0 && (
                    <p className="flex items-start gap-2">
                      <Users size={14} className="text-blue-400 mt-0.5" />
                      <span>
                        {meeting.participants
                          .map((p) => p.name || "Unknown")
                          .join(", ")}
                      </span>
                    </p>
                  )}
                </div>

                {/* Status + Delete Button */}
                <div className="mt-4 flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      meeting.status === "Completed"
                        ? "bg-green-900/30 text-green-400"
                        : meeting.status === "Cancelled"
                        ? "bg-red-900/30 text-red-400"
                        : "bg-yellow-900/30 text-yellow-400"
                    }`}
                  >
                    {meeting.status || "Scheduled"}
                  </span>

                  <button
                    onClick={() => deleteMeeting(meeting._id)}
                    className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings;
