import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { API_URL } from '../../config/api';
import { BookOpen, CheckSquare, Award, TrendingUp } from 'lucide-react';

const activityData = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 3.8 },
  { name: 'Wed', hours: 1.5 },
  { name: 'Thu', hours: 4.2 },
  { name: 'Fri', hours: 5.0 },
  { name: 'Sat', hours: 6.5 },
  { name: 'Sun', hours: 3.0 },
];

const LearningProgress = () => {
  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    tasksCompleted: 0,
    totalLessonsCompleted: 0,
    totalLessons: 0,
    overallProgress: 0,
    skillData: [
      { subject: 'Arduino', A: 0, fullMark: 100 },
      { subject: 'IoT',     A: 0, fullMark: 100 },
      { subject: 'Python',  A: 0, fullMark: 100 },
      { subject: 'Sensors', A: 0, fullMark: 100 },
      { subject: 'Robotics',A: 0, fullMark: 100 },
      { subject: 'C++',     A: 0, fullMark: 100 },
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch profile (has coursesEnrolled, coursesCompleted, tasksCompleted, completedCoursesList)
        const profileRes = await fetch(`${API_URL}/student/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch enrolled courses (has progress, completedLessons, totalLessons per course)
        const coursesRes = await fetch(`${API_URL}/student/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        let profileData = null;
        let coursesData = [];

        if (profileRes.ok) profileData = await profileRes.json();
        if (coursesRes.ok) coursesData = await coursesRes.json();

        // Aggregate lesson counts
        const totalLessonsCompleted = coursesData.reduce((sum, c) => sum + (c.completedLessons || 0), 0);
        const totalLessons = coursesData.reduce((sum, c) => sum + (c.totalLessons || 0), 0);

        // Overall progress = average of all course progress values, ensuring bounds
        const overallProgress = coursesData.length > 0
          ? Math.min(100, Math.round(coursesData.reduce((sum, c) => {
              // Recalculate progress dynamically in case DB is out of sync
              const dynamicProg = c.totalLessons > 0 ? (c.completedLessons / c.totalLessons) * 100 : (c.progress || 0);
              return sum + (c.progress > 0 ? c.progress : dynamicProg);
            }, 0) / coursesData.length))
          : 0;

        const coursesEnrolled  = profileData?.coursesEnrolled  || coursesData.length || 0;
        const coursesCompleted = profileData?.coursesCompleted || 0;
        const tasksCompleted   = profileData?.tasksCompleted   || 0;

        // Build skill radar: weight each skill by course completion %
        // Map courses to skills heuristically using course titles
        const skillMap = { Arduino: 0, IoT: 0, Python: 0, Sensors: 0, Robotics: 0, 'C++': 0 };
        coursesData.forEach(c => {
          const title = (c.title || '').toLowerCase();
          const prog  = c.progress || 0;
          if (title.includes('arduino'))    skillMap['Arduino']  = Math.max(skillMap['Arduino'],  prog);
          if (title.includes('iot'))        skillMap['IoT']      = Math.max(skillMap['IoT'],      prog);
          if (title.includes('python'))     skillMap['Python']   = Math.max(skillMap['Python'],   prog);
          if (title.includes('sensor'))     skillMap['Sensors']  = Math.max(skillMap['Sensors'],  prog);
          if (title.includes('robot'))      skillMap['Robotics'] = Math.max(skillMap['Robotics'], prog);
          if (title.includes('c++') || title.includes('cpp')) skillMap['C++'] = Math.max(skillMap['C++'], prog);
        });

        // If no specific match, spread overall progress equally so radar isn't empty
        const hasAnyMatch = Object.values(skillMap).some(v => v > 0);
        if (!hasAnyMatch && overallProgress > 0) {
          Object.keys(skillMap).forEach(k => { skillMap[k] = Math.round(overallProgress * 0.8); });
        }

        const skillData = Object.entries(skillMap).map(([subject, A]) => ({
          subject, A, fullMark: 100
        }));

        setStats({
          coursesEnrolled,
          coursesCompleted,
          tasksCompleted,
          totalLessonsCompleted,
          totalLessons,
          overallProgress,
          skillData
        });
      } catch (err) {
        console.error('Error fetching learning progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const statCards = [
    {
      label: 'Courses Enrolled',
      value: stats.coursesEnrolled,
      icon: BookOpen,
      color: 'text-[#00E5FF]',
      bg: 'bg-[#00E5FF]/10',
      border: 'border-[#00E5FF]/20'
    },
    {
      label: 'Courses Completed',
      value: stats.coursesCompleted,
      icon: Award,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/20'
    },
    {
      label: 'Tasks Completed',
      value: stats.tasksCompleted,
      icon: CheckSquare,
      color: 'text-[#7C3AED]',
      bg: 'bg-[#7C3AED]/10',
      border: 'border-[#7C3AED]/20'
    },
    {
      label: 'Lessons Done',
      value: `${stats.totalLessonsCompleted}/${stats.totalLessons}`,
      icon: TrendingUp,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20'
    },
  ];

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-[#7C3AED] rounded-full" />
        Learning Progress Center
      </h2>

      {/* ── Course Completion Overview ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#0A192F]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg mb-6"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Course Completion Status</h3>
            <p className="text-sm text-slate-400">
              {stats.overallProgress >= 80
                ? '🔥 Excellent work! You are almost there.'
                : stats.overallProgress >= 40
                ? '✅ You are doing great! Keep up the momentum.'
                : stats.overallProgress > 0
                ? '🚀 Good start! Keep pushing forward.'
                : '📚 Enroll in a course and start learning!'}
            </p>
          </div>

          <div className="flex-1 w-full max-w-md">
            <div className="flex justify-between text-sm font-bold text-white mb-2">
              <span>Overall Course Progress</span>
              <span className="text-[#00E5FF]">{stats.overallProgress}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${stats.overallProgress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
              </motion.div>
            </div>

          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-3 p-4 rounded-xl border ${card.bg} ${card.border}`}
            >
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon size={18} className={card.color} />
              </div>
              <div>
                <p className={`text-xl font-black ${card.color}`}>
                  {loading ? '–' : card.value}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-tight">
                  {card.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 bg-[#0A192F]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Weekly Learning Activity</h3>
            <select className="bg-[#112240] text-[#00E5FF] border border-[#00E5FF]/30 rounded-lg px-3 py-1 text-sm outline-none">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00E5FF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#8892b0" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8892b0" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#112240', borderColor: 'rgba(0,229,255,0.2)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#00E5FF' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#00E5FF" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Skill Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#0A192F]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col"
        >
          <h3 className="text-lg font-bold text-white mb-1">Skill Growth Radar</h3>
          <p className="text-xs text-slate-400 mb-4">Your proficiency across domains</p>

          <div className="flex-1 w-full flex items-center justify-center min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.skillData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#8892b0', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="A" stroke="#7C3AED" strokeWidth={2} fill="#7C3AED" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#112240', borderColor: 'rgba(124,58,237,0.2)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#7C3AED' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default LearningProgress;
