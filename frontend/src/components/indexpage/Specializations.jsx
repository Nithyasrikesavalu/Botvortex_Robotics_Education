import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Cpu,
    Brain,
    Rocket,
    Clock,
    Award,
    ChevronRight,
    CheckCircle,
    Star,
    Zap,
    Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Specializations = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const specializations = [
        {
            title: "Hobbyist & Foundations",
            tag: "Level 1",
            duration: "8 Weeks",
            rating: "4.8",
            icon: Cpu,
            gradient: "from-blue-500 to-cyan-500",
            description: "Perfect for beginners. Master electronics, Arduino, and basic mechanical assembly for custom hobby projects.",
            features: [
                "Circuit Prototyping",
                "C++ Fundamentals",
                "Sensory Feedback",
                "Motor Control"
            ],
            difficulty: "Beginner"
        },
        {
            title: "Industrial Automation",
            tag: "Level 2",
            duration: "12 Weeks",
            rating: "4.9",
            icon: Zap,
            gradient: "from-purple-500 to-blue-500",
            description: "Bridge the gap between hobby and industry. Learn PLC, arm control, and smart manufacturing protocols.",
            features: [
                "PLC Programming",
                "Robotic Arm Kinematics",
                "SCADA Systems",
                "Safety Standards"
            ],
            difficulty: "Intermediate"
        },
        {
            title: "AI & Autonomous Tech",
            tag: "Level 3",
            duration: "16 Weeks",
            rating: "5.0",
            icon: Brain,
            gradient: "from-fuchsia-600 to-purple-600",
            description: "The cutting edge. Implement Computer Vision, SLAM, and Neural Networks for fully autonomous mobility.",
            features: [
                "Computer Vision",
                "Path Planning (A*)",
                "Deep Learning integration",
                "Lidar Data Fusion"
            ],
            difficulty: "Advanced"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 30 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1426] text-white selection:bg-blue-500/30">
            {/* 🌌 Cosmic Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            </div>

            {/* 🚀 Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="container mx-auto text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
                    >
                        <Target className="w-4 h-4" />
                        <span>Focused Expertise Tracks</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent leading-tight"
                    >
                        Master a Domain <br />
                        <span className="italic font-light">Become a Specialist</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
                    >
                        Our specialization tracks are intensive, project-based certifications designed
                        to give you deep expertise in specific sectors of the robotics industry.
                    </motion.p>
                </div>
            </section>

            {/* 🏗️ Specialization Grid */}
            <section className="py-20 px-6 relative z-10">
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {specializations.map((spec, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="group relative"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>

                                <div className="relative h-full flex flex-col bg-[#0F172A] border border-blue-900/30 rounded-2xl p-8 transition-transform duration-300 group-hover:-translate-y-2">
                                    {/* Icon & Level Toggle */}
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${spec.gradient} flex items-center justify-center shadow-lg shadow-blue-500/20`}>
                                            <spec.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                                            {spec.tag}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                                        {spec.title}
                                    </h3>

                                    <div className="flex items-center gap-4 mb-6 text-sm">
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <Clock className="w-4 h-4 text-blue-400" />
                                            <span>{spec.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span>{spec.rating}</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                                        {spec.description}
                                    </p>

                                    {/* Features List */}
                                    <div className="space-y-4 mb-10">
                                        {spec.features.map((feature, fidx) => (
                                            <div key={fidx} className="flex items-center gap-3 text-sm text-gray-300">
                                                <div className="p-1 rounded-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors duration-300">
                                                    <CheckCircle className="w-3 h-3 text-white" />
                                                </div>
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        to="/enroll"
                                        state={{ programType: "specialization", title: spec.title }}
                                        className="w-full group/btn relative inline-flex items-center justify-center py-4 px-6 overflow-hidden font-bold text-white rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-900/20"
                                    >
                                        <span className="relative flex items-center gap-2">
                                            Apply for Specialization <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </span>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 🛡️ Learning Guarantee Section */}
            <section className="py-20 bg-[#0F1B30]/50 border-y border-blue-900/30">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <h2 className="text-3xl font-bold mb-12">The BotVortex Specialist Path</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Hands-on First", icon: Rocket, desc: "Each specialization includes 5+ major projects using real simulation environments." },
                            { title: "Expert Review", icon: Award, desc: "Final capstones are reviewed by active robotics engineers from top tech firms." },
                            { title: "Career Connect", icon: Cpu, desc: "Specialists get priority access to our hiring network and partner referrals." }
                        ].map((item, idx) => (
                            <div key={idx} className="p-6">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <item.icon className="w-6 h-6 text-blue-400" />
                                </div>
                                <h4 className="text-lg font-bold mb-3">{item.title}</h4>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 📞 Call to Action */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-4xl relative overflow-hidden rounded-[2rem] p-12 text-center bg-gradient-to-br from-blue-600 to-purple-800">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white relative z-10">
                        Not sure which track is for you?
                    </h2>
                    <p className="text-blue-100 text-lg mb-10 relative z-10 max-w-2xl mx-auto">
                        Talk to our robotics counselor to find the perfect specialization track based on your current skills and career goals.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-700 font-extrabold rounded-2xl hover:bg-blue-50 transition-all duration-300 shadow-xl relative z-10"
                    >
                        Schedule a Consultation <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Specializations;
