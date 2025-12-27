import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, Zap, ArrowRight, Star, Clock, Users, BookOpen, Cpu, Brain, Rocket } from "lucide-react";

const CoursesSection = () => {

    useEffect(() => {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    }, []);
  const courseLevels = [
    {
      level: "Beginner",
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      description: "Perfect for newcomers! Learn the fundamentals of robotics, basic electronics, sensors, Arduino, and programming logic.",
      features: ["Basic Electronics", "Arduino Programming", "Sensor Integration", "First Robot Build"],
      duration: "3-4 Weeks",
      projects: "5+ Projects"
    },
    {
      level: "Intermediate",
      icon: Cpu,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      description: "Move to the next stage — explore embedded systems, motor control, communication protocols, and IoT integration.",
      features: ["Embedded Systems", "Motor Control", "Raspberry Pi", "IoT Integration"],
      duration: "5-6 Weeks",
      projects: "6+ Projects"
    },
    {
      level: "Advanced",
      icon: Brain,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      description: "For innovators and creators. Dive deep into AI, machine learning, ROS, computer vision, and autonomous navigation.",
      features: ["AI & ML", "ROS Framework", "Computer Vision", "Autonomous Systems"],
      duration: "7-8 Weeks",
      projects: "8+ Projects"
    }
  ];

  const stats = [
    { icon: BookOpen, number: "24+", label: "Courses" },
    { icon: Users, number: "10K+", label: "Students" },
    { icon: Star, number: "4.8/5", label: "Rating" },
    { icon: Zap, number: "500+", label: "Projects" }
  ];

  return (
    <section  className="py-20 bg-gradient-to-br from-[#0B1426] to-[#0F1B2E]">
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
          <h2 className="text-4xl font-bold text-white mb-4">
            Master Robotics — <span className="bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] bg-clip-text text-transparent">Step by Step</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Structured learning path from fundamentals to advanced AI-powered robotics systems
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* 🧠 Left Side - Course Levels */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 space-y-6"
          >
            {courseLevels.map((course, index) => {
              const Icon = course.icon;
              return (
                <motion.div
                  key={course.level}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`p-6 rounded-2xl border ${course.borderColor} ${course.bgColor} backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group`}
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${course.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{course.level} Level</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Zap className="w-4 h-4" />
                          {course.projects}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${course.color} transition-all duration-1000`}
                      style={{ width: `${(index + 1) * 30}%` }}
                    ></div>
                  </div>
                </motion.div>
              );
            })}

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center lg:text-left"
            >
              <Link
                to="/login"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <BookOpen className="w-5 h-5" />
                Explore All Courses
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* 🖼️ Right Side - Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                "/images/h2.png",
                "/images/h4.jpg",
                "/images/h1.jpg",
                "/images/h5.jpg"
              ].map((src, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  <img
                    src={src}
                    alt={`Robotics ${index + 1}`}
                    className="w-full h-48 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-br from-[#1a2333] to-[#0F1B2E] rounded-2xl p-6 border border-[#1E2A40]">
              <h4 className="text-lg font-semibold text-white mb-4 text-center">
                Learning Journey Stats
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="text-center group cursor-pointer"
                    >
                      <Icon className="w-6 h-6 text-[#00C3FF] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-2xl font-bold text-white group-hover:text-[#00C3FF] transition-colors">
                        {stat.number}
                      </div>
                      <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                        {stat.label}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;