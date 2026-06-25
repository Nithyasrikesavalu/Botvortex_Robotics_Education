import { API_URL } from "../../config/api";
import React, { useState, useEffect } from "react";
import {
  Home,
  Lightbulb,
  GraduationCap,
  MapPin,
  MessageSquare,
  Menu,
  X,
  Bot,
  User,
  BookOpen,
  Settings,
  LogOut,
  Coins,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [active, setActive] = useState("Courses");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/programs") {
      setActive("Programs");
    } else if (location.pathname === "/index") {
      // Logic for hash can be complex, but for now just clear if not hash
      if (!location.hash) setActive("Home");
    }
  }, [location.pathname, location.hash]);

  const navItems = [
    { name: "Home", icon: Home, id: "home" },
    { name: "Features", icon: Lightbulb, id: "features" },
    { name: "Courses", icon: GraduationCap, id: "courses" },
    { name: "Programs", icon: BookOpen, id: "programs", path: "/programs" },
    { name: "Roadmap", icon: MapPin, id: "roadmap" },
    { name: "Reviews", icon: MessageSquare, id: "reviews" },
  ];

  /* New State for User Data */
  const [userData, setUserData] = useState(null);

  /* Dynamic Profile Items based on Role */
  const getProfileItems = () => {
    const baseItems = [
      { name: "Settings", icon: Settings, path: "/settings" },
      { name: "Logout", icon: LogOut, path: "/" },
    ];

    if (userData?.role === "instructor") {
      return [
        { name: "Dashboard", icon: Bot, path: "/instructor-dashboard" },
        ...baseItems
      ];
    }

    return [
      { name: "My Dashboard", icon: User, path: "/dashboard" },
      { name: "My Courses", icon: BookOpen, path: "/my-courses" },
      ...baseItems
    ];
  };

  const profileItems = getProfileItems();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUserData(JSON.parse(storedUser));
        return;
      }

      try {
        const response = await fetch(`${API_URL}/student/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const profileData = await response.json();
          setUserData(profileData);
        } else {
          // Fallback to localStorage if API fails
          const storedUser = localStorage.getItem("user");
          if (storedUser) setUserData(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUserData(JSON.parse(storedUser));
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Redirect to login
  };

  const handleNavClick = (item) => {
    setActive(item.name);
    setMenuOpen(false);

    if (item.path) {
      window.location.href = item.path;
      return;
    }

    if (location.pathname !== "/index") {
      navigate(`/index#${item.id}`);
      return;
    }

    const element = document.getElementById(item.id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="w-full fixed top-0 left-0 bg-[#0B1426] text-gray-300 z-50 border-b border-[#1a2333]">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <Bot className="text-[#00C3FF] w-6 h-6" />
          <span className="text-xl font-bold">
            <span className="text-[#00C3FF]">Bot</span>
            <span className="text-[#8A5DFF]">Vortex</span>
          </span>
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={`relative flex items-center gap-1 text-sm font-medium transition-colors ${active === item.name
                  ? "text-[#00C3FF]"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
                {active === item.name && (
                  <span className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-10 h-[2px] bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Rewards Coins Display */}
          <Link
            to="/buy-coins"
            className="hidden md:flex items-center gap-3 bg-gradient-to-r from-[#1a2333] to-[#0F1B2E] border border-[#FFD700]/30 px-4 py-2 rounded-xl hover:border-[#FFD700] hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all duration-300 cursor-pointer group"
          >
            <div className="relative">
              <Coins className="w-6 h-6 text-[#FFD700] group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00C3FF] rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white group-hover:text-[#FFD700] transition-colors">
                {(userData?.coins || 0).toLocaleString()}
              </span>
            </div>
          </Link>

          {/* Profile Dropdown */}
          {userData ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center bg-[#0F1B2E] border border-[#1E2A40] px-2 py-1 rounded-full hover:border-[#00C3FF] transition-all cursor-pointer group"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || userData.personal?.name || 'User')}&background=0D8ABC&color=fff`}
                  alt={userData.fullName || userData.personal?.name}
                  className="w-8 h-8 rounded-full group-hover:border-2 group-hover:border-[#00C3FF] transition-all"
                />
                <span className="ml-2 text-sm font-semibold text-white pr-2 group-hover:text-[#00C3FF] transition-colors">
                  {userData.fullName || userData.personal?.name}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0F1B2E] border border-[#1E2A40] rounded-2xl shadow-2xl py-3 z-50 backdrop-blur-sm">
                  {/* Profile Header with Rewards */}
                  <div className="flex items-center justify-between px-4 py-4 border-b border-[#1E2A40] hover:bg-[#1a2333] transition-colors rounded-t-2xl cursor-pointer">
                    <div className="flex items-center">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || userData.personal?.name || 'User')}&background=0D8ABC&color=fff`}
                        alt={userData.fullName || userData.personal?.name}
                        className="w-12 h-12 rounded-full border-2 border-[#00C3FF]"
                      />
                      <div className="ml-3">
                        <div className="text-white font-bold">{userData.fullName || userData.personal?.name}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest mt-0.5 px-2 py-0.5 rounded-md inline-block transition-all duration-300 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 group-hover:border-blue-500/30">
                          <span className={`${userData.role === 'instructor' ? 'text-purple-400' : 'text-blue-400'}`}>
                            {userData.role === 'instructor' ? 'Instructor' : 'Student'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 border border-[#FFD700]/30 px-3 py-2 rounded-full">
                      <Coins className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-sm font-bold text-white">{(userData?.coins || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Rewards Quick Access */}
                  <Link
                    to="/buy-coins"
                    className="flex items-center justify-between mx-3 my-2 p-3 bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border border-[#FFD700]/20 rounded-lg hover:border-[#FFD700] hover:scale-105 transition-all duration-200 group"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <div className="flex items-center">
                      <Coins className="w-5 h-5 text-[#FFD700] mr-3 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-white font-semibold">Get More Rewards</div>
                        <div className="text-xs text-[#FFD700]">Buy coins & earn bonuses</div>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-[#00C3FF] rounded-full animate-pulse"></div>
                  </Link>

                  {/* Profile Items */}
                  {profileItems.map((item, index) => {
                    const Icon = item.icon;
                    const isLastItem = index === profileItems.length - 1;
                    return (
                      <button
                        onClick={() => {
                          if (item.name === "Logout") handleLogout();
                          else window.location.href = item.path;
                          setProfileDropdownOpen(false);
                        }}
                        key={item.name}
                        className={`flex items-center w-full px-4 py-3 text-left w-full text-gray-300 transition-all duration-200 group ${isLastItem
                          ? "hover:bg-red-500/10 hover:text-red-400"
                          : "hover:bg-[#1a2333] hover:text-[#00C3FF]"
                          }`}
                      >
                        <Icon
                          className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${isLastItem
                            ? "group-hover:text-red-400"
                            : "group-hover:text-[#00C3FF]"
                            }`}
                        />
                        <span className="font-medium">{item.name}</span>
                        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#00C3FF] to-[#8A5DFF] opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-l"></div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-[#00C3FF] hover:bg-[#00AEEF] text-[#0B1426] font-bold py-2 px-6 rounded-full transition-colors">
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-[#1a2333] transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#0B1426] border-t border-[#1a2333]">
          {/* Mobile Rewards Display */}
          {userData && (
            <Link
              to="/buy-coins"
              className="flex items-center justify-between px-6 py-4 border-b border-[#1E2A40] bg-gradient-to-r from-[#1a2333] to-[#0F1B2E]"
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Coins className="w-7 h-7 text-[#FFD700]" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00C3FF] rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 font-medium">REWARDS</span>
                  <span className="text-xl font-bold text-white">{(userData?.coins || 0).toLocaleString()}</span>
                </div>
              </div>
              <div className="text-xs bg-[#00C3FF] text-white px-2 py-1 rounded-full font-bold">
                GET MORE
              </div>
            </Link>
          )}

          <div className="flex flex-col py-4 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200 group ${active === item.name
                    ? "text-[#00C3FF] bg-[#1a2333] border-r-4 border-[#00C3FF]"
                    : "text-gray-400 hover:text-white hover:bg-[#1a2333]"
                    }`}
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Mobile Profile Section */}
          <div className="border-t border-[#1E2A40] mt-4 pt-4 pb-6">
            {userData ? (
              <>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-[#1a2333] transition-colors rounded-lg mx-2 mb-2 group">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || userData.personal?.name || 'User')}&background=0D8ABC&color=fff`}
                      alt={userData.fullName || userData.personal?.name}
                      className="w-12 h-12 rounded-full border-2 border-[#00C3FF] group-hover:border-[#8A5DFF] transition-colors"
                    />
                    <div>
                      <div className="text-white font-bold group-hover:text-[#00C3FF] transition-colors">
                        {userData.fullName || userData.personal?.name}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest mt-0.5 px-2 py-0.5 rounded-md inline-block bg-white/5 border border-white/10">
                        <span className={`${userData.role === 'instructor' ? 'text-purple-400' : 'text-blue-400'}`}>
                          {userData.role === 'instructor' ? 'Instructor' : 'Student'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 border border-[#FFD700]/30 px-2 py-1 rounded-full">
                    <Coins className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-sm font-bold text-white">{(userData?.coins || 0).toLocaleString()}</span>
                  </div>
                </div>

                {profileItems.map((item, index) => {
                  const Icon = item.icon;
                  const isLastItem = index === profileItems.length - 1;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        if (item.name === "Logout") handleLogout();
                        else window.location.href = item.path;
                        setMenuOpen(false);
                      }}
                      className={`flex items-center w-full px-6 py-3 transition-all duration-200 group ${isLastItem
                        ? "text-gray-300 hover:bg-red-500/10 hover:text-red-400"
                        : "text-gray-300 hover:bg-[#1a2333] hover:text-[#00C3FF]"
                        }`}
                    >
                      <Icon
                        className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${isLastItem
                          ? "group-hover:text-red-400"
                          : "group-hover:text-[#00C3FF]"
                          }`}
                      />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </>
            ) : (
              <div className="px-6">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full bg-[#00C3FF] hover:bg-[#00AEEF] text-[#0B1426] font-bold py-3 text-center rounded-xl transition-colors"
                >
                  Login / Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;