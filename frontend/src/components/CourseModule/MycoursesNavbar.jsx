import { API_URL } from "../../config/api";
import React, { useEffect, useState } from "react";
import { Bot, BookOpen, Coins, Home, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const MycoursesNavbar = () => {
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
        const response = await fetch(`${API_URL}/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
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
          <Link
            to="/buy-coins"
            className="flex items-center gap-2 text-gray-300 hover:text-[#00C3FF] transition"
          >
            <Coins className="w-5 h-5" />
            <span className="font-medium">Buy Coins</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MycoursesNavbar;
