import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import CertificateShowcase from '../homepage/CourseCompletionCertificate';
import {
    Award,
    ShieldCheck,
    Globe,
    Briefcase,
    ExternalLink,
    Search,
    Download
} from 'lucide-react';

const CertificationPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const benefits = [
        {
            icon: ShieldCheck,
            title: "Industry Verified",
            desc: "Our certificates are recognized by leading robotics firms and academic institutions globally."
        },
        {
            icon: Globe,
            title: "Global Authenticity",
            desc: "Each certificate comes with a unique verifiable ID and a public profile for proof of skill."
        },
        {
            icon: Briefcase,
            title: "Career Advantage",
            desc: "BotVortex alumni have used these certifications to clear technical interviews at Tesla, ABB, and Fanuc."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0B1426] text-white">
            {/* 🎨 Premium Header Section */}
            <section className="relative pt-24 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold mb-6"
                    >
                        <Award className="w-4 h-4" />
                        <span>Professional Recognition</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent"
                    >
                        Verified Certification <br />
                        <span className="text-2xl md:text-4xl font-light">Validation for Every Milestone</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        Transform your learning into a tangible professional asset. Our certifications
                        are designed to prove your hands-on mastery of robotics and AI.
                    </motion.p>
                </div>
            </section>

            {/* 🏆 The Main Certificate Showcase */}
            <section className="py-10">
                <div className="container mx-auto px-4">
                    <CertificateShowcase />
                </div>
            </section>

            {/* 🔍 Verification Info */}
            <section className="py-20 bg-[#0F1B30]/50">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {benefits.map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex flex-col items-center text-center p-6 rounded-2xl border border-blue-900/30 bg-[#0B1426]/50 hover:bg-blue-900/10 transition-colors"
                            >
                                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                                    <benefit.icon className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {benefit.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ⚙️ Verification Features */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-6">How Verification Works</h2>
                            <div className="space-y-6">
                                {[
                                    { step: "01", title: "Skill Validation", desc: "Pass all core modules and the final hardware simulation capstone project." },
                                    { step: "02", title: "Identity Check", desc: "Secure multi-factor verification to ensure the right person gets the credit." },
                                    { step: "03", title: "Digital Ledger", desc: "Your achievement is recorded on our private blockchain for immutable proof." }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-6 items-start">
                                        <div className="text-4xl font-black text-blue-900/40">{step.step}</div>
                                        <div>
                                            <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                                            <p className="text-gray-400 text-sm">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-md bg-[#152033] border border-blue-900/50 rounded-[2rem] p-8 shadow-2xl relative">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl"></div>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Search className="w-5 h-5 text-blue-400" />
                                Verifier Preview
                            </h3>
                            <div className="space-y-6">
                                <div className="bg-[#0B1426]/50 rounded-xl p-4 border border-blue-900/30">
                                    <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">Credential Holder</div>
                                    <div className="text-lg font-bold text-white">Nithyasri.K</div>
                                </div>
                                <div className="bg-[#0B1426]/50 rounded-xl p-4 border border-blue-900/30">
                                    <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">Course Name</div>
                                    <div className="text-sm font-medium text-gray-300">AI-Powered Robotics Mastery</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#0B1426]/50 rounded-xl p-4 border border-blue-900/30">
                                        <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">Issued On</div>
                                        <div className="text-xs font-medium text-gray-300">Dec 2024</div>
                                    </div>
                                    <div className="bg-[#0B1426]/50 rounded-xl p-4 border border-blue-900/30">
                                        <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">Status</div>
                                        <div className="text-xs font-bold text-green-400 flex items-center gap-1">
                                            <ShieldCheck className="w-3 h-3" /> ACTIVE
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-blue-900/30 flex justify-between items-center text-xs text-gray-500">
                                    <span>ID: BV-992-XKA-2024</span>
                                    <span className="flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3 text-cyan-400" /> AUTHENTIC
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CertificationPage;
