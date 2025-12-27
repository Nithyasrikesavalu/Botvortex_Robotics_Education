import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Features = () => {
  const [showVideo, setShowVideo] = useState(false);

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Learning',
      description: 'Our adaptive learning system personalizes content based on your progress, strengths, and areas needing improvement.'
    },
    {
      icon: '🖥️',
      title: 'Virtual Robotics Lab',
      description: 'Access our browser-based robotics simulator to experiment with concepts before applying them to physical robots.'
    },
    {
      icon: '🚀',
      title: 'Real-World Projects',
      description: 'Build portfolio-worthy projects that solve actual problems, with guidance from industry professionals.'
    },
    {
      icon: '👨‍🏫',
      title: 'Expert Mentors',
      description: 'Learn from robotics engineers and researchers who are actively working in the field.'
    },
    {
      icon: '🏆',
      title: 'Industry Certifications',
      description: 'Earn recognized certifications that validate your skills to employers.'
    },
    {
      icon: '🌐',
      title: 'Community Support',
      description: 'Join a global community of robotics enthusiasts to collaborate and grow together.'
    }
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

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header with Animation */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl font-bold text-blue-900 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Why Choose <span className="text-blue-600">BotVortex</span>?
          </motion.h2>
          <motion.p
            className="text-lg text-gray-700 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Our platform combines the latest in educational technology with industry expertise to deliver unparalleled learning experiences in robotics and AI.
          </motion.p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          {/* Video/Image Content */}
          <motion.div
            className="flex-1 relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Robotics Learning"
                className="w-full h-auto"
              />
              <button
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-blue-600 border-b-[10px] border-b-transparent ml-1"></div>
                </div>
              </button>
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-2xl -z-10 hidden md:block"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full -z-10 hidden md:block"></div>
          </motion.div>

          {/* Features Grid Overlay Text */}
          <motion.div
            className="flex-1 order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="text-3xl shrink-0 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Full Features Grid with Framer Motion */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* We can repeat features or add different ones, but based on the file, it was showing features twice in different layouts. 
              I'll keep the second grid layout as it was more modern. */}
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 border border-blue-100"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <div className="text-center mb-6">
                <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
              </div>
              <motion.div variants={textVariants}>
                <h3 className="text-xl font-semibold text-blue-900 mb-4 text-center group-hover:text-blue-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed text-center group-hover:text-gray-800 transition-colors duration-300">
                  {feature.description}
                </p>
              </motion.div>
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-500 -z-5" />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Start Your Robotics Journey Today</h3>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Join thousands of learners who have transformed their careers with our comprehensive robotics training program and state-of-the-art AI platform.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 z-[110]"
            >
              &times;
            </button>
            <motion.div
              className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Features;