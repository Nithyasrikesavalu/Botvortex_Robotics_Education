import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, ExternalLink, Share2, CheckCircle, Eye } from 'lucide-react';
import CertificateModal from './CertificateModal';

// Certificates data will be dynamically generated based on completed courses

const CertificatesCenter = ({ user }) => {
  const [selectedCert, setSelectedCert] = useState(null);

  // Check if user has any completed courses
  // Backend returns 'completedCoursesList' — support both field names
  const completedCourses = user?.completedCoursesList || user?.completedCourses || [];
  const hasCertificates = completedCourses.length > 0;

  // Get student name: prefer fullName from backend/profile, fallback to localStorage
  const localUser = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();
  const studentName = user?.fullName || user?.name || user?.username || localUser?.fullName || localUser?.name || localUser?.username || "Student";

  // Map completed courses to certificate data, or use empty array
  const dynamicCertificates = completedCourses.map((course, index) => ({
    id: `CERT-2026-${1000 + index * 42}`,
    title: typeof course === 'object' ? (course.title || course.courseName) : course,
    studentName,
    instructor: "Alex Bensom",
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    grade: "A+",
    color: index % 2 === 0 ? "from-purple-600 to-blue-600" : "from-emerald-600 to-teal-600"
  }));
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
        Certificates Center
      </h2>

      {hasCertificates ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dynamicCertificates.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group relative bg-[#0A192F]/80 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl"
            >
              {/* Background Pattern */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-10`} />
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

              <div className="relative p-6 flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white shadow-lg backdrop-blur-sm">
                      <Award size={28} />
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                      <CheckCircle size={12} /> Verified
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                    {cert.title}
                  </h3>
                  
                  <div className="space-y-1 mb-6">
                    <p className="text-sm text-slate-400 font-medium">Issued: {cert.date}</p>
                    <p className="text-sm text-slate-400 font-medium font-mono text-[10px] uppercase tracking-wider">{cert.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <button 
                    onClick={() => setSelectedCert(cert)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                  >
                    <Eye size={16} /> View Certificate
                  </button>
                  <button className="p-2 bg-[#112240] hover:bg-[#1a365d] text-white rounded-lg transition-colors border border-white/5">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A192F]/40 backdrop-blur-md rounded-2xl border border-white/5 p-10 flex flex-col items-center justify-center text-center shadow-lg"
        >
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-500 border border-white/10">
            <Award size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Certificates Yet</h3>
          <p className="text-slate-400 max-w-sm mx-auto">
            You have not completed any courses yet. Complete a course to earn your verified certificate here!
          </p>
        </motion.div>
      )}

      {selectedCert && (
        <CertificateModal 
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          certData={selectedCert}
        />
      )}
    </div>
  );
};

export default CertificatesCenter;
