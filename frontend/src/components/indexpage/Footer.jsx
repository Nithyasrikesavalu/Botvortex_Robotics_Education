import React from "react";
import { Link } from "react-router-dom";
import { Bot } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="text-[#00C3FF] w-6 h-6" />
              <span className="text-xl font-bold">
                <span className="text-[#00C3FF]">Bot</span>
                <span className="text-[#8A5DFF]">Vortex</span>
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Empowering the next generation of robotics engineers with
              cutting-edge education and hands-on learning experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-cyan-300 mb-4 pb-2 border-b border-cyan-500/30">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Home", "Features", "Courses", "Roadmap", "Reviews"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to={`/index#${item.toLowerCase()}`}
                      className="text-gray-300 hover:text-cyan-400 transition-all duration-200 block transform hover:translate-x-1"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-lg font-semibold text-cyan-300 mb-4 pb-2 border-b border-cyan-500/30">
              Courses
            </h4>
            <ul className="space-y-2">
              {[
                { name: "Beginner Courses", to: "/Courses#beginner" },
                { name: "Intermediate Courses", to: "/Courses#intermediate" },
                { name: "Advanced Courses", to: "/Courses#advanced" },
                { name: "Programs", to: "/programs" },
                { name: "Specializations", to: "/specializations" },
                { name: "Certification", to: "/certification" },
              ].map((category, index) => (
                <li key={category.name}>
                  <Link
                    to={category.to}
                    className="text-gray-300 hover:text-cyan-400 transition-all duration-200 block transform hover:translate-x-1"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/Courses"
                  className="text-gray-300 hover:text-cyan-400 transition-all duration-200 block transform hover:translate-x-1"
                >
                  View All Courses
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-semibold text-cyan-300 mb-4 pb-2 border-b border-cyan-500/30">
              Contact Us
            </h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="text-cyan-400 mt-1">✉</span>
                <span>botvortex.learning@gmail.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-cyan-400 mt-1">📞</span>
                <span>+91 6369346836</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-cyan-400 mt-1">📍</span>
                <span>123 Robotics Way, Tech City</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-cyan-400 mt-1">🕒</span>
                <span>Mon-Fri: 9AM - 6PM</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-cyan-400 mt-1">🔧</span>
                <span>Support Center</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 BotVortex Robotics Education. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
