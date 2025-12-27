import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  Trophy,
  Search,
  Filter,
  Award,
  ChevronRight,
  Play,
  CheckCircle,
  Activity,
  TrendingUp,
  Calendar,
  MoreVertical,
  Download,
  Layout,
  ExternalLink,
  Flame,
  User,
  Star,
  Coins
} from "lucide-react";

const Sparkline = ({ values = [], width = 120, height = 36 }) => {
  if (!values.length) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const step = width / (values.length - 1 || 1);
  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="inline-block">
      <defs>
        <linearGradient id="sparklineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="url(#sparklineGradient)" strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const PremiumProgressBar = ({ value = 0, color = "blue" }) => {
  const colors = {
    blue: "from-blue-600 to-indigo-600",
    green: "from-emerald-500 to-teal-600",
    purple: "from-purple-500 to-violet-600"
  };

  return (
    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-2.5 rounded-full bg-gradient-to-r ${colors[color]} shadow-lg`}
      />
    </div>
  );
};

const BotVortexMyCourses = () => {
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "Student",
    role: "BotVortex Student",
    year: "1st Year",
    email: "",
    phone: "",
    avatar: "",
    totalLearningHours: 12,
    coins: 0
  });

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showCertificatesOnly, setShowCertificatesOnly] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });

    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/signup";
          return;
        }

        const profileRes = await fetch("http://localhost:5000/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const storedUser = JSON.parse(localStorage.getItem("user")) || {};

          setUserData(prev => ({
            ...prev,
            name: profileData.fullName || profileData.personal?.name || storedUser.fullName || "Student",
            role: profileData.academic?.currentYear || storedUser.role || "BotVortex Student",
            year: profileData.education?.collegeName || "Enrolled Student",
            email: profileData.personal?.email || storedUser.email,
            phone: profileData.personal?.phone || storedUser.phone || "N/A",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.fullName || profileData.personal?.name || storedUser.fullName || 'User')}&background=0D8ABC&color=fff&bold=true`,
            coins: profileData.coins || 0
          }));
        }

        const courseRes = await fetch("http://localhost:5000/api/student/courses", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (courseRes.ok) {
          const data = await courseRes.json();
          setEnrolled(data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totals = useMemo(() => {
    const total = enrolled.length;
    const inProg = enrolled.filter((c) => c.progress < 100).length;
    const completed = enrolled.filter((c) => c.progress >= 100).length;
    const certs = enrolled.filter((c) => c.certificate).length;
    const avgProgress = Math.round(enrolled.reduce((s, c) => s + c.progress, 0) / Math.max(1, total));
    return { total, inProg, completed, certs, avgProgress };
  }, [enrolled]);

  const filtered = enrolled.filter((c) => {
    if (showCertificatesOnly && !c.certificate) return false;
    if (filter === "inprogress" && c.progress >= 100) return false;
    if (filter === "completed" && c.progress < 100) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      (c.instructor && c.instructor.toLowerCase().includes(q)) ||
      (c.courseId && c.courseId.toLowerCase().includes(q))
    );
  });

  const handleUpdateProgress = async (courseId, delta) => {
    const token = localStorage.getItem("token");
    const course = enrolled.find(c => c.courseId === courseId);
    if (!course) return;

    const newProgress = Math.min(100, Math.max(0, course.progress + delta));

    try {
      const response = await fetch(`http://localhost:5000/api/student/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ progress: newProgress })
      });

      if (response.ok) {
        setEnrolled((prev) =>
          prev.map((c) => (c.courseId === courseId ? { ...c, progress: newProgress } : c))
        );
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleMarkComplete = async (courseId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/student/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ progress: 100, certificate: true, status: 'completed' })
      });

      if (response.ok) {
        setEnrolled((prev) =>
          prev.map((c) => (c.courseId === courseId ? { ...c, progress: 100, certificate: true } : c))
        );
      }
    } catch (error) {
      console.error("Error marking complete:", error);
    }
  };

  const handleDownloadCertificate = (course) => {
    const html = `
      <html><head><title>Certificate - ${course.title}</title>
      <style>
        body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f0f4f8; font-family: 'Inter', sans-serif; }
        .cert { width: 800px; padding: 60px; background: white; border: 20px solid #1e3a8a; position: relative; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
        .cert::before { content: ""; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; border: 2px solid #3b82f6; pointer-events: none; }
        h1 { color: #1e3a8a; font-size: 48px; margin-bottom: 10px; text-transform: uppercase; }
        h2 { color: #3b82f6; font-size: 24px; margin-bottom: 40px; }
        .name { font-size: 36px; font-weight: bold; color: #111; margin: 20px 0; border-bottom: 2px solid #ccc; display: inline-block; padding: 0 40px; }
        .desc { font-size: 18px; color: #555; margin-bottom: 40px; }
        .footer { display: flex; justify-content: space-between; margin-top: 60px; }
        .sig { border-top: 1px solid #333; width: 200px; padding-top: 10px; font-size: 14px; }
      </style>
      </head>
      <body>
        <div class="cert">
          <h1>Certificate</h1>
          <h2>of Completion</h2>
          <p class="desc">This is to certify that</p>
          <div class="name">${userData.name}</div>
          <p class="desc">has successfully completed the course</p>
          <div style="font-size: 28px; font-weight: bold; color: #1e3a8a; margin-bottom: 20px;">${course.title}</div>
          <p class="desc">with an outstanding grade of <strong>A</strong></p>
          <div class="footer">
            <div class="sig">Program Director</div>
            <div class="sig">BotVortex Academy<br/>${new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </body>
      </html>
    `;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    } else {
      alert("Popup blocked — allow popups to view certificate preview.");
    }
  };

  const handleInitDemo = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/student/courses/init-demo", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        // Refetch courses after demo init
        const fetchResponse = await fetch("http://localhost:5000/api/student/courses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (fetchResponse.ok) {
          setEnrolled(await fetchResponse.json());
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-medium animate-pulse">Loading your learning portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans transition-all duration-500">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* PREMIUM DASHBOARD HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-10"
        >
          {/* Decorative Backdrops */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-60"></div>

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-lg opacity-20 animate-pulse"></div>
                <img
                  src={userData.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl relative z-10"
                />
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full z-20"></div>
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <h1 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">{userData.name}</h1>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">PRO</span>
                </div>
                <p className="text-blue-600 font-semibold mt-1 flex items-center gap-2 justify-center md:justify-start">
                  <Layout size={16} className="text-blue-500" />
                  {userData.role} • {userData.year}
                </p>
                <div className="text-slate-400 text-sm mt-1">{userData.email}</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 w-full lg:w-auto">
              <div className="bg-slate-50/80 backdrop-blur-md rounded-2xl p-4 min-w-[140px] text-center border border-slate-100 hover:shadow-md transition-all">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Total Hours</p>
                <div className="flex items-center justify-center gap-2">
                  <Clock size={18} className="text-blue-600" />
                  <p className="text-2xl font-black text-slate-800">{userData.totalLearningHours}h</p>
                </div>
              </div>
              <div className="bg-[#FFD700]/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px] text-center border border-[#FFD700]/10 hover:shadow-md transition-all group">
                <p className="text-xs text-[#B8860B] uppercase font-bold tracking-widest mb-1">My Coins</p>
                <Link to="/buy-coins" className="flex items-center justify-center gap-2">
                  <Coins size={20} className="text-[#FFD700] group-hover:scale-110 transition-transform" />
                  <p className="text-2xl font-black text-slate-800">{userData.coins.toLocaleString()}</p>
                </Link>
              </div>
              <div className="bg-slate-50/80 backdrop-blur-md rounded-2xl p-4 min-w-[140px] text-center border border-slate-100 hover:shadow-md transition-all">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Consistency</p>
                <div className="flex flex-col items-center">
                  <p className="text-2xl font-black text-slate-800">{totals.avgProgress}%</p>
                  <div className="mt-1"><Sparkline values={enrolled.map(c => c.progress)} /></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* STATS TILES & FILTERS */}
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            {[
              { label: "Enrolled", val: totals.total, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Ongoing", val: totals.inProg, icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Done", val: totals.completed, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Badges", val: totals.certs, icon: Trophy, color: "text-purple-600", bg: "bg-purple-50" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col"
              >
                <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon size={20} />
                </div>
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.val}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full xl:w-auto">
            <div className="relative group flex-1 min-w-[240px]">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 transition-all text-slate-700"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none text-slate-700 font-medium focus:ring-4 focus:ring-blue-50/50 cursor-pointer"
              >
                <option value="all">Overview</option>
                <option value="inprogress">Active</option>
                <option value="completed">Finished</option>
              </select>
              <button
                onClick={() => setShowCertificatesOnly(!showCertificatesOnly)}
                className={`px-4 py-3 rounded-2xl border transition-all flex items-center gap-2 font-medium ${showCertificatesOnly
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <Award size={18} />
                <span className="hidden sm:inline">Certified</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* COURSE LISTING (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 text-center"
                >
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen size={40} className="text-blue-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to start?</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mb-8">Your learning journey begins here. Explore our world-class robotics curriculum.</p>

                  {enrolled.length === 0 && (
                    <button
                      onClick={handleInitDemo}
                      className="mb-4 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-emerald-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
                    >
                      Initialize Demo Courses <Play size={20} fill="white" />
                    </button>
                  )}

                  <Link
                    to="/Courses"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-blue-100 transition-all hover:scale-105 active:scale-95"
                  >
                    Browse Catalog <ChevronRight size={20} />
                  </Link>
                </motion.div>
              ) : (
                filtered.map((course) => (
                  <motion.div
                    layout
                    key={course.courseId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative bg-white rounded-3xl p-5 md:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Progress Background Decoration */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-blue-50/30 transition-all duration-500 pointer-events-none"
                      style={{ width: `${course.progress}%` }}
                    />

                    <div className="relative flex flex-col md:flex-row gap-6">
                      {/* Thumbnail/Icon */}
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] flex items-center justify-center text-3xl shadow-lg shadow-blue-200 shrink-0 transform group-hover:rotate-6 transition-transform">
                        <span className="filter drop-shadow-md">{course.thumbnailEmoji || "🚀"}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">{course.courseId}</span>
                              {course.progress >= 100 && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                                  <CheckCircle size={10} /> Certified
                                </span>
                              )}
                            </div>
                            <h3 className="font-extrabold text-xl text-slate-800 group-hover:text-blue-700 transition-colors truncate">{course.title}</h3>
                            <p className="text-sm text-slate-500 font-medium flex items-center gap-1 mt-1">
                              <User size={14} className="text-slate-400" /> {course.instructor || "BotVortex Instructor"}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-center min-w-[70px]">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Progress</p>
                              <p className="text-sm font-black text-slate-800">{course.progress}%</p>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                              <MoreVertical size={20} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-col md:flex-row items-center gap-6">
                          <div className="w-full space-y-3">
                            <div className="flex justify-between items-end">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">CURRICULUM</span>
                                <span className="text-xs font-black text-blue-600 italic">{course.completedLessons || 0}/{course.totalLessons || 10} LESSONS</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-bold">{course.lastActive ? `Last active: ${new Date(course.lastActive).toLocaleDateString()}` : "Active now"}</span>
                            </div>
                            <PremiumProgressBar value={course.progress} color={course.progress >= 100 ? "green" : "blue"} />
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex gap-2">
                            <Link
                              to='/CoursesModule'
                              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95"
                            >
                              <Play size={16} fill="white" /> {course.progress > 0 ? "Continue" : "Start"}
                            </Link>
                            <button
                              onClick={() => handleUpdateProgress(course.courseId, 10)}
                              className="p-2.5 text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-xl transition-all"
                              title="Update Progress"
                            >
                              <TrendingUp size={20} />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {course.certificate && (
                              <button
                                onClick={() => handleDownloadCertificate(course)}
                                className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border border-emerald-100"
                              >
                                <Download size={16} /> Certificate
                              </button>
                            )}
                            {course.progress < 100 && (
                              <button
                                onClick={() => handleMarkComplete(course.courseId)}
                                className="text-blue-600 hover:underline font-bold text-sm px-2 cursor-pointer"
                              >
                                Mark Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {/* CTA BANNER */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl shadow-blue-200">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="bg-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/10">
                  <Flame size={32} className="text-orange-400" />
                </div>
                <h4 className="text-2xl md:text-3xl font-black text-white mb-3">Push Your Boundaries!</h4>
                <p className="text-blue-100 max-w-md mx-auto mb-8 font-medium">Daily practice is the key to mastery. Earn exclusive badges by completing modules this week.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/Courses" className="bg-white text-blue-900 px-10 py-4 rounded-[1.2rem] font-black hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-xl">
                    View New Arrivals
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR (4 cols) */}
          <aside className="lg:col-span-4 space-y-8">

            {/* PROGRESS OVERVIEW */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-extrabold text-slate-800 flex items-center gap-2">
                  <Activity size={20} className="text-blue-600" /> Mastery Lab
                </h4>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">LIVE FEED</span>
              </div>

              <div className="space-y-6">
                {enrolled.slice(0, 4).map((c) => (
                  <div key={c.courseId} className="group flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-800 truncate max-w-[150px]">{c.title}</p>
                      <span className={`text-[10px] font-bold ${c.certificate ? "text-emerald-500" : "text-slate-400"}`}>
                        {c.certificate ? "VERIFIED" : `${c.progress}%`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${c.certificate ? "bg-emerald-500" : "bg-blue-500"}`}
                        style={{ width: `${c.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* UPCOMING EVENTS */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h4 className="font-extrabold text-slate-800 flex items-center gap-2 mb-6">
                <Calendar size={20} className="text-blue-600" /> Vortex Events
              </h4>
              <div className="space-y-4">
                {[
                  { title: "Robotics Seminar", date: "Tomorrow, 10 AM", type: "Live" },
                  { title: "AI Workshop", date: "Friday, 2 PM", type: "Hands-on" }
                ].map((event, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <TrendingUp size={18} className="text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{event.title}</p>
                      <p className="text-[10px] font-medium text-slate-500">{event.date} • {event.type}</p>
                    </div>
                    <ChevronRight size={14} className="ml-auto text-slate-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h4 className="font-extrabold text-slate-800 flex items-center gap-2 mb-4">
                <ExternalLink size={20} className="text-blue-600" /> Resources
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {["Documentation", "Community", "Support", "API"].map((link) => (
                  <button key={link} className="text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-bold transition-all border border-transparent hover:border-blue-100">
                    {link}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BotVortexMyCourses;