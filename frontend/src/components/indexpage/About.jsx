import React from "react";
import { motion } from "framer-motion";
import { 
  Rocket, 
  Cpu, 
  Users, 
  Target, 
  Eye,
  BookOpen,
  Code,
  Microchip,
  Brain,
  Globe,
  Star,
  Zap,
  Shield,
  GraduationCap,
  Lightbulb,
  Settings
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Learn from Basics",
      description: "Begin your robotics journey with simple concepts like sensors, actuators, and circuits. Step-by-step modules help you move confidently from beginner to pro.",
      delay: 0.1
    },
    {
      icon: Brain,
      title: "AI Assisted Classes",
      description: "Get real-time help from AI teaching assistants during live classes — ask questions, get instant answers, and improve your learning speed.",
      delay: 0.2
    },
    {
      icon: Cpu,
      title: "Hands-on Projects",
      description: "Every course includes real robotic projects to build and test. Learn by doing — from coding microcontrollers to creating autonomous bots.",
      delay: 0.3
    },
    {
      icon: Users,
      title: "Live Classes",
      description: "Join interactive live sessions with expert mentors and community learners worldwide. Experience true collaboration and innovation in every session.",
      delay: 0.4
    },
    {
      icon: Microchip,
      title: "Embedded Systems",
      description: "Dive into advanced electronics — explore microcontrollers, circuit design, IoT, and embedded software that powers intelligent systems.",
      delay: 0.5
    },
    {
      icon: Rocket,
      title: "Career-Ready Skills",
      description: "By completing our learning tracks, you'll be ready for industry roles in robotics, automation, AI systems, and embedded engineering.",
      delay: 0.6
    }
  ];

  const missionVision = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To make robotics education accessible, exciting, and future-ready — empowering creators to shape intelligent machines that change the world."
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: "We envision a global learning community where AI and humans collaborate to learn, build, and innovate together."
    }
  ];

  const stats = [
    { number: "10K+", label: "Students Trained", icon: Users },
    { number: "500+", label: "Projects Completed", icon: Code },
    { number: "50+", label: "Expert Mentors", icon: GraduationCap },
    { number: "24/7", label: "AI Support", icon: Zap }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800">
      {/* 🏞️ Banner Section */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        {/* Banner Image */}
        <img
          src="/images/add.jpg"
          alt="About Banner"
          className="absolute w-full h-full object-cover opacity-30"
        />

        <motion.div 
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-6 shadow-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Rocket className="w-10 h-10 text-blue-600" />
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-7xl font-extrabold mb-6 text-white drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            About BotVortex
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Discover a futuristic learning platform where <span className="font-semibold text-white">innovation</span> meets <span className="font-semibold text-white">education</span> —  
            from <span className="font-bold">basic robotics</span> to <span className="font-bold">AI-driven automation</span>.
          </motion.p>
        </motion.div>
      </section>

      {/* 📊 Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-blue-900 mb-2">{stat.number}</h3>
                <p className="text-blue-700 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 💡 Platform Overview */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900">
            Our Learning Platform
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
            <span className="text-blue-600 font-semibold">BotVortex</span> is an innovative learning platform 
            designed to teach <span className="text-blue-700 font-semibold">Robotics, Embedded Systems, and Automation</span> —  
            starting from the fundamentals and progressing to <span className="text-blue-800 font-semibold">advanced AI-assisted systems</span>.
          </p>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto text-lg">
            Our goal is to transform how students learn technology. With <span className="text-blue-600 font-semibold">interactive live classes</span>,  
            <span className="text-blue-700 font-semibold"> AI-powered learning assistants</span>, and <span className="text-blue-800 font-semibold">hands-on robotic projects</span>,  
            you can master the skills needed for the future — all in one platform.
          </p>
        </motion.div>
      </section>

      {/* ⚙️ Features Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-blue-900"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Why Choose BotVortex?
          </motion.h2>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Blue accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700"></div>
                
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-blue-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                
                {/* Hover effect */}
                <div className="absolute inset-0 border-2 border-blue-200 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🌍 Mission & Vision */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-blue-900"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Our Mission & Vision
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {missionVision.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-blue-50 p-10 rounded-2xl shadow-lg border border-blue-100 text-center relative overflow-hidden group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-blue-900 mb-4">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{item.description}</p>
                
                {/* Corner accents */}
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🤖 AI + Robotics Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white relative overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/About.png"
            alt="Robotics Background"
            className="w-full h-full object-cover opacity-30"
          />
         
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-8 shadow-2xl">
              <Globe className="w-10 h-10 text-blue-600" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              The Future of Learning is Here
            </h2>
            
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-4xl mx-auto">
              At <span className="font-semibold text-white">BotVortex</span>, technology and creativity come together.  
              Our <span className="font-semibold text-white">AI-driven learning support</span> ensures no student is left behind.  
              Whether you're exploring your first robot or building an <span className="font-semibold text-white">AI-powered drone</span> —  
              we guide you every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🎯 Values Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-blue-900"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Our Core Values
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Innovation</h3>
              <p className="text-gray-600">Constantly pushing boundaries in robotics education and technology.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Community</h3>
              <p className="text-gray-600">Building a supportive network of learners and innovators.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Excellence</h3>
              <p className="text-gray-600">Delivering top-quality education and cutting-edge curriculum.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;