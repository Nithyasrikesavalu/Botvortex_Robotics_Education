import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../config/api';
import { Home, LogOut, LayoutDashboard, BookOpen, Award, CheckSquare, Bell, Star, Trophy, Target, Users, Calendar, CreditCard, Settings as SettingsIcon, MessageSquare, MessageCircle, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

// Import New Components
import HeroProfile from '../components/StudentDashboard/HeroProfile';
import DailyAttendance from '../components/StudentDashboard/DailyAttendance';
import QuickStats from '../components/StudentDashboard/QuickStats';
import LearningProgress from '../components/StudentDashboard/LearningProgress';
import TaskAssignmentHub from '../components/StudentDashboard/TaskAssignmentHub';
import CertificatesCenter from '../components/StudentDashboard/CertificatesCenter';
import Achievements from '../components/StudentDashboard/Achievements';
import Community from '../components/StudentDashboard/Community';
import UpcomingEvents from '../components/StudentDashboard/UpcomingEvents';
import Transactions from '../components/StudentDashboard/Transactions';
import Reviews from '../components/StudentDashboard/Reviews';
import LiveChat from '../components/StudentDashboard/LiveChat';
import Settings from '../components/StudentDashboard/Settings';
import MyCoursesPage from './MyCoursesPage';

const navItems = [
  { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: 'courses', label: 'My Courses', icon: <BookOpen size={20} /> },
  { id: 'progress', label: 'Learning Progress', icon: <Target size={20} /> },
  { id: 'tasks', label: 'Tasks & Assignments', icon: <CheckSquare size={20} /> },
  { id: 'certificates', label: 'Certificates', icon: <Award size={20} /> },
  { id: 'gamification', label: 'Achievements', icon: <Trophy size={20} /> },
  { id: 'reviews', label: 'Course Reviews', icon: <MessageSquare size={20} /> },
  { id: 'events', label: 'Upcoming Events', icon: <Calendar size={20} /> },
  { id: 'payments', label: 'Transactions', icon: <CreditCard size={20} /> }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || {}; } 
    catch { return {}; }
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('studentNotifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications([
        { id: '1', message: 'Welcome to BotVortex!', time: 'Just now', read: false }
      ]);
    }
  }, []);

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')) || {});
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/student/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);

          // Cache key fields into localStorage so next refresh shows instantly
          const stored = JSON.parse(localStorage.getItem('user') || '{}');
          const updated = {
            ...stored,
            // fullName from User model is the authoritative student name
            fullName: data.fullName || stored.fullName,
            // avatar from StudentProfile.personal takes priority
            avatar: data.personal?.avatar || stored.avatar
          };
          localStorage.setItem('user', JSON.stringify(updated));
          setUser(updated);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  // Merge local user data with fetched profile data
  // user already has fullName cached from last successful profileData fetch
  const mergedUser = {
    ...user,
    completedCoursesList: profileData?.completedCoursesList,
    coursesEnrolled: profileData?.coursesEnrolled,
    coursesCompleted: profileData?.coursesCompleted,
    tasksCompleted: profileData?.tasksCompleted,
    email: profileData?.email || user?.email,
    coins: profileData?.coins || user?.coins,
    ...profileData?.personal,
    ...profileData?.education,
    ...profileData?.academic,
    // fullName from User model always wins — never overridden by personal.name
    fullName: user?.fullName || profileData?.fullName
  };

  // displayName: use user.fullName (localStorage-cached) immediately — no flicker
  const displayName = user?.fullName || profileData?.fullName || user?.username || 'Student';
  const avatarImage = user?.avatar || profileData?.personal?.avatar || `https://robohash.org/${encodeURIComponent(displayName)}.png?set=set1&bgset=bg1&size=200x200`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#060D1A] flex text-slate-200 overflow-hidden font-sans selection:bg-[#00E5FF] selection:text-[#0A192F]">
      
      {/* Dynamic Background Particles (CSS based for performance) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[150px]"></div>
        <div className="absolute top-[40%] right-[40%] w-64 h-64 bg-[#00BFFF]/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        initial={{ width: 280, x: -280 }}
        animate={{ 
          width: isMobile ? 280 : (isSidebarOpen ? 280 : 80),
          x: isMobile ? (isSidebarOpen ? 0 : -280) : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`z-40 h-screen bg-[#0A192F]/95 backdrop-blur-xl border-r border-white/5 flex flex-col shrink-0 ${isMobile ? 'fixed top-0 left-0' : 'relative'}`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-[#00E5FF] to-[#7C3AED] flex items-center justify-center">
                <span className="font-extrabold text-white text-sm">BV</span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">BotVortex</span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    activeTab === item.id 
                      ? 'bg-gradient-to-r from-[#00E5FF]/10 to-transparent text-[#00E5FF]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {activeTab === item.id && (
                    <motion.div layoutId="activeNavIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00E5FF] rounded-r-full" />
                  )}
                  <span className={`transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  {isSidebarOpen && (
                    <span className="font-semibold text-sm whitespace-nowrap">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link to="/index" className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
            <Home size={20} className="group-hover:scale-110 transition-transform" />
            {isSidebarOpen && <span className="font-semibold text-sm">Home Page</span>}
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group">
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            {isSidebarOpen && <span className="font-semibold text-sm">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 scroll-smooth">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#060D1A]/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              >
                <Menu size={20} />
              </button>
            )}
            <h1 className="text-xl md:text-2xl font-bold text-white capitalize truncate max-w-[150px] sm:max-w-xs md:max-w-none">
              {navItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-4 relative">
            <button onClick={() => {
              setShowNotifications(!showNotifications);
              // Mark all as read when opening
              if (!showNotifications && notifications.some(n => !n.read)) {
                const readNotifs = notifications.map(n => ({...n, read: true}));
                setNotifications(readNotifs);
                localStorage.setItem('studentNotifications', JSON.stringify(readNotifs));
              }
            }} className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
              <Bell size={20} />
              {notifications.some(n => !n.read) && (
                <>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00E5FF] rounded-full animate-ping"></span>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00E5FF] rounded-full"></span>
                </>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute top-full right-16 mt-2 w-80 bg-[#0A192F]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="p-4 border-b border-white/10 bg-white/5">
                  <h3 className="text-white font-bold text-sm flex justify-between items-center">
                    Notifications
                    <span className="text-xs bg-[#00E5FF]/20 text-[#00E5FF] px-2 py-0.5 rounded-full">{notifications.length} New</span>
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-400">No new notifications</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${notif.read ? 'opacity-70' : 'bg-[#00E5FF]/5'}`}>
                        <p className="text-sm text-slate-200">{notif.message}</p>
                        <p className="text-[10px] text-slate-500 mt-1 font-bold">{notif.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-white group-hover:text-[#00E5FF] transition-colors">{displayName}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Level 12</p>
              </div>
              <img src={avatarImage} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-[#00E5FF] object-cover bg-slate-800" />
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DailyAttendance />
              <HeroProfile user={mergedUser} avatarImage={avatarImage} />
              <QuickStats />
              <LearningProgress />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TaskAssignmentHub user={mergedUser} />
                <CertificatesCenter user={mergedUser} />
              </div>
            </motion.div>
          )}

          {activeTab === 'courses' && (
            <MyCoursesPage />
          )}
          
          {activeTab === 'progress' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
               <LearningProgress />
             </motion.div>
          )}

          {activeTab === 'tasks' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
               <TaskAssignmentHub user={mergedUser} />
             </motion.div>
          )}

          {activeTab === 'certificates' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
               <CertificatesCenter user={mergedUser} />
             </motion.div>
          )}

          {activeTab === 'gamification' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
               <Achievements user={mergedUser} />
             </motion.div>
          )}

          {activeTab === 'reviews' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
               <Reviews />
             </motion.div>
          )}



          {activeTab === 'events' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
               <UpcomingEvents />
             </motion.div>
          )}

          {activeTab === 'payments' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
               <Transactions />
             </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
