import { Bot, Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
 
const MycoursesFooter = () => {

    useEffect(() => {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    }, []);
  return (
    <footer className="bg-[#0B1426] text-gray-300 pt-10 pb-6 border-t border-[#1a2333]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo + About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bot className="text-[#00C3FF] w-6 h-6" />
            <span className="text-2xl font-bold">
              <span className="text-[#00C3FF]">Bot</span>
              <span className="text-[#8A5DFF]">Vortex</span>
            </span>
          </div>

          <p className="text-gray-400 text-sm leading-6">
            BotVortex offers high-quality courses, skill development,
            interactive learning and career-ready training for all students.
          </p>

          <div className="flex gap-4 mt-4">
            <Facebook className="w-5 h-5 hover:text-[#00C3FF] cursor-pointer" />
            <Instagram className="w-5 h-5 hover:text-[#8A5DFF] cursor-pointer" />
            <Linkedin className="w-5 h-5 hover:text-[#00C3FF] cursor-pointer" />
            <Youtube className="w-5 h-5 hover:text-red-500 cursor-pointer" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-3 text-gray-400">
            <li><Link className="hover:text-[#00C3FF]" to="/">Home</Link></li>
            <li><Link className="hover:text-[#00C3FF]" to="/courses">Courses</Link></li>
            <li><Link className="hover:text-[#00C3FF]" to="/my-courses">My Courses</Link></li>
            <li><Link className="hover:text-[#00C3FF]" to="/features">Features</Link></li>
            <li><Link className="hover:text-[#00C3FF]" to="/roadmap">Roadmap</Link></li>
          </ul>
        </div>

        {/* Student Support */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Student Support</h3>
          <ul className="space-y-3 text-gray-400">
            <li><Link className="hover:text-[#00C3FF]" to="/faq">FAQ</Link></li>
            <li><Link className="hover:text-[#00C3FF]" to="/help">Help Center</Link></li>
            <li><Link className="hover:text-[#00C3FF]" to="/contact">Contact Us</Link></li>
            <li><Link className="hover:text-[#00C3FF]" to="/privacy">Privacy Policy</Link></li>
            <li><Link className="hover:text-[#00C3FF]" to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Contact Info</h3>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#00C3FF]" />
              support@botvortex.com
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#00C3FF]" />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#00C3FF]" />
              Chennai, Tamil Nadu, India
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-[#1a2333] pt-4">
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} BotVortex. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default MycoursesFooter;
