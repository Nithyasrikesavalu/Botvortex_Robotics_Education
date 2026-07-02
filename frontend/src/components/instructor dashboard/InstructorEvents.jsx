import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, Trash2, Video, Users, ArrowRight, Save } from "lucide-react";
import { API_URL } from "../../config/api";

const InstructorEvents = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "Webinar",
    date: "",
    time: "",
    format: "Online",
    link: "",
    instructorUpdate: ""
  });

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("instructorToken") || (localStorage.getItem("instructorToken") || localStorage.getItem("token"));
      const res = await fetch(`${API_URL}/events`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("instructorToken") || (localStorage.getItem("instructorToken") || localStorage.getItem("token"));
      const res = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newEvent)
      });

      if (res.ok) {
        // Notify students locally for now, backend could handle real notifications
        const existingNotifs = JSON.parse(localStorage.getItem('studentNotifications') || '[]');
        existingNotifs.unshift({ id: Date.now(), message: `New ${newEvent.type} Scheduled: ${newEvent.title}`, read: false, time: new Date().toLocaleTimeString() });
        localStorage.setItem('studentNotifications', JSON.stringify(existingNotifs));

        setNewEvent({ title: "", type: "Webinar", date: "", time: "", format: "Online", link: "", instructorUpdate: "" });
        alert("Event Published to Student Dashboard and students notified!");
        fetchEvents();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to create event");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const removeEvent = async (id) => {
    try {
      const token = localStorage.getItem("instructorToken") || (localStorage.getItem("instructorToken") || localStorage.getItem("token"));
      const res = await fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-xl">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Calendar className="text-[#00E5FF] w-8 h-8" />
            Manage Upcoming Events
          </h2>
          <p className="text-slate-400 mt-2">Publish webinars, hackathons, or workshops for your students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Event Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Create New Event</h3>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Event Title</label>
                <input required type="text" value={newEvent.title || ""} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] mt-2" placeholder="e.g., Live Q&A Session" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</label>
                  <input required type="date" value={newEvent.date || ""} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] mt-2 [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time</label>
                  <input required type="time" value={newEvent.time || ""} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] mt-2 [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Type</label>
                  <select value={newEvent.type || ""} onChange={e => setNewEvent({...newEvent, type: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] mt-2">
                    <option>Webinar</option>
                    <option>Workshop</option>
                    <option>Competition</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Format</label>
                  <select value={newEvent.format || ""} onChange={e => setNewEvent({...newEvent, format: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] mt-2">
                    <option>Online</option>
                    <option>Hybrid</option>
                    <option>In-Person</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Webinar / Meeting Link</label>
                <input type="url" value={newEvent.link || ""} onChange={e => setNewEvent({...newEvent, link: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] mt-2" placeholder="e.g., https://zoom.us/j/123456789" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Instructor Update (Optional)</label>
                <textarea value={newEvent.instructorUpdate || ""} onChange={e => setNewEvent({...newEvent, instructorUpdate: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] mt-2 resize-none" placeholder="Any specific instructions for students?"></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#00E5FF] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2 mt-4">
                <Plus size={18} /> Publish Event
              </button>
            </form>
          </div>
        </div>

        {/* Events List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Published Events</h3>
          {events.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-slate-400">
              No events published yet.
            </div>
          ) : (
            events.map((event, index) => (
              <div key={event._id || event.id || index} className="bg-[#0A192F]/60 backdrop-blur-md rounded-2xl border border-white/5 p-6 flex items-center justify-between shadow-xl">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold">
                    <span className="text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-1 rounded">{event.type}</span>
                    <span className="text-[#7C3AED] bg-[#7C3AED]/10 px-2 py-1 rounded">{event.format}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">{event.title}</h4>
                  <p className="text-slate-400 text-sm mt-1">{event.date} at {event.time}</p>
                  {event.link && <a href={event.link} target="_blank" rel="noreferrer" className="text-[#00E5FF] text-xs font-medium hover:underline mt-2 inline-block">View Meeting Link</a>}
                </div>
                <button onClick={() => removeEvent(event._id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorEvents;
