import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, Zap, Cpu, Brain, Users, Rocket, ArrowRight, Play, X } from "lucide-react";

const AboutSection = () => {
  const [showVideo, setShowVideo] = useState(false);
  // Correct the path - use forward slashes and make sure the file is in public folder
  const videoUrl = "/images/botvortex-demo.mp4"; // File should be in public/images folder

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Real-time AI tutor that adapts to your learning style and provides instant feedback"
    },
    {
      icon: Cpu,
      title: "Hands-on Projects",
      description: "Build real robots with guided projects, from simple circuits to advanced AI systems"
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Collaborate with thousands of robotics enthusiasts and industry experts"
    },
    {
      icon: Rocket,
      title: "Industry Ready",
      description: "Gain skills that are directly applicable in today's rapidly evolving robotics industry"
    }
  ];

  const openVideo = () => {
    setShowVideo(true);
  };

  const closeVideo = () => {
    setShowVideo(false);
  };
  
    useEffect(() => {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    }, []);
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative">
      {/* Video Modal */}
      {showVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeVideo}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            <div className="aspect-video">
              {/* Use video element instead of iframe for local files */}
              <video 
                controls 
                autoPlay 
                className="w-full h-full"
                onEnded={closeVideo}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="text-[#00C3FF] w-8 h-8" />
            <span className="text-2xl font-bold">
              <span className="text-[#00C3FF]">Bot</span>
              <span className="text-[#8A5DFF]">Vortex</span>
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Revolutionizing Robotics Education
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Where cutting-edge AI meets hands-on learning to create the next generation of robotics innovators
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* 🎥 Left Side – Video/Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-2 shadow-2xl cursor-pointer group"
                 onClick={openVideo}>
              {/* Video Thumbnail with Play Button */}
              <div className="bg-gray-900 rounded-xl p-6">
                <div className="aspect-video bg-gradient-to-br from-[#00C3FF]/20 to-[#8A5DFF]/20 rounded-lg flex items-center justify-center relative overflow-hidden group-hover:from-[#00C3FF]/30 group-hover:to-[#8A5DFF]/30 transition-all duration-300">
                  {/* Animated Background */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-[#00C3FF] rounded-full blur-xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#8A5DFF] rounded-full blur-xl"></div>
                  </div>
                  
                  {/* Play Button */}
                  <div className="text-center text-white z-10 transform group-hover:scale-110 transition-transform duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:shadow-3xl group-hover:from-[#00C3FF] group-hover:to-[#8A5DFF] transition-all duration-300">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                    <p className="text-lg font-semibold group-hover:text-[#00C3FF] transition-colors">Platform Demo</p>
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                      Click to watch the demo
                    </p>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#00C3FF] rounded-full group-hover:scale-125 transition-transform"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#8A5DFF] rounded-full group-hover:scale-125 transition-transform"></div>
            </div>

            {/* Video Description */}
            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm">
                See how BotVortex transforms robotics learning with AI-powered guidance
              </p>
            </div>
          </motion.div>

          {/* 🧠 Right Side – Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-gray-800"
          >
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] bg-clip-text text-transparent">
              The Future of Robotics Learning is Here
            </h3>
            
            <div className="space-y-4 mb-8">
              <p className="text-lg leading-relaxed">
                BotVortex is an advanced robotics learning platform designed to bridge the gap between theoretical concepts and real-world applications. We combine AI-powered guidance with hands-on projects to create an immersive learning experience.
              </p>
              
              <p className="text-lg leading-relaxed">
                Our intelligent AI tutor monitors your progress, provides real-time feedback, and adapts the curriculum to your learning style. Whether you're building your first circuit or developing complex autonomous systems, BotVortex guides you every step of the way.
              </p>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#00C3FF] transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-gray-200"
        >
          {[
            { number: "24+", label: "Courses" },
            { number: "10K+", label: "Students" },
            { number: "500+", label: "Projects" },
            { number: "98%", label: "Satisfaction" }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-[#00C3FF] transition-colors">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium group-hover:text-gray-800 transition-colors">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;