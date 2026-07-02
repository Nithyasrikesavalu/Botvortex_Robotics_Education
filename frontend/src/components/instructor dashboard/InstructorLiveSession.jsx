import React, { useState, useEffect } from "react";
import { Video, Save } from "lucide-react";
import { API_URL } from "../../config/api";

const InstructorLiveSession = () => {
  const [liveEvent, setLiveEvent] = useState({
    title: "",
    description: "",
    link: ""
  });

  useEffect(() => {
    const fetchLiveEvent = async () => {
      try {
        const token = localStorage.getItem("instructorToken") || (localStorage.getItem("instructorToken") || localStorage.getItem("token"));
        const response = await fetch(`${API_URL}/livesessions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setLiveEvent(data);
        }
      } catch (error) {
        console.error("Error fetching live event:", error);
      }
    };
    fetchLiveEvent();
  }, []);

  const handleUpdateLiveEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("instructorToken") || (localStorage.getItem("instructorToken") || localStorage.getItem("token"));
      const response = await fetch(`${API_URL}/livesessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(liveEvent)
      });

      if (response.ok) {
        alert("Featured Live Event Updated and students notified!");
      } else {
        alert("Failed to update live event");
      }
    } catch (error) {
      console.error("Error updating live event:", error);
      alert("Error updating live event");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col justify-center items-start bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-xl">
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <Video className="text-red-400 w-8 h-8 animate-pulse" />
          Manage Live Sessions
        </h2>
        <p className="text-slate-400 mt-2">Update the main Live Stream event visible to all students.</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-gradient-to-br from-[#1A0B2E] to-[#0A192F] backdrop-blur-md rounded-3xl p-8 border border-[#7C3AED]/30 shadow-[0_0_30px_rgba(124,58,237,0.1)] mt-6">
          <h3 className="text-xl font-black text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
            <Video className="text-red-400" size={20} />
            Featured 'Live Now' Event
          </h3>
          <form onSubmit={handleUpdateLiveEvent} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Event Title</label>
              <input required type="text" value={liveEvent.title || ""} onChange={e => setLiveEvent({...liveEvent, title: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7C3AED] mt-2" placeholder="e.g., Global AI Summit" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
              <textarea required value={liveEvent.description || ""} onChange={e => setLiveEvent({...liveEvent, description: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7C3AED] mt-2 resize-none h-32" placeholder="Short description about the stream..."></textarea>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Stream Link</label>
              <input required type="url" value={liveEvent.link || ""} onChange={e => setLiveEvent({...liveEvent, link: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7C3AED] mt-2" placeholder="https://..." />
            </div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-6">
              <Save size={18} /> Update Live Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InstructorLiveSession;
