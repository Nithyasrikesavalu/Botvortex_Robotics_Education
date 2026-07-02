import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Video, Users, ArrowRight } from 'lucide-react';
import { API_URL } from '../../config/api';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);

  const [liveEvent, setLiveEvent] = useState({
    title: 'Global AI & Robotics Summit',
    description: 'Join thousands of learners worldwide for a 3-day immersive experience into the future of autonomous systems.',
    link: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch Live Sessions
        const liveRes = await fetch(`${API_URL}/livesessions`, { headers });
        if (liveRes.ok) {
          const sessions = await liveRes.json();
          if (sessions.length > 0) {
            const latest = sessions[0];
            setLiveEvent({
              title: latest.title,
              description: latest.description,
              link: latest.link
            });
          }
        }

        // Fetch Events
        const eventsRes = await fetch(`${API_URL}/events`, { headers });
        if (eventsRes.ok) {
          const fetchedEvents = await eventsRes.json();
          const formattedEvents = fetchedEvents.map(ev => ({
            id: ev._id,
            title: ev.title,
            type: ev.type,
            date: ev.date,
            time: ev.time,
            attendees: Math.floor(Math.random() * 200) + 10, // Simulated attendees count
            host: ev.instructorId?.fullName || 'Instructor',
            format: ev.format,
            icon: ev.type === 'Competition' ? Users : Video,
            color: ev.type === 'Competition' ? 'from-purple-500 to-indigo-500' : 'from-blue-500 to-cyan-400',
            instructorUpdate: ev.instructorUpdate,
            link: ev.link
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const formatDateParts = (dateStr) => {
    if (!dateStr) return { month: 'TBD', day: '--', year: '----' };
    
    // If it's the old format "Oct 28, 2026"
    if (dateStr.includes(' ')) {
      const parts = dateStr.split(' ');
      return {
        month: parts[0] || 'TBD',
        day: parts[1] ? parts[1].replace(',', '') : '--',
        year: parts[2] || '----'
      };
    }
    
    // If it's the new format "2026-10-28"
    if (dateStr.includes('-')) {
      // Create date safely appending time to avoid timezone shift
      const d = new Date(`${dateStr}T00:00:00`);
      if (!isNaN(d.getTime())) {
        const month = d.toLocaleString('en-US', { month: 'short' });
        const day = d.getDate().toString().padStart(2, '0');
        const year = d.getFullYear().toString();
        return { month, day, year };
      }
    }
    
    // Fallback
    return { month: dateStr.substring(0, 3) || 'TBD', day: '--', year: '----' };
  };

  return (
  <div className="space-y-8">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <Calendar size={32} className="text-[#00BFFF]" /> 
          Upcoming Events
        </h2>
        <p className="text-slate-400 mt-2">Join live webinars, hackathons, and exclusive workshops.</p>
      </div>
      <button className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#00E5FF] hover:text-white transition-colors group">
        View Full Calendar
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Event List */}
      <div className="lg:col-span-2 space-y-6">
        {events.map((event, index) => {
          const dateParts = formatDateParts(event.date);
          return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative bg-[#0A192F]/60 backdrop-blur-md rounded-2xl border border-white/5 hover:border-white/20 transition-all shadow-xl overflow-hidden flex flex-col sm:flex-row"
          >
            {/* Date Block */}
            <div className={`sm:w-32 bg-gradient-to-br ${event.color || 'from-purple-500 to-indigo-500'} p-6 flex flex-col items-center justify-center text-white shrink-0`}>
              <span className="text-sm font-bold uppercase tracking-widest opacity-80">{dateParts.month}</span>
              <span className="text-4xl font-black tracking-tighter leading-none my-1">{dateParts.day}</span>
              <span className="text-xs font-bold opacity-80">{dateParts.year}</span>
            </div>
            
            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/10 text-white rounded-md border border-white/20">
                  {event.type}
                </span>
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <event.icon size={12} /> {event.format}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00E5FF] transition-colors">{event.title}</h3>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400 mb-2">
                <div className="flex items-center gap-1.5"><Clock size={14} className="text-[#00BFFF]" /> {event.time}</div>
                <div className="flex items-center gap-1.5"><Users size={14} className="text-[#7C3AED]" /> {event.attendees} Attending</div>
                <div className="flex items-center gap-1.5"><MapPin size={14} className="text-emerald-400" /> Host: {event.host}</div>
              </div>

              {/* Instructor Update Box */}
              {event.instructorUpdate && (
                <div className="mt-2 p-3 bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-xl">
                  <p className="text-[11px] font-medium text-slate-300">
                    <span className="font-bold text-[#00E5FF]">Instructor Update:</span> {event.instructorUpdate}
                  </p>
                </div>
              )}
            </div>
            
            {/* CTA */}
            <div className="p-6 sm:pl-0 flex items-center justify-start sm:justify-end">
              {event.link ? (
                <a href={event.link} target="_blank" rel="noreferrer" className="px-6 py-2 bg-gradient-to-r from-[#00E5FF] to-blue-500 hover:from-blue-500 hover:to-[#00E5FF] text-white rounded-xl text-sm font-bold transition-all w-full sm:w-auto text-center shadow-lg inline-block">
                  Join Webinar Link
                </a>
              ) : (
                <button className="px-6 py-2 bg-white/5 hover:bg-[#00E5FF]/20 text-white hover:text-[#00E5FF] border border-white/10 hover:border-[#00E5FF]/50 rounded-xl text-sm font-bold transition-all w-full sm:w-auto">
                  Register Now
                </button>
              )}
            </div>
          </motion.div>
          );
        })}
      </div>

      {/* Featured Event Card */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-[#1A0B2E] to-[#0A192F] p-8 rounded-3xl border border-[#7C3AED]/30 shadow-[0_0_30px_rgba(124,58,237,0.1)] relative overflow-hidden flex flex-col"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00E5FF]/10 rounded-full blur-[60px]"></div>
        
        <div className="inline-block px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6 w-fit self-start shadow-lg">
          Live Now
        </div>
        
        <h3 className="text-2xl font-black text-white mb-2 leading-tight">{liveEvent.title}</h3>
        <p className="text-sm text-slate-300 mb-6">{liveEvent.description}</p>
        
        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-3 text-sm text-white font-medium bg-white/5 p-3 rounded-xl border border-white/5">
            <Video size={18} className="text-red-400 animate-pulse" /> Live Stream in Progress
          </div>
          {liveEvent.link ? (
            <a href={liveEvent.link} target="_blank" rel="noreferrer" className="w-full block text-center py-3 bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#00E5FF] text-white font-bold rounded-xl shadow-lg transition-all">
              Join the Stream
            </a>
          ) : (
            <button className="w-full py-3 bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#00E5FF] text-white font-bold rounded-xl shadow-lg transition-all">
              Stream Link Upcoming
            </button>
          )}
        </div>
      </motion.div>
    </div>
  </div>
  );
};

export default UpcomingEvents;
