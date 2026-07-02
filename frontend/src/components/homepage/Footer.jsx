import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Bot, Mail, Phone, MapPin, 
  Facebook, Instagram, Twitter, 
  Linkedin, Youtube, ChevronUp,
  Heart, Globe
} from "lucide-react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const socialLinks = [
    { icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { icon: Instagram, href: "#", color: "hover:text-pink-600" },
    { icon: Twitter, href: "#", color: "hover:text-sky-400" },
    { icon: Linkedin, href: "#", color: "hover:text-blue-700" },
    { icon: Youtube, href: "#", color: "hover:text-red-600" }
  ];

  const quickLinks = [
    { name: "Home", path: "/#home" },
    { name: "Courses", path: "/#courses" },
    { name: "Features", path: "/#features" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[#0B1426] to-[#0F1B2E] text-gray-300 pt-16 pb-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00C3FF] rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8A5DFF] rounded-full blur-[100px] opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Column - Takes 2 columns on lg */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00C3FF] to-[#8A5DFF] rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-[#00C3FF]">Bot</span>
                <span className="text-[#8A5DFF]">Vortex</span>
              </span>
            </div>
            
            <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-md">
              Empowering the next generation of robotics engineers with cutting-edge AI education and hands-on learning experiences.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:botvortex.learning@gmail.com" className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#00C3FF] transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>botvortex.learning@gmail.com</span>
              </a>
              <a href="tel:+916369346836" className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#8A5DFF] transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+91 6369346836</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>San Francisco, CA 94105</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-[#00C3FF] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Get the latest updates on new courses and features.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00C3FF] transition-colors"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] text-white text-sm rounded-lg hover:shadow-lg transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <p className="text-xs text-gray-500 order-3 md:order-1">
              © {new Date().getFullYear()} BotVortex. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 order-1 md:order-2">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    className={`text-gray-400 ${social.color} transition-colors`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 order-2 md:order-3">
              <Link to="/privacy" className="text-xs text-gray-500 hover:text-[#00C3FF] transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-xs text-gray-500 hover:text-[#8A5DFF] transition-colors">
                Terms
              </Link>
              <Link to="/cookies" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Cookies
              </Link>
            </div>
          </div>

          {/* Made with love note */}
          <div className="flex justify-center items-center gap-1 mt-4 text-xs text-gray-600">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-[#8A5DFF] fill-current" />
            <span>by BotVortex Team</span>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] text-white rounded-lg shadow-lg transition-all duration-300 hover:scale-110 z-50 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16 pointer-events-none"
        }`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Footer; 