import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Filter, Mail, MoreVertical, DollarSign, BookOpen, Clock, ChevronDown, CheckCircle2 } from "lucide-react";
import { API_URL } from "../../config/api";

const InstructorStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("All");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("instructorToken") || localStorage.getItem("token");
        const res = await fetch(`${API_URL}/instructor/students`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStudents(data);
        }
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const totalEarnings = students.reduce((sum, s) => sum + (s.amount || 0), 0);
  const uniqueCourses = ["All", ...new Set(students.map(s => s.course))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "All" || student.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Users className="text-[#00E5FF] w-8 h-8" />
            My Students
          </h2>
          <p className="text-slate-400 mt-1">Manage enrollments, track progress, and view transaction details.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-[#112240] px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Enrolled</p>
              <h3 className="text-2xl font-black text-white">{students.length}</h3>
            </div>
          </div>
          <div className="bg-[#112240] px-6 py-3 rounded-2xl border border-emerald-400/20 flex items-center gap-4 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Earned</p>
              <h3 className="text-2xl font-black text-white">₹{totalEarnings.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0A192F]/60 backdrop-blur-md border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#00E5FF]/50 transition-colors shadow-lg"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <select 
              value={filterCourse || ""}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full appearance-none bg-[#0A192F]/60 backdrop-blur-md border border-white/10 text-white px-5 py-3 pr-10 rounded-2xl focus:outline-none hover:bg-white/5 transition-colors shadow-lg cursor-pointer"
            >
              {uniqueCourses.map(course => (
                <option key={course} value={course} className="bg-[#112240]">{course}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-3 rounded-2xl font-bold hover:bg-white/10 transition-colors shadow-lg">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl border border-white/5 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 border-b border-white/5">
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Student Details</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Course Enrolled</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Join Date</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Progress</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Amount Paid</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">Loading student data...</td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center flex flex-col items-center justify-center">
                      <Users size={48} className="text-white/10 mb-4" />
                      <p className="text-lg font-bold text-white mb-1">No students found</p>
                      <p className="text-slate-400">Try adjusting your search or filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, i) => (
                    <motion.tr 
                      key={`${student.id}-${student.course}-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-5 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex flex-shrink-0 items-center justify-center font-bold text-white shadow-lg">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-[#00E5FF] transition-colors">{student.name}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <Mail size={10} /> {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-[#00E5FF]/10 text-[#00E5FF] rounded-lg">
                            <BookOpen size={14} />
                          </div>
                          <span className="text-sm text-slate-300 font-medium">{student.course}</span>
                        </div>
                      </td>
                      <td className="p-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Clock size={14} />
                          {new Date(student.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="p-5 whitespace-nowrap">
                        <div className="w-32">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-white">{student.progress}%</span>
                            {student.progress === 100 && <CheckCircle2 size={12} className="text-emerald-400" />}
                          </div>
                          <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${student.progress === 100 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-gradient-to-r from-blue-500 to-[#00E5FF]'}`}
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 whitespace-nowrap text-right">
                        <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 font-black">
                          ₹{student.amount ? student.amount.toLocaleString() : '0'}
                        </div>
                      </td>
                      <td className="p-5 whitespace-nowrap text-center">
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorStudents;