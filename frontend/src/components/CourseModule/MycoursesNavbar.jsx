import React, { useEffect, useState } from "react";
import { Bot, BookOpen, User, Settings, LogOut, Coins, Home, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const MycoursesNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUserData(JSON.parse(storedUser));
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const profileData = await response.json();
          setUserData(profileData);
        } else {
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
    window.location.href = "/login";
  };

  return (
    <nav className="w-full fixed top-0 left-0 bg-[#0B1426] text-gray-300 z-50 border-b border-[#1a2333]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LEFT - LOGO */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Bot className="text-[#00C3FF] w-6 h-6" />
            <span className="text-xl font-bold">
              <span className="text-[#00C3FF]">Bot</span>
              <span className="text-[#8A5DFF]">Vortex</span>
            </span>
          </Link>
        </div>

        {/* CENTER - NAV LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/index"
            className="flex items-center gap-1 text-gray-300 hover:text-[#00C3FF] transition"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>

          <Link
            to="/Courses"
            className="flex items-center gap-1 text-gray-300 hover:text-[#00C3FF] transition"
          >
            <Layers className="w-5 h-5" />
            <span className="font-medium">All Courses</span>
          </Link>

          <Link
            to="/my-courses"
            className="flex items-center gap-2 hover:text-[#00C3FF] transition"
          >
            <BookOpen className="w-5 h-5 text-[#00C3FF]" />
            <span className="text-lg font-semibold text-[#00C3FF]">My Courses</span>
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5">
          {/* Coins Display */}
          <Link
            to="/buy-coins"
            className="hidden md:flex items-center gap-2 bg-[#1a2333] border border-[#FFD700]/40 px-3 py-1 rounded-lg hover:border-[#FFD700] transition-colors"
          >
            <Coins className="w-5 h-5 text-[#FFD700]" />
            <span className="text-white font-bold">{(userData?.coins || 0).toLocaleString()}</span>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center bg-[#0F1B2E] border border-[#1E2A40] px-2 py-1 rounded-full hover:border-[#00C3FF] transition-all"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.fullName || userData?.personal?.name || 'User')}&background=0D8ABC&color=fff`}
                className="w-8 h-8 rounded-full"
                alt="Profile"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0F1B2E] border border-[#1E2A40] rounded-xl shadow-xl py-2 z-50">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-gray-300 hover:bg-[#1a2333] hover:text-[#00C3FF]"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="w-4 h-4 mr-3" /> My Profile
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-gray-300 hover:bg-[#1a2333] hover:text-[#00C3FF]"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-3" /> Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-red-500/10 text-left"
                >
                  <LogOut className="w-4 h-4 mr-3" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MycoursesNavbar;
