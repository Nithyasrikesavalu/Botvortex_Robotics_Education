import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Award, Brain, Cpu, Users, Rocket } from "lucide-react";

const CertificateShowcase = () => {
  const certificateData = {
    studentName: "Nithyasri.K",
    courseName: "AI-Powered Robotics Mastery",
    completionDate: "December 2024",
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);
  const achievements = [
    { icon: Brain, title: "AI-Guided Learning", description: "Adaptive feedback ensures continuous growth", count: "10K+" },
    { icon: Cpu, title: "Practical Robotics", description: "Real-world projects and industry tools", count: "95%" },
    { icon: Users, title: "Global Recognition", description: "Worldwide network of professionals", count: "50+" },
    { icon: Rocket, title: "Career Boost", description: "Verified certificates for portfolios", count: "4.9★" }
  ];
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);
  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-center gap-12">

      {/* LEFT SIDE - Certificate */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="relative w-full md:w-1/2 max-w-2xl"
      >
        {/* Certificate Container */}
        <div id="certificate-download-area" className="relative rounded-2xl shadow-2xl border border-gray-200 overflow-hidden bg-white backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02] hover:border-blue-300">

          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl -m-0.5"></div>

          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 w-14 h-14 border-t-2 border-l-2 border-blue-600/60 transition-all duration-500 hover:border-blue-600"></div>
          <div className="absolute top-4 right-4 w-14 h-14 border-t-2 border-r-2 border-purple-600/60 transition-all duration-500 hover:border-purple-600"></div>
          <div className="absolute bottom-4 left-4 w-14 h-14 border-b-2 border-l-2 border-purple-600/60 transition-all duration-500 hover:border-purple-600"></div>
          <div className="absolute bottom-4 right-4 w-14 h-14 border-b-2 border-r-2 border-blue-600/60 transition-all duration-500 hover:border-blue-600"></div>

          {/* Background Pattern - Simplified to avoid external URL CORS issues */}
          <div className="absolute inset-0 opacity-[0.03] bg-gradient-to-br from-blue-600 to-purple-600"></div>

          {/* Certificate Content */}
          <div className="relative z-10 text-center p-8 md:p-12 flex flex-col items-center justify-center">

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500 hover:scale-110">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BOTVORTEX
                </span>
              </div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                Empowering the Next Generation of Robotics Innovators
              </p>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-light text-gray-900 mb-10 tracking-widest uppercase border-b border-gray-200 pb-4 w-full">
              Certificate of Achievement
            </h1>

            {/* Student Name */}
            <div className="mb-8 w-full">
              <p className="text-gray-600 text-sm mb-3 italic font-light">
                This certificate is proudly presented to
              </p>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-wide py-2 transition-all duration-500 hover:scale-105">
                {certificateData.studentName}
              </h2>
            </div>

            {/* Course Info */}
            <div className="mb-8 w-full">
              <p className="text-gray-600 text-sm mb-3 leading-relaxed max-w-md mx-auto">
                In recognition of the successful completion of the robotics learning program titled
              </p>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 italic bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">
                {certificateData.courseName}
              </h3>
            </div>

            {/* Footer */}
            <div className="mt-6 w-full">
              <p className="text-gray-500 text-sm mb-2">
                Presented with distinction by{" "}
                <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BotVortex Academy
                </span>
              </p>
              <p className="text-gray-500 text-sm mb-8">
                Issued on {certificateData.completionDate}
              </p>

              {/* Award Seal */}
              <div className="flex justify-center mb-4">
                <div className="relative transition-all duration-500 hover:scale-110">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-xl">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-white/70"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Corner Robot Icon - Replaced with Lucide to avoid CORS issues */}
          <div className="absolute bottom-4 right-4 text-blue-600/30">
            <Bot className="w-12 h-12" />
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE - Description and Features */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full md:w-1/2 space-y-8"
      >
        {/* Header Section */}
        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Your Robotics Journey,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Certified
            </span>{" "}
            with BotVortex
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Every BotVortex learner earns a professional certification upon course completion.
            These certificates validate your robotics knowledge, hands-on experience, and AI-based learning progress —
            helping you stand out in your academic or career pursuits.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 transition-all duration-300 hover:shadow-lg"
          >
            <div className="text-2xl md:text-3xl font-bold text-blue-600">10K+</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">Certificates Issued</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 transition-all duration-300 hover:shadow-lg"
          >
            <div className="text-2xl md:text-3xl font-bold text-purple-600">95%</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">Completion Rate</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 transition-all duration-300 hover:shadow-lg"
          >
            <div className="text-2xl md:text-3xl font-bold text-pink-600">50+</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">Countries</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 rounded-lg bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 transition-all duration-300 hover:shadow-lg"
          >
            <div className="text-2xl md:text-3xl font-bold text-cyan-600">4.9★</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">Rating</div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <FeatureCard
                key={index}
                icon={<Icon className="w-6 h-6 text-blue-600" />}
                title={achievement.title}
                text={achievement.description}
                count={achievement.count}
                gradient="from-blue-50 to-blue-100"
                borderColor="border-blue-200"
                hoverBorderColor="hover:border-blue-300"
                delay={index * 0.1}
              />
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

// Enhanced Feature Card Component with Hover Effects
const FeatureCard = ({ icon, title, text, count, gradient, borderColor, hoverBorderColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`group p-6 rounded-xl bg-gradient-to-br ${gradient} border ${borderColor} ${hoverBorderColor} transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}
  >
    <div className="flex items-start gap-4">
      <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-gray-900 transition-colors duration-300">{title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300 mb-2">{text}</p>
        <div className="text-2xl font-bold text-blue-600">{count}</div>
      </div>
    </div>
  </motion.div>
);

export default CertificateShowcase;