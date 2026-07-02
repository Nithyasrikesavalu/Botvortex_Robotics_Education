import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Bot, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';

const CertificateModal = ({ isOpen, onClose, certData }) => {
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`BotVortex-Certificate-${certData.studentName.replace(/\\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Certificate Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-gradient-to-br from-[#eef2ff] via-white to-[#fae8ff] shadow-2xl overflow-hidden rounded-sm"
        >
          {/* Download button */}
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="absolute top-4 right-14 z-10 p-2 bg-purple-600/10 hover:bg-purple-600/20 rounded-full transition-colors text-purple-700 font-bold flex items-center gap-2 px-4 disabled:opacity-50"
          >
            <Download size={16} /> 
            <span className="text-sm">{isDownloading ? 'Generating...' : 'Download PDF'}</span>
          </button>

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors text-slate-600"
          >
            <X size={20} />
          </button>

          {/* Certificate Inner Border & Content */}
          <div ref={certificateRef} className="relative p-12 md:p-16 text-center border-[12px] border-white/50 bg-gradient-to-br from-[#eef2ff] via-white to-[#fae8ff]">
            
            {/* Decorative Corners */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-purple-400 opacity-70"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-purple-400 opacity-70"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-purple-400 opacity-70"></div>
            <div className="absolute bottom-8 right-8 flex items-end justify-end">
                <div className="absolute w-16 h-16 border-b-2 border-r-2 border-purple-400 opacity-70"></div>
                <Bot size={40} className="text-purple-300 opacity-40 translate-x-2 translate-y-2" />
            </div>

            {/* Header / Logo */}
            <div className="flex flex-col items-center justify-center mb-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-md">
                  <Bot size={24} />
                </div>
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 tracking-wider">
                  BOTVORTEX
                </h1>
              </div>
              <p className="text-[9px] md:text-[11px] font-bold text-slate-500 tracking-[0.2em] uppercase">
                Empowering the next generation of robotics innovators
              </p>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-5xl font-light text-slate-800 tracking-[0.2em] mb-12">
              CERTIFICATE OF<br />ACHIEVEMENT
            </h2>

            <p className="italic text-slate-600 mb-6 font-serif">
              This certificate is proudly presented to
            </p>

            {/* Student Name */}
            <h3 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
              {certData.studentName}
            </h3>

            <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6">
              In recognition of the successful completion of the robotics learning program titled
            </p>

            {/* Course Title */}
            <h4 className="text-2xl md:text-3xl font-bold italic text-purple-700 mb-12">
              {certData.title}
            </h4>

            {/* Footer Details */}
            <div className="space-y-2 text-sm text-slate-600 mb-12">
              <p>
                Presented with distinction by <span className="font-bold text-purple-600">BotVortex Academy</span>
              </p>
              <p>
                Issued on {certData.date}
              </p>
            </div>

            {/* Ribbon Badge */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_10px_30px_rgba(124,58,237,0.4)] flex items-center justify-center border-4 border-white">
                <Award size={36} className="text-white" />
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CertificateModal;
