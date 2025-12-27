import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bot, Sparkles, Menu, X } from "lucide-react";

const HomeNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 bg-gradient-to-r from-[#0B1426] to-[#0F1B2E] text-white shadow-2xl border-b border-[#1E2A40] z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 h-16">
        
        {/* 🔷 Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00C3FF] to-[#8A5DFF] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <Sparkles className="w-3 h-3 text-[#00C3FF] absolute -top-1 -right-1" />
          </div>
          <span className="text-2xl font-bold">
            <span className="text-[#00C3FF]">Bot</span>
            <span className="text-[#8A5DFF]">Vortex</span>
          </span>
        </Link>

        {/* 🔘 Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/login"
            className="px-6 py-2 text-gray-300 hover:text-white font-semibold transition-all duration-300 hover:scale-105"
          >
            Register
          </Link>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] text-white px-6 py-2 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:from-[#00C3FF]/90 hover:to-[#8A5DFF]/90"
          >
            Sign Up
          </Link>
        </div>

        {/* 📱 Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden focus:outline-none"
        >
          {isMenuOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <Menu className="w-7 h-7 text-white" />
          )}
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0F1B2E] border-t border-[#1E2A40] px-6 py-4 space-y-3">
          <Link
            to="/login"
            onClick={() => setIsMenuOpen(false)}
            className="block text-gray-300 hover:text-white font-semibold"
          >
            Register
          </Link>
          <Link
            to="/signup"
            onClick={() => setIsMenuOpen(false)}
            className="block bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] text-white px-6 py-2 rounded-xl font-semibold text-center hover:shadow-xl transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default HomeNavbar;
