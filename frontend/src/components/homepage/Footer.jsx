import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Bot, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, ArrowRight } from "lucide-react";

/**
 * Footer component for BotVortex application.
 * Normalized from merge conflicts to include brand details, quick links,
 * course listings, contact info, and social integration.
 */
const Footer = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);

  const socialLinks = [
    { icon: Facebook, href: "#", color: "hover:text-blue-400" },
    { icon: Instagram, href: "#", color: "hover:text-pink-400" },
    { icon: Twitter, href: "#", color: "hover:text-blue-300" },
    { icon: Linkedin, href: "#", color: "hover:text-blue-500" },
    { icon: Youtube, href: "#", color: "hover:text-red-500" }
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "#features" },
    { name: "Roadmap", path: "#roadmap" },
    { name: "Reviews", path: "#reviews" },
    { name: "Sign Up", path: "/signup" }
  ];

  const courses = [
    "Beginner Robotics",
    "Embedded Systems",
    "AI & Machine Learning",
    "Advanced Robotics",
    "IoT Integration",
    "Computer Vision"
  ];

  const contactInfo = [
    { icon: Mail, text: "support@botvortex.ai", href: "mailto:support@botvortex.ai" },
    { icon: Phone, text: "+1 (555) 123-ROBO", href: "tel:+15551237626" },
    { icon: MapPin, text: "San Francisco, CA", href: "#" }
  ];

  return (
    <footer className="bg-gradient-to-br from-[#0B1426] to-[#0F1B2E] text-gray-300 border-t border-[#1E2A40]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* 🧠 Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00C3FF] to-[#8A5DFF] rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-[#00C3FF]">Bot</span>
                <span className="text-[#8A5DFF]">Vortex</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm">
              Empowering the next generation of robotics engineers with AI-powered learning,
              hands-on projects, and cutting-edge curriculum designed for the future.
            </p>

            {/* Newsletter Signup */}
            <div className="bg-[#1a2333] border border-[#1E2A40] rounded-xl p-4">
              <p className="text-white text-sm font-semibold mb-2">Stay Updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-[#0B1426] border border-[#1E2A40] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00C3FF]"
                />
                <button className="bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 🔗 Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-[#00C3FF]/30">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-[#00C3FF] transition-all duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-[#8A5DFF] rounded-full mr-3 group-hover:bg-[#00C3FF] transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 🎓 Courses */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-[#00C3FF]/30">
              Courses
            </h4>
            <ul className="space-y-3">
              {courses.map((course, index) => (
                <li key={index}>
                  <div className="text-gray-400 hover:text-[#8A5DFF] transition-all duration-200 flex items-center group cursor-pointer">
                    <span className="w-2 h-2 bg-[#00C3FF] rounded-full mr-3 group-hover:bg-[#8A5DFF] transition-colors"></span>
                    {course}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 📞 Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-[#00C3FF]/30">
              Contact Us
            </h4>
            <div className="space-y-4 mb-6">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <a
                    key={index}
                    href={contact.href}
                    className="flex items-center space-x-3 group hover:translate-x-1 transition-transform duration-200"
                  >
                    <Icon className="w-4 h-4 text-[#00C3FF] group-hover:scale-110 transition-transform" />
                    <span className="text-gray-400 group-hover:text-white text-sm transition-colors">
                      {contact.text}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 bg-[#1a2333] border border-[#1E2A40] rounded-lg flex items-center justify-center text-gray-400 ${social.color} hover:border-current transition-all duration-300 hover:scale-110`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1E2A40] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} <span className="text-[#00C3FF] font-semibold">BotVortex</span>. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-500 hover:text-[#00C3FF] transition-colors text-sm hover:underline"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-[#8A5DFF] transition-colors text-sm hover:underline"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-[#00C3FF] transition-colors text-sm hover:underline"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;