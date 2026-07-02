import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../../config/api';

const DailyAttendance = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Status can be: 'pending', 'checked-in', 'checked-out'
  const [attendance, setAttendance] = useState({
    status: 'pending',
    checkInTime: null,
    checkOutTime: null,
    date: new Date().toLocaleDateString()
  });

  // Load from local storage
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const saved = localStorage.getItem('studentAttendance');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        setAttendance(parsed);
      } else {
        // New day, reset attendance
        const reset = { status: 'pending', checkInTime: null, checkOutTime: null, date: today };
        setAttendance(reset);
        localStorage.setItem('studentAttendance', JSON.stringify(reset));
      }
    }
  }, []);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/attendance/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const now = new Date().toLocaleTimeString();
        const newStatus = {
          ...attendance,
          status: 'checked-in',
          checkInTime: now
        };
        setAttendance(newStatus);
        localStorage.setItem('studentAttendance', JSON.stringify(newStatus));
      } else {
        const errorData = await response.json();
        alert(`Check-in failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during check-in:', error);
      alert('Error during check-in');
    }
  };

  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/attendance/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const now = new Date().toLocaleTimeString();
        const newStatus = {
          ...attendance,
          status: 'checked-out',
          checkOutTime: now
        };
        setAttendance(newStatus);
        localStorage.setItem('studentAttendance', JSON.stringify(newStatus));
      } else {
        const errorData = await response.json();
        alert(`Check-out failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during check-out:', error);
      alert('Error during check-out');
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1A0B2E] to-[#0A192F] backdrop-blur-md rounded-3xl p-6 border border-[#7C3AED]/30 shadow-[0_0_30px_rgba(124,58,237,0.1)] mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
      
      {/* Time & Info */}
      <div className="flex items-center gap-6">
        <div className="bg-[#00E5FF]/10 p-4 rounded-2xl border border-[#00E5FF]/20">
          <Clock className="w-8 h-8 text-[#00E5FF] animate-pulse" />
        </div>
        <div>
          <h3 className="text-white text-lg font-bold">Daily Attendance</h3>
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 font-mono mt-1">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Status & Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        
        {/* Status Indicators */}
        <div className="flex gap-4 mr-4">
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Check In</p>
            {attendance.checkInTime ? (
              <span className="text-emerald-400 font-bold text-sm bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                {attendance.checkInTime}
              </span>
            ) : (
              <span className="text-slate-500 font-bold text-sm">--:--</span>
            )}
          </div>
          <div className="w-px bg-white/10 h-10 self-center"></div>
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Check Out</p>
            {attendance.checkOutTime ? (
              <span className="text-rose-400 font-bold text-sm bg-rose-400/10 px-3 py-1 rounded-full border border-rose-400/20">
                {attendance.checkOutTime}
              </span>
            ) : (
              <span className="text-slate-500 font-bold text-sm">--:--</span>
            )}
          </div>
        </div>

        {/* Buttons */}
        {attendance.status === 'pending' && (
          <button 
            onClick={handleCheckIn}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <LogIn size={18} /> Check In
          </button>
        )}

        {attendance.status === 'checked-in' && (
          <button 
            onClick={handleCheckOut}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-rose-500 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Check Out
          </button>
        )}

        {attendance.status === 'checked-out' && (
          <div className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-400" /> Done for Today
          </div>
        )}
        
      </div>
    </div>
  );
};

export default DailyAttendance;
