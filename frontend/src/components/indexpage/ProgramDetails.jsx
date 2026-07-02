import React from 'react';
import { motion } from 'framer-motion';
import {
    Bot,
    Cpu,
    Globe,
    Award,
    BookOpen,
    Users,
    ChevronRight,
    Brain,
    Video,
    Code,
    Microchip,
    Rocket,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CertificateShowcase from '../homepage/CourseCompletionCertificate';

const ProgramDetails = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const programs = [
        {
            title: "Foundations of Robotics",
            duration: "12 Weeks",
            level: "Beginner",
            icon: Cpu,
            color: "blue",
            coins: 2500,
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
            description: "Master the fundamentals of electronics, mechanics, and basic programming for autonomous systems.",
            modules: ["Introduction to Electronics", "Arduino Programming", "Basic Kinematics", "Sensor Integration"]
        },
        {
            title: "AI & Machine Learning",
            duration: "16 Weeks",
            level: "Intermediate",
            icon: Brain,
            color: "purple",
            coins: 3000,
            image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
            description: "Deep dive into neural networks, computer vision, and decision-making algorithms for smart robots.",
            modules: ["Neural Networks", "Computer Vision", "Reinforcement Learning", "NLP for Robotics"]
        },
        {
            title: "Advanced Autonomous Systems",
            duration: "20 Weeks",
            level: "Advanced",
            icon: Rocket,
            color: "indigo",
            coins: 3500,
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
            description: "Build industrial-grade autonomous vehicles and multi-robot coordination systems.",
            modules: ["SLAM Algorithms", "ROS 2 Masterclass", "Path Planning", "Drone Technology"]
        }
    ];

    return (
        <div className="min-h-screen bg-[#060D1A] text-white">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/10 to-[#7C3AED]/10 z-0"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-sm font-semibold mb-6 uppercase tracking-wider">
                            Our Academic Programs
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#00E5FF] to-[#7C3AED] bg-clip-text text-transparent">
                            Master the Future of <br />Autonomous Robotics
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
                            Explore our comprehensive curriculum designed by industry experts to transform
                            enthusiasts into world-class robotics engineers through hands-on learning.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Program Cards */}
            <section className="py-20 px-6">
                <div className="container mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {programs.map((program, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="group relative bg-[#0A192F]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-[#00E5FF]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#00E5FF]/5"
                            >
                                <div className="p-8">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#7C3AED] flex items-center justify-center mb-6 shadow-lg shadow-[#00E5FF]/20">
                                        <program.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-[#00E5FF] transition-colors">{program.title}</h3>
                                    <div className="flex gap-4 mb-4 text-sm text-slate-400">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" /> {program.duration}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Award className="w-4 h-4" /> {program.level}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 mb-6 leading-relaxed">
                                        {program.description}
                                    </p>

                                    <div className="space-y-3 mb-8">
                                        {program.modules.map((module, midx) => (
                                            <div key={midx} className="flex items-center gap-3 text-sm text-slate-300">
                                                <CheckCircle className="w-4 h-4 text-[#00E5FF]" />
                                                {module}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-20 bg-[#0A192F]/40 border-y border-white/5 relative">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: "Active Students", value: "5,000+", icon: Users },
                            { label: "Graduation Rate", value: "94%", icon: Award },
                            { label: "Partner Companies", value: "200+", icon: Globe },
                            { label: "Research Papers", value: "50+", icon: BookOpen }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="w-12 h-12 bg-[#00E5FF]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00E5FF]/20">
                                    <stat.icon className="w-6 h-6 text-[#00E5FF]" />
                                </div>
                                <h4 className="text-3xl font-black text-white mb-2">{stat.value}</h4>
                                <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-20 px-6">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose BotVortex Programs?</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Virtual Simulation Lab", desc: "Access high-end hardware simulations from your browser. No physical kits required for initial learning.", icon: Globe },
                            { title: "Industrial Curriculum", desc: "Our programs are mapped to the needs of top robotics firms like Boston Dynamics and Tesla.", icon: Microchip },
                            { title: "Lifetime Community", desc: "Join our global network of robotics engineers, researchers, and tech pioneers.", icon: Users },
                            { title: "1-on-1 Mentorship", desc: "Get direct feedback on your code and designs from experience industry veterans.", icon: Video },
                            { title: "Project Portfolio", desc: "Build real-world projects that look impressive on your resume and GitHub.", icon: Code },
                            { title: "Job Placement", desc: "Dedicated career support including mock interviews and portfolio review.", icon: Brain }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-[#0B1426] border border-blue-900/30 hover:bg-blue-900/10 transition-colors"
                            >
                                <feature.icon className="w-10 h-10 text-blue-500 mb-4" />
                                <h5 className="text-xl font-bold mb-3">{feature.title}</h5>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certification Section */}
            <div id="certification">
                <CertificateShowcase />
            </div>
        </div>
    );
};

const CheckCircle = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export default ProgramDetails;
