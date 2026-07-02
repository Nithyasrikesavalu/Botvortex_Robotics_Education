import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, BookOpen, DollarSign, Star, TrendingUp, Plus, Award,
  Target, Zap, Sparkles, Rocket, Brain, Lightbulb, Calendar,
  MessageCircle, Clock, BarChart3, Crown, Bookmark, Activity, X, Search, UserPlus
} from "lucide-react";
import { API_URL } from "../../config/api";

const OverviewContent = ({ instructor, onNavigate }) => {
  if (!instructor) return null;
  const { stats } = instructor;
  const [activeTab, setActiveTab] = useState("insights");
  const [recentStudents, setRecentStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityData, setActivityData] = useState([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("instructorToken") || localStorage.getItem("token");
        const res = await fetch(`${API_URL}/instructor/students`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Sort by join date descending and take top 5
          const sorted = data.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
          setAllStudents(sorted);
          setRecentStudents(sorted.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch students", err);
      }
    };
    fetchStudents();
  }, []);

  const fetchActivityData = async () => {
    setIsLoadingActivity(true);
    try {
      const token = localStorage.getItem("instructorToken") || localStorage.getItem("token");
      
      const [notifRes, reviewRes] = await Promise.all([
        fetch(`${API_URL}/instructor/notifications`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/instructor/reviews`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      let activities = [];

      if (notifRes.ok) {
        const notifs = await notifRes.json();
        const mappedNotifs = notifs.map(n => ({
          id: n._id,
          type: 'notification',
          title: n.title,
          desc: n.message,
          time: new Date(n.createdAt || Date.now()),
          icon: n.icon === 'Clock' ? Clock : (n.icon === 'BookOpen' ? BookOpen : Activity),
          color: n.type === 'success' ? 'text-emerald-400' : 'text-[#00E5FF]',
          bg: n.type === 'success' ? 'bg-emerald-400/10' : 'bg-[#00E5FF]/10'
        }));
        activities = [...activities, ...mappedNotifs];
      }

      if (reviewRes.ok) {
        const reviews = await reviewRes.json();
        const mappedReviews = reviews.map(r => ({
          id: r._id,
          type: 'review',
          title: `New Review for ${r.courseId?.title || 'Course'}`,
          desc: `${r.rating} stars - "${r.comment || 'No comment'}"`,
          time: new Date(r.createdAt || Date.now()),
          icon: Star,
          color: 'text-purple-400',
          bg: 'bg-purple-400/10'
        }));
        activities = [...activities, ...mappedReviews];
      }

      // Sort combined activities by date descending
      activities.sort((a, b) => b.time - a.time);
      setActivityData(activities);
    } catch (err) {
      console.error("Failed to fetch activity data", err);
    } finally {
      setIsLoadingActivity(false);
    }
  };

  const handleOpenActivityModal = () => {
    setShowActivityModal(true);
    fetchActivityData();
  };

  // Achievement badges data
  const achievements = [
    { icon: Crown, label: "Top Instructor", progress: 100, color: "from-[#ffd700] to-orange-500" },
    { icon: Zap, label: "Fast Learner", progress: 80, color: "from-[#00E5FF] to-blue-500" },
    { icon: Target, label: "Goal Crusher", progress: 65, color: "from-emerald-400 to-teal-500" },
    { icon: Brain, label: "Knowledge Guru", progress: 90, color: "from-[#7C3AED] to-purple-500" }
  ];

  const quickStats = [
    { icon: Clock, label: "Avg. Watch Time", value: "42min", change: "+15%", trend: "up" },
    { icon: MessageCircle, label: "Student Questions", value: "24", change: "+8%", trend: "up" },
    { icon: Bookmark, label: "Course Completion", value: "78%", change: "+12%", trend: "up" },
    { icon: BarChart3, label: "Engagement Score", value: "9.2/10", change: "+5%", trend: "up" }
  ];

  const recentActivity = [
    { title: "New student enrolled", desc: "Sarah joined Advanced Robotics", time: "2 hours ago", icon: UserPlus, color: "text-[#00E5FF]", bg: "bg-[#00E5FF]/10" },
    { title: "Course milestone", desc: "IoT Systems reached 500 students", time: "5 hours ago", icon: Award, color: "text-[#ffd700]", bg: "bg-[#ffd700]/10" },
    { title: "New Review", desc: "5-star rating on Python Automation", time: "1 day ago", icon: Star, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Enhanced Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1A0B2E] to-[#0A192F] rounded-3xl p-8 md:p-10 border border-[#7C3AED]/30 shadow-[0_0_30px_rgba(124,58,237,0.15)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#7C3AED]/20 rounded-full blur-[60px]"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg backdrop-blur-sm border border-yellow-500/30">
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-black text-white">Amazing work, {instructor.name.split(' ')[0]}! 🎉</h2>
            </div>
            <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
              You've impacted <span className="font-bold text-[#00E5FF]">{(stats.totalStudents || 0).toLocaleString()}</span> learners this month.
              That's <span className="font-bold text-emerald-400">+{Math.floor(stats.totalStudents * 0.12)}</span> new minds ignited in the robotics world!
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <button 
                onClick={() => onNavigate && onNavigate('courses')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#00E5FF] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)]"
              >
                <Plus className="w-5 h-5" />
                Create New Course
              </button>
            </div>
          </div>
          <div className="hidden md:flex bg-gradient-to-br from-[#0A192F] to-[#112240] p-6 rounded-2xl border border-white/10 shadow-2xl items-center justify-center">
            <Award className="w-16 h-16 text-[#00E5FF]" strokeWidth={1.5} />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            value: stats.totalStudents.toLocaleString(),
            label: "Active Learners",
            icon: Users,
            color: "text-[#00E5FF]",
            bg: "bg-[#00E5FF]/10",
            border: "border-[#00E5FF]/30",
            change: "+12%",
          },
          {
            value: stats.totalCourses,
            label: "Live Courses",
            icon: BookOpen,
            color: "text-[#7C3AED]",
            bg: "bg-[#7C3AED]/10",
            border: "border-[#7C3AED]/30",
            change: "+2",
          },
          {
            value: `₹${stats.totalEarnings.toLocaleString()}`,
            label: "Total Revenue",
            icon: DollarSign,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            border: "border-emerald-400/30",
            change: "+8%",
          },
          {
            value: stats.averageRating,
            label: "Student Love",
            icon: Star,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
            border: "border-yellow-400/30",
            change: "+0.2",
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-[#0A192F]/60 backdrop-blur-md rounded-2xl p-6 border border-white/5 hover:${stat.border} transition-all duration-300 group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.change && (
                <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-bold">{stat.change}</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Insights & Analytics */}
        <div className="lg:col-span-2 bg-[#0A192F]/60 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="text-[#00E5FF]" /> Performance Insights
            </h3>
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
              {["insights", "achievements", "performance"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
                    activeTab === tab
                    ? "bg-[#7C3AED] text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[250px]">
            {activeTab === "insights" && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-2 gap-4"
              >
                {quickStats.map((stat, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#00E5FF]/30 transition-colors text-center group">
                    <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"} group-hover:scale-110 transition-transform`} />
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 mb-2">{stat.label}</p>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${stat.trend === "up" ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"}`}>
                      {stat.change} vs last month
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "achievements" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white/5 p-4 border border-white/10 rounded-2xl">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${achievement.color} shadow-lg`}>
                      <achievement.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-bold text-white">{achievement.label}</p>
                        <span className="text-xs font-bold text-[#00E5FF]">{achievement.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${achievement.color}`}
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "performance" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center py-10 h-full">
                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 border border-yellow-500/20">
                  <Lightbulb className="w-10 h-10 text-yellow-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Excellent Engagement!</h4>
                <p className="text-slate-400 max-w-sm mb-6">Your course engagement rate is 35% higher than the platform average. Keep up the great work!</p>
                <button onClick={() => setShowReportModal(true)} className="px-6 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold transition-colors">
                  View Detailed Report
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="text-emerald-400" /> Recent Activity
            </h3>
          </div>
          
          <div className="space-y-6">
            <div className="relative border-l border-white/10 ml-3 space-y-6 pb-4">
              {recentActivity.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={i} className="relative pl-6">
                    <div className={`absolute -left-[18px] top-0.5 w-9 h-9 ${activity.bg} ${activity.color} rounded-full flex items-center justify-center border border-[#0A192F] shadow-lg`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{activity.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{activity.desc}</p>
                      <span className="text-[10px] font-bold text-slate-500 mt-2 block">{activity.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={handleOpenActivityModal} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-colors border border-white/5">
              View All Activity
            </button>
          </div>
        </div>
      </div>
      
      {/* Student Details Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0A192F] w-full max-w-4xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="text-[#00E5FF]" /> Detailed Student Report
                </h3>
                <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {allStudents.length > 0 ? (
                  <div className="bg-[#112240] rounded-xl overflow-hidden border border-white/5">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider font-bold">
                          <th className="p-4 border-b border-white/5">Student Name</th>
                          <th className="p-4 border-b border-white/5">Course</th>
                          <th className="p-4 border-b border-white/5 text-center">Progress</th>
                          <th className="p-4 border-b border-white/5 text-right">Join Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                        {allStudents.map((student, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium text-white">{student.name}</td>
                            <td className="p-4 text-slate-400">{student.course}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2 justify-center">
                                <div className="w-24 bg-slate-800 rounded-full h-1.5">
                                  <div 
                                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" 
                                    style={{ width: `${student.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-bold w-8 text-right">{student.progress}%</span>
                              </div>
                            </td>
                            <td className="p-4 text-right text-slate-500 whitespace-nowrap">
                              {new Date(student.joinDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Students Yet</h3>
                    <p className="text-slate-400">Student data will appear here once learners enroll in your courses.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* All Activity Modal */}
      <AnimatePresence>
        {showActivityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0A192F] w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="text-emerald-400" /> All Activity Log
                </h3>
                <button onClick={() => setShowActivityModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {isLoadingActivity ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 mt-4">Loading activity data...</p>
                  </div>
                ) : activityData.length > 0 ? (
                  <div className="relative border-l border-white/10 ml-3 space-y-6 pb-4">
                    {activityData.map((activity, i) => {
                      const Icon = activity.icon;
                      return (
                        <div key={i} className="relative pl-6">
                          <div className={`absolute -left-[18px] top-0.5 w-9 h-9 ${activity.bg} ${activity.color} rounded-full flex items-center justify-center border border-[#0A192F] shadow-lg`}>
                            <Icon size={16} />
                          </div>
                          <div className="bg-[#112240] p-4 rounded-xl border border-white/5">
                            <h4 className="text-sm font-bold text-white leading-tight">{activity.title}</h4>
                            <p className="text-sm text-slate-400 mt-2">{activity.desc}</p>
                            <span className="text-[11px] font-bold text-slate-500 mt-3 block">
                              {activity.time.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Activity Yet</h3>
                    <p className="text-slate-400">Your notifications and reviews will appear here.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default OverviewContent;