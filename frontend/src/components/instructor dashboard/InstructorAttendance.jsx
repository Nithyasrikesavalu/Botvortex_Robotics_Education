import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Users, TrendingUp, Calendar, AlertCircle, Check, X, Clock } from 'lucide-react';
import { API_URL } from '../../config/api';

const InstructorAttendance = ({ instructor }) => {
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [students, setStudents] = useState([]);
  const [dynamicStats, setDynamicStats] = useState([
    { label: "Total Students", value: "0", icon: Users, color: "text-[#00E5FF]", bg: "bg-[#00E5FF]/10" },
    { label: "Today's Attendance", value: "0%", icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Active This Week", value: "0", icon: TrendingUp, color: "text-[#7C3AED]", bg: "bg-[#7C3AED]/10" },
  ]);
  
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("instructorToken") || localStorage.getItem("token");
        const response = await fetch(`${API_URL}/attendance`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Map backend data to UI format
          const formatted = data.map(record => ({
            id: record._id,
            name: record.studentId?.fullName || record.studentId?.name || record.studentId?.firstName || record.studentId?.username || 'Unknown Student',
            course: record.course || 'All Courses',
            date: record.date,
            checkIn: record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--',
            checkOut: record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--',
            hours: record.totalHours || 0,
            metRequirement: record.metRequirement,
            attendanceRate: Math.min(Math.round(((record.totalHours || 0) / 3) * 100), 100) // Dummy calculation based on 3 hrs
          }));
          setStudents(formatted);

          // Calculate Dynamic Stats
          const totalStudents = instructor?.stats?.totalStudents || 0;
          
          const todayStr = new Date().toISOString().split('T')[0];
          const todaysRecords = data.filter(d => d.date === todayStr);
          const todaysAttendancePerc = totalStudents > 0 ? Math.round((todaysRecords.length / totalStudents) * 100) : 0;
          
          // Calculate active this week
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const activeThisWeekCount = new Set(data.filter(d => new Date(d.date) >= oneWeekAgo).map(d => d.studentId?._id)).size;

          setDynamicStats([
            { label: "Total Students", value: totalStudents.toLocaleString(), icon: Users, color: "text-[#00E5FF]", bg: "bg-[#00E5FF]/10" },
            { label: "Today's Attendance", value: `${todaysAttendancePerc}%`, icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { label: "Active This Week", value: activeThisWeekCount.toLocaleString(), icon: TrendingUp, color: "text-[#7C3AED]", bg: "bg-[#7C3AED]/10" },
          ]);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };
    fetchAttendance();
  }, [instructor]);

  const downloadReport = () => {
    if (students.length === 0) {
      alert("No attendance data to download.");
      return;
    }
    
    const headers = ['Student Name', 'Course', 'Date', 'Check In', 'Check Out', 'Total Hours', 'Attendance %', 'Status'];
    
    const csvData = students.map(student => [
      student.name,
      student.course,
      student.date,
      student.checkIn,
      student.checkOut,
      student.hours,
      `${student.attendanceRate}%`,
      student.metRequirement ? 'Met Requirement (3+ hrs)' : (student.hours > 0 ? 'Short (<3 hrs)' : 'Absent')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <UserCheck className="text-emerald-400 w-8 h-8" />
            Attendance & Daily Check-ins
          </h2>
          <p className="text-slate-400 mt-1">Monitor student engagement. <span className="text-rose-400 font-bold">* Minimum 3 hours per day is compulsory.</span></p>
        </div>
        <div className="flex gap-2 bg-[#0A192F] p-1.5 rounded-xl border border-white/5">
          <select 
            value={selectedCourse || ""}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-transparent text-white px-4 py-2 outline-none font-bold text-sm cursor-pointer"
          >
            <option className="bg-[#0A192F]" value="All Courses">All Courses</option>
            {instructor?.courses?.map(course => (
              <option key={course.id} value={course.title} className="bg-[#0A192F]">
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dynamicStats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 border border-white/5 flex items-center gap-4 shadow-lg"
          >
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shrink-0`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-black text-white">{stat.value}</span>
                {stat.trend && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
                    {stat.trend}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Student List */}
      <div className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-[#00E5FF]" /> Today's Log
          </h3>
          <button onClick={downloadReport} className="text-sm font-bold text-[#00E5FF] hover:underline cursor-pointer">Download Report</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Course</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Check In / Out</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Total Hours</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Attendance %</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status (Min 3 hrs)</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#00E5FF] flex items-center justify-center text-white font-bold text-xs shadow-lg">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-bold text-white group-hover:text-[#00E5FF] transition-colors">{student.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-300">{student.course}</td>
                  <td className="p-4 text-sm text-slate-400">
                    <div className="flex flex-col gap-1">
                      <span className="text-emerald-400 font-bold">{student.checkIn}</span>
                      <span className="text-rose-400 font-bold">{student.checkOut}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-white">
                    {student.hours > 0 ? `${student.hours} hrs` : '--'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${student.attendanceRate > 80 ? 'bg-emerald-400' : student.attendanceRate > 60 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                          style={{ width: `${student.attendanceRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-white">{student.attendanceRate}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {student.metRequirement ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/20"><Check size={12}/> Met (3+ hrs)</span>
                    ) : student.hours > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-lg border border-yellow-400/20"><AlertCircle size={12}/> Short (&#60;3 hrs)</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded-lg border border-red-400/20"><X size={12}/> Absent</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorAttendance;
