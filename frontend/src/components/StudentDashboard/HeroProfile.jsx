import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Medal, Zap, Flame, Award, Target } from 'lucide-react';

const HeroProfile = ({ user = {}, avatarImage }) => {
  const displayName = user.fullName || user.name || user.username || 'Student';
  const displayEmail = user.email || 'student@botvortex.com';
  
  // Use passed avatarImage or fallback
  const finalAvatar = avatarImage || user.avatar || `https://robohash.org/${encodeURIComponent(displayName)}.png?set=set1&bgset=bg1&size=200x200`;
  
  // Fetch real details from merged user (StudentProfile DB)
  const userMajor = user.major || 'Advanced Robotics Engineering';
  const userGrade = user.semester || user.gradeLevel || '11th Grade';
  const studentId = user.studentId || 'BV-9824X';
  const userLevel = user.standing || 'Level 12';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full rounded-3xl overflow-hidden bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-cyan-500/10 mb-8"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
        
        {/* Avatar Section */}
        <div className="relative group">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-br from-[#00E5FF] to-[#7C3AED]">
            <img 
              src={finalAvatar} 
              alt={`${displayName} Avatar`} 
              className="w-full h-full rounded-full border-4 border-[#0A192F] object-cover bg-slate-800"
            />
          </div>
          
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7C3AED] to-[#00BFFF] px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg border border-white/20 whitespace-nowrap flex items-center gap-1">
            <Medal size={12} />
            {userLevel}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {displayName}
            </h1>
            <span className="bg-white/10 border border-white/20 text-[#00E5FF] px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase">
              ID: {studentId}
            </span>
          </div>
          
          <p className="text-slate-400 font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
            <Target size={16} className="text-[#7C3AED]" />
            {userMajor} <span className="mx-2">•</span> {userGrade}
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
                <Flame size={20} />
              </div>
              <div>
                <div className="text-xl font-bold text-white">14 Days</div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Streak</div>
              </div>
            </div>

            <div className="w-px h-10 bg-white/10 hidden md:block"></div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#00E5FF]/20 text-[#00E5FF]">
                <Zap size={20} />
              </div>
              <div>
                <div className="text-xl font-bold text-white">12,450</div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">XP Points</div>
              </div>
            </div>

            <div className="w-px h-10 bg-white/10 hidden md:block"></div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#7C3AED]/20 text-[#7C3AED]">
                <Award size={20} />
              </div>
              <div>
                <div className="text-xl font-bold text-white">Cyber Knight</div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Current Rank</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Circular Widget (Optional detail) */}
        <div className="hidden lg:flex flex-col items-center justify-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#00E5FF" strokeWidth="6" strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-white">75%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Complete</span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default HeroProfile;
