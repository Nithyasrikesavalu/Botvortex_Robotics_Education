import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Medal, Zap, Shield, Target, Award } from 'lucide-react';

const Achievements = ({ user }) => {
  // Dynamically generate badges for completed courses & certificates
  const completedCourses = user?.completedCoursesList || [];
  
  const badges = completedCourses.map((course, index) => {
    const title = typeof course === 'object' ? (course.title || course.courseName) : course;
    return {
      id: `dyn-${index}`,
      name: `Graduated: ${title}`,
      description: `Completed the ${title} course and earned a verified certificate.`,
      icon: Award,
      color: index % 2 === 0 ? 'text-purple-400' : 'text-blue-400',
      bg: index % 2 === 0 ? 'bg-purple-400/20' : 'bg-blue-400/20',
      border: index % 2 === 0 ? 'border-purple-400/30' : 'border-blue-400/30',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  });

  return (
    <div className="space-y-8">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <Trophy size={32} className="text-[#ffd700]" /> 
          Achievements & Badges
        </h2>
        <p className="text-slate-400 mt-2">Track your learning milestones and earn exclusive rewards.</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total XP</p>
        <p className="text-3xl font-black text-[#00E5FF]">2,450</p>
      </div>
    </div>

    {/* Featured Milestone */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden bg-gradient-to-r from-[#1A0B2E] to-[#0A192F] p-8 rounded-3xl border border-white/10 shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED]/20 rounded-full blur-[80px]"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ff8c00] p-1 shadow-[0_0_30px_rgba(255,215,0,0.4)]">
          <div className="w-full h-full bg-[#0A192F] rounded-full flex items-center justify-center border-4 border-black/50">
            <Medal size={64} className="text-[#ffd700]" />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-[#ffd700]/20 text-[#ffd700] text-xs font-black uppercase tracking-widest rounded-full mb-3 border border-[#ffd700]/30">
            Next Milestone
          </div>
          <h3 className="text-2xl font-black text-white mb-2">Automation Expert (Level 15)</h3>
          <p className="text-slate-300 text-sm mb-4">Complete 5 more practical labs to unlock the exclusive Automation Expert badge and 500 bonus coins.</p>
          
          <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-gradient-to-r from-[#ffd700] to-[#ff8c00] rounded-full relative" style={{ width: '80%' }}>
              <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/30 animate-pulse skew-x-12"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
            <span>40 / 50 Labs Completed</span>
            <span className="text-[#ffd700]">80%</span>
          </div>
        </div>
      </div>
    </motion.div>

    {/* Badges Grid */}
    {badges.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-[#0A192F]/60 backdrop-blur-md rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 group text-center flex flex-col items-center relative overflow-hidden"
          >
            <div className={`absolute -top-10 -right-10 w-24 h-24 ${badge.bg} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            
            <div className={`w-16 h-16 rounded-2xl ${badge.bg} border ${badge.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
              <badge.icon size={32} className={badge.color} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{badge.name}</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">{badge.description}</p>
            
            <div className="mt-auto w-full pt-4 border-t border-white/5 flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              <span>Unlocked</span>
              <span className={badge.color}>{badge.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="text-center py-16 bg-[#0A192F]/40 rounded-3xl border border-white/5">
        <Award size={64} className="text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Achievements Yet</h3>
        <p className="text-slate-400">Complete courses and earn certificates to unlock badges.</p>
      </div>
    )}
    </div>
  );
};

export default Achievements;
