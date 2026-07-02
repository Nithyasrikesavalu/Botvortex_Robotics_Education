import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, Users, DollarSign, MessageSquare, 
  Settings, LogOut, Bell, Menu, X, PlusCircle, CheckSquare, 
  UserCheck, Video, Activity, GraduationCap, Calendar
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import OverviewContent from './OverviewContent';
import InstructorMyCourses from './InstructorMyCourses';
import InstructorStudents from './InstructorStudents';
import ContentContent from './ContentContent';
import EarningsContent from './EarningsContent';
import ReviewsContent from './ReviewsContent';
import SettingsContent from './SettingsContent';
import CreateCourse from './CreateCourse';
import InstructorTaskManagement from './InstructorTaskManagement';
import InstructorAttendance from './InstructorAttendance';
import InstructorEvents from './InstructorEvents';
import InstructorLiveSession from './InstructorLiveSession';
import InstructorLiveChat from './InstructorLiveChat';
import { API_URL } from '../../config/api';

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [instructor, setInstructor] = useState({
    name: "Instructor",
    role: "Senior Robotics Instructor",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    email: "",
    stats: {
      totalStudents: 0,
      totalCourses: 0,
      totalEarnings: 0,
      averageRating: 0
    }
  });

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("instructorToken") || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/instructor/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("instructorToken"); // clear invalid token
        navigate("/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setInstructor(prev => ({
          ...prev,
          name: data.fullName || prev.name,
          avatar: data.avatar ? `${API_URL.replace('/api', '')}${data.avatar}` : prev.avatar,
          stats: data.stats || prev.stats,
          courses: data.courses || []
        }));
      } else {
        console.error("Dashboard failed:", await res.json());
      }
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    }
  };

  useEffect(() => {

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("instructorToken") || localStorage.getItem("token");
        if (token) {
          const res = await fetch(`${API_URL}/instructor/notifications`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setNotifications(data);
          }
        }
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };

    fetchDashboardData();
    fetchNotifications();
    
    // Check for locally saved notifications from features not yet fully backend-integrated
    const localNotifs = JSON.parse(localStorage.getItem('studentNotifications') || '[]');
    if (localNotifs.length > 0) {
      setNotifications(prev => [...localNotifs, ...prev].sort((a,b) => new Date(b.createdAt || b.time) - new Date(a.createdAt || a.time)));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'courses', label: 'Course Builder', icon: Video },
    { id: 'events', label: 'Upcoming Events', icon: Calendar },
    { id: 'live', label: 'Live Sessions', icon: Bell },
    { id: 'tasks', label: 'Projects & Tasks', icon: CheckSquare },
    { id: 'students', label: 'My Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const markNotificationRead = async (id) => {
    try {
      const token = localStorage.getItem("instructorToken") || localStorage.getItem("token");
      await fetch(`${API_URL}/instructor/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem("instructorToken") || localStorage.getItem("token");
      await fetch(`${API_URL}/instructor/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent instructor={instructor} />;
      case 'courses':
        return <CreateCourse instructor={instructor} />;
      case 'events':
        return <InstructorEvents instructor={instructor} />;
      case 'live':
        return <InstructorLiveSession instructor={instructor} />;
      case 'tasks':
        return <InstructorTaskManagement instructor={instructor} />;
      case 'students':
        return <InstructorStudents instructor={instructor} />;
      case 'attendance':
        return <InstructorAttendance instructor={instructor} />;
      case 'earnings':
        return <EarningsContent instructor={instructor} />;
      case 'reviews':
        return <ReviewsContent instructor={instructor} />;
      case 'settings':
        return <SettingsContent instructor={instructor} onUpdate={fetchDashboardData} />;
      default:
        return <OverviewContent instructor={instructor} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#060D1A] text-slate-300 font-sans selection:bg-[#00E5FF]/30">
      
      {/* Top Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0A192F]/90 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#7C3AED] to-[#00E5FF] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-wider">
                BOTVORTEX
              </span>
              <span className="block text-[10px] font-bold text-[#00E5FF] uppercase tracking-[0.2em] -mt-1">
                Instructor Hub
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#00E5FF] rounded-full border border-[#0A192F] animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-80 bg-[#0A192F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="text-white font-bold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-[#00E5FF] hover:text-white transition-colors">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif, index) => (
                        <div 
                          key={notif._id || index}
                          onClick={() => !notif.read && markNotificationRead(notif._id)}
                          className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-white/5' : ''}`}
                        >
                          <div className={`p-2 rounded-xl h-fit shrink-0 ${!notif.read ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'bg-slate-800 text-slate-400'}`}>
                            {notif.icon === 'Clock' ? <Activity size={18} /> : <BookOpen size={18} />}
                          </div>
                          <div>
                            <p className={`text-sm mb-1 ${!notif.read ? 'text-white font-medium' : 'text-slate-300'}`}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-400 mb-2">{notif.message}</p>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                              {new Date(notif.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400">
                        <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No new notifications</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-white">{instructor.name}</p>
                <p className="text-xs text-[#00E5FF]">{instructor.role}</p>
              </div>
              <img src={instructor.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} alt="Profile" className="w-10 h-10 rounded-full border-2 border-[#7C3AED] object-cover" />
            </div>
          </div>
          
          <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="pt-28 pb-12 px-4 md:px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Nav (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-gradient-to-b from-[#112240]/90 to-[#0A192F]/90 backdrop-blur-2xl border border-[#7C3AED]/20 rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.5)] h-fit sticky top-28">
          <div className="space-y-2">
            {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-[#7C3AED]/20 to-[#00E5FF]/20 text-white border border-white/10 shadow-lg' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-[#00E5FF]' : ''} />
              {item.label}
            </button>
            ))}
          </div>
          <div className="pt-6 mt-6 border-t border-white/5">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm text-red-400 hover:bg-red-400/10 w-full"
            >
              <LogOut size={18} />
              Exit to Portal
            </button>
          </div>
        </aside>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden bg-[#0A192F] rounded-2xl border border-white/10 p-4 space-y-2 shadow-2xl"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full font-bold text-sm ${
                    activeTab === item.id 
                      ? 'bg-gradient-to-r from-[#7C3AED]/20 to-[#00E5FF]/20 text-white border border-white/10' 
                      : 'text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} className={activeTab === item.id ? 'text-[#00E5FF]' : ''} />
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboard;
