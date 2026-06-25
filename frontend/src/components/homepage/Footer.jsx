// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Bot, Mail, Phone, MapPin, Facebook, Instagram, Twitter,
//   Linkedin, Youtube, ArrowRight, ChevronUp, Globe, Shield
// } from "lucide-react";

// /**
//  * Footer component for BotVortex application.
//  * Redesigned for a premium, unique, and futuristic look.
//  * Features: Mesh gradients, glassmorphism, neon glows, and dynamic interactions.
//  */
// const Footer = () => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const toggleVisibility = () => {
//       if (window.pageYOffset > 300) {
//         setIsVisible(true);
//       } else {
//         setIsVisible(false);
//       }
//     };
//     window.addEventListener("scroll", toggleVisibility);
//     return () => window.removeEventListener("scroll", toggleVisibility);
//   }, []);

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   const socialLinks = [
//     { icon: Facebook, href: "#", color: "hover:bg-blue-600", glow: "hover:shadow-blue-500/50" },
//     { icon: Instagram, href: "#", color: "hover:bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600", glow: "hover:shadow-pink-500/50" },
//     { icon: Twitter, href: "#", color: "hover:bg-sky-400", glow: "hover:shadow-sky-400/50" },
//     { icon: Linkedin, href: "#", color: "hover:bg-blue-700", glow: "hover:shadow-blue-700/50" },
//     { icon: Youtube, href: "#", color: "hover:bg-red-600", glow: "hover:shadow-red-600/50" }
//   ];

//   const quickLinks = [
//     { name: "Home", path: "/#home" },
//     { name: "Features", path: "/#features" },
//     { name: "Courses", path: "/#courses" },
//     { name: "Roadmap", path: "/index#roadmap" },
//     { name: "Reviews", path: "/index#reviews" },
//     { name: "Sign Up", path: "/signup" }
//   ];

//   const categories = [
//     { name: "Beginner Path", path: "/Courses#beginner", badge: "New" },
//     { name: "Intermediate Labs", path: "/Courses#intermediate", badge: null },
//     { name: "Advanced Robotics", path: "/Courses#advanced", badge: "Pro" },
//     { name: "Specializations", path: "/specializations", badge: null },
//     { name: "Certification", path: "/certification", badge: "Certified" }
//   ];

//   return (
//     <footer className="relative bg-[#020617] text-gray-400 overflow-hidden pt-20 pb-10">
//       {/* 🌌 Background Effects */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
//         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#00C3FF]/10 rounded-full blur-[120px] animate-pulse"></div>
//         <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-[#8A5DFF]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#1E2A40] to-transparent opacity-30"></div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

//           {/* 🧠 Brand & Newsletter Column */}
//           <div className="lg:col-span-5 flex flex-col justify-between">
//             <div>
//               <div className="flex items-center gap-4 mb-6 group cursor-pointer">
//                 <div className="relative">
//                   <div className="absolute -inset-1 bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
//                   <div className="relative w-12 h-12 bg-black rounded-xl flex items-center justify-center border border-white/10">
//                     <Bot className="w-7 h-7 text-[#00C3FF]" />
//                   </div>
//                 </div>
//                 <div>
//                   <h2 className="text-3xl font-black tracking-tighter text-white">
//                     BOT<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF]">VORTEX</span>
//                   </h2>
//                   <p className="text-[10px] uppercase tracking-[0.3em] text-[#8A5DFF] font-bold">Evolution of Education</p>
//                 </div>
//               </div>

//               <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
//                 Master the future of technology. We provide world-class robotics and AI training designed to transform curious minds into elite engineers.
//               </p>
//             </div>

//             {/* Premium Newsletter */}
//             <div className="relative group max-w-md">
//               <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00C3FF]/50 to-[#8A5DFF]/50 rounded-2xl blur-sm opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
//               <div className="relative flex items-center bg-[#0B1426]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
//                 <Mail className="w-5 h-5 ml-4 text-gray-500" />
//                 <input
//                   type="email"
//                   placeholder="Join the vortex newsletter..."
//                   className="flex-1 bg-transparent border-none px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-0 text-sm"
//                 />
//                 <button className="bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] text-white p-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,195,255,0.4)] transition-all active:scale-95 group/btn">
//                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* 🔗 Links Grid */}
//           <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
//             {/* Quick Navigation */}
//             <div>
//               <h3 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-6">
//                 Navigation
//               </h3>
//               <ul className="space-y-3">
//                 {quickLinks.map((link) => (
//                   <li key={link.name}>
//                     <Link
//                       to={link.path}
//                       className="text-gray-500 hover:text-[#00C3FF] transition-colors duration-200 text-sm"
//                     >
//                       {link.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Courses / Learning */}
//             <div>
//               <h3 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-6">
//                 Curriculum
//               </h3>
//               <ul className="space-y-3">
//                 {categories.map((cat) => (
//                   <li key={cat.name}>
//                     <Link
//                       to={cat.path}
//                       className="group flex items-center justify-between text-gray-500 hover:text-[#8A5DFF] transition-colors duration-200 text-sm"
//                     >
//                       <span>{cat.name}</span>
//                       {cat.badge && (
//                         <span className="text-[8px] font-bold text-[#8A5DFF]/60 group-hover:text-[#8A5DFF]">
//                           {cat.badge}
//                         </span>
//                       )}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Contact Details */}
//             <div>
//               <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <div className="w-1 h-4 bg-white rounded-full"></div>
//                 HQ Office
//               </h3>
//               <div className="space-y-6">
//                 <a href="mailto:support@botvortex.ai" className="flex items-start gap-4 group">
//                   <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#00C3FF1a] group-hover:border-[#00C3FF4d] transition-all">
//                     <Mail className="w-4 h-4 text-gray-400 group-hover:text-[#00C3FF]" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500 mb-1">Email Us</p>
//                     <p className="text-sm text-gray-300 font-medium">support@botvortex.ai</p>
//                   </div>
//                 </a>
//                 <a href="tel:+15551237626" className="flex items-start gap-4 group">
//                   <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#8A5DFF1a] group-hover:border-[#8A5DFF4d] transition-all">
//                     <Phone className="w-4 h-4 text-gray-400 group-hover:text-[#8A5DFF]" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500 mb-1">Call Support</p>
//                     <p className="text-sm text-gray-300 font-medium">+1 (555) 123-ROBO</p>
//                   </div>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 📱 Social Hub & Bottom Bar */}
//         <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
//           <div className="flex items-center gap-3">
//             {socialLinks.map((social, idx) => {
//               const Icon = social.icon;
//               return (
//                 <a
//                   key={idx}
//                   href={social.href}
//                   className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color} hover:text-white ${social.glow} hover:-translate-y-1 hover:border-transparent`}
//                 >
//                   <Icon className="w-5 h-5" />
//                 </a>
//               );
//             })}
//           </div>

//           <p className="text-sm text-gray-600 font-medium order-3 md:order-2">
//             © {new Date().getFullYear()} BOTVORTEX. ENGINEERED FOR THE FUTURE.
//           </p>

//           <div className="flex items-center gap-6 order-2 md:order-3">
//             <Link to="/privacy" className="text-xs text-gray-600 hover:text-[#00C3FF] transition-colors">PRIVACY</Link>
//             <Link to="/terms" className="text-xs text-gray-600 hover:text-[#8A5DFF] transition-colors">TERMS</Link>
//             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
//               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
//               <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Systems Online</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 🚀 Scroll to Top */}
//       <button
//         onClick={scrollToTop}
//         className={`fixed bottom-8 right-8 z-[99] p-3 rounded-2xl bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] text-white shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
//           }`}
//       >
//         <ChevronUp className="w-6 h-6" />
//       </button>

//       {/* Glassy Overlay for uniqueness */}
//       <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
//     </footer>
//   );
// };

// export default Footer;

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
    { name: "Pricing", path: "/pricing" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const resources = [
    { name: "Blog", path: "/blog" },
    { name: "Tutorials", path: "/tutorials" },
    { name: "Documentation", path: "/docs" },
    { name: "Community", path: "/community" },
    { name: "Support", path: "/support" },
    { name: "FAQ", path: "/faq" }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
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
              <a href="mailto:support@botvortex.ai" className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#00C3FF] transition-colors">
                <Mail className="w-4 h-4" />
                <span>support@botvortex.ai</span>
              </a>
              <a href="tel:+15551237626" className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#8A5DFF] transition-colors">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-7626</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
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

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-[#8A5DFF] transition-colors"
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