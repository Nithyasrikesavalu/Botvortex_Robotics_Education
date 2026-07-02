import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Award, Clock, Coins, Trophy, Flame, PlayCircle } from 'lucide-react';
import { API_URL } from '../../config/api';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const QuickStats = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${API_URL}/student/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => setProfile(data))
      .catch(err => console.error('Failed to load profile for stats', err));
  }, []);

  // Derive stats; provide safe defaults (0 or empty) if data missing
  const stats = [
    {
      title: "Courses Enrolled",
      value: profile?.coursesEnrolled?.toString() || "0",
      icon: <BookOpen size={24} />, 
      color: "from-blue-500 to-cyan-400",
      shadow: "shadow-cyan-500/20"
    },
    {
      title: "Courses Completed",
      value: profile?.coursesCompleted?.toString() || "0",
      icon: <CheckCircle size={24} />, 
      color: "from-emerald-500 to-green-400",
      shadow: "shadow-emerald-500/20"
    },
    {
      title: "Certificates Earned",
      value: profile?.certificatesEarned?.toString() || "0",
      icon: <Award size={24} />, 
      color: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/20"
    },
    {
      title: "Total Learning Hours",
      value: profile?.learningHours ? `${profile.learningHours}h` : "0h",
      icon: <Clock size={24} />, 
      color: "from-orange-500 to-amber-400",
      shadow: "shadow-orange-500/20"
    },
    {
      title: "Coin Balance",
      value: profile?.coins?.toLocaleString() || "0",
      icon: <Coins size={24} />, 
      color: "from-yellow-400 to-yellow-600",
      shadow: "shadow-yellow-500/20"
    },
    {
      title: "Global Ranking",
      value: profile?.globalRank ? `#${profile.globalRank}` : "#0",
      icon: <Trophy size={24} />, 
      color: "from-indigo-500 to-blue-500",
      shadow: "shadow-indigo-500/20"
    },
    {
      title: "Tasks Completed",
      value: profile?.tasksCompleted?.toString() || "0",
      icon: <PlayCircle size={24} />, 
      color: "from-teal-400 to-emerald-500",
      shadow: "shadow-teal-500/20"
    },
    {
      title: "Longest Streak",
      value: profile?.longestStreak ? `${profile.longestStreak} Days` : "0 Days",
      icon: <Flame size={24} />, 
      color: "from-red-500 to-orange-500",
      shadow: "shadow-red-500/20"
    }
  ];

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-[#00E5FF] rounded-full"></div>
        Quick Stats Overview
      </h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-[#0A192F]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:bg-[#112240] transition-colors shadow-lg ${stat.shadow} relative overflow-hidden group`}
          >
            {/* Hover Glow Effect */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>{stat.icon}</div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-white mb-1 tracking-tight">{stat.value}</h3>
              <p className="text-sm text-slate-400 font-medium">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default QuickStats;
