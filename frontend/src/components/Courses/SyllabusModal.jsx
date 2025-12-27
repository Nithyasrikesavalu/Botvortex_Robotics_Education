import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { Download, ArrowLeft, Clock, BookOpen, Award, Cpu, Zap, Settings, Code } from "lucide-react";
import { Link } from "react-router-dom";

const Syllabus = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeWeek, setActiveWeek] = useState(null);

  // Core syllabus data
  const SYLLABUS_CONTENT = {
    courseTitle: "Introduction to Robotics - Complete Syllabus",
    duration: "4 Weeks | 24 Hours",
    level: "Beginner",

    overview:
      "A complete beginner-friendly introduction to robotics, covering essential concepts, hands-on practice, robot components, sensors, microcontrollers, and practical project building.",

    modules: [
      {
        week: 1,
        title: "Robotics Fundamentals & Basics",
        icon: <Settings className="w-6 h-6" />,
        color: "from-blue-500 to-blue-600",
        topics: [
          "Introduction to Robotics and Automation",
          "History and Evolution of Robots",
          "Types of Robots and Their Applications",
          "Basic Robot Components and Structure",
          "Safety Procedures in Robotics",
        ],
      },
      {
        week: 2,
        title: "Sensors, Motors & Electronics",
        icon: <Zap className="w-6 h-6" />,
        color: "from-blue-400 to-blue-500",
        topics: [
          "Introduction to Sensors and Actuators",
          "Motor Types and Working Principles",
          "Basic Electronic Circuits for Robotics",
          "Power Systems and Batteries",
          "Sensor Integration Basics",
        ],
      },
      {
        week: 3,
        title: "Robot Programming Fundamentals",
        icon: <Code className="w-6 h-6" />,
        color: "from-blue-600 to-blue-700",
        topics: [
          "Introduction to Robot Programming",
          "Basic Programming Concepts",
          "Control Structures and Logic",
          "Simple Algorithm Design",
          "Testing and Debugging",
        ],
      },
      {
        week: 4,
        title: "Build Your First Robot & Certification",
        icon: <Cpu className="w-6 h-6" />,
        color: "from-blue-700 to-blue-800",
        topics: [
          "Robot Assembly and Construction",
          "System Integration and Testing",
          "Troubleshooting Common Issues",
          "Final Project Completion",
          "Certification Preparation",
        ],
      },
    ],

    certificationDetails: {
      title: "Robotics Fundamentals Certification",
      requirements: [
        "Complete all 4 weekly modules",
        "Submit all practical assignments",
        "Pass the final assessment with 70% or higher",
        "Complete the capstone robot project",
      ],
      benefits: [
        "Industry-recognized certification",
        "Enhanced career opportunities",
        "Foundation for advanced robotics courses",
        "Practical hands-on experience",
      ],
      validity: "Lifetime",
      issuingAuthority: "Robotics Education Institute",
    },

    prerequisites: [
      "No prior robotics experience required",
      "Basic computer literacy",
      "Interest in technology and engineering",
      "High school level mathematics",
    ],
  };
   
  // PDF generation
  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      let y = 40;
      const lineHeight = 16;

      const addText = (text, bold = false, size = 12) => {
        doc.setFont("Helvetica", bold ? "bold" : "normal");
        doc.setFontSize(size);
        const wrapped = doc.splitTextToSize(String(text), 520);
        wrapped.forEach((line) => {
          if (y > 760) {
            doc.addPage();
            y = 40;
          }
          doc.text(line, 40, y);
          y += lineHeight;
        });
        y += 6;
      };

      addText(SYLLABUS_CONTENT.courseTitle, true, 18);
      addText(`Duration: ${SYLLABUS_CONTENT.duration}`);
      addText(`Level: ${SYLLABUS_CONTENT.level}`);
      addText("Course Overview:", true);
      addText(SYLLABUS_CONTENT.overview);

      addText("Course Curriculum:", true);
      SYLLABUS_CONTENT.modules.forEach((module) => {
        addText(`Week ${module.week}: ${module.title}`, true);
        addText("Topics Covered:", true);
        module.topics.forEach((t) => addText(`• ${t}`));
      });

      addText("Certification Details:", true);
      addText(`Certificate: ${SYLLABUS_CONTENT.certificationDetails.title}`);
      addText(`Issued by: ${SYLLABUS_CONTENT.certificationDetails.issuingAuthority}`);
      addText(`Validity: ${SYLLABUS_CONTENT.certificationDetails.validity}`);

      addText("Requirements:", true);
      SYLLABUS_CONTENT.certificationDetails.requirements.forEach((r) => addText(`• ${r}`));

      addText("Benefits:", true);
      SYLLABUS_CONTENT.certificationDetails.benefits.forEach((b) => addText(`• ${b}`));

      doc.save("Introduction_to_Robotics_Syllabus.pdf");
    } catch (err) {
      console.error("PDF Generation Error:", err);
    } finally {
      setIsDownloading(false);
    }
  };
    useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white to-blue-50 py-10 text-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-100 rounded-tr-full"></div>
          
          <div className="flex items-center justify-between mb-6 relative">
            <a 
              href="/C" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-all hover:gap-3 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-200"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Course
            </a>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl flex items-center gap-2 font-semibold shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 border border-blue-500"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" /> Download PDF
                </>
              )}
            </button>
          </div>

          <div className="text-center relative">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">Active Enrollment</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow-sm mb-4">
              {SYLLABUS_CONTENT.courseTitle}
            </h1>

            <p className="text-gray-600 max-w-3xl mx-auto mb-6 text-lg leading-relaxed">
              {SYLLABUS_CONTENT.overview}
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-xl border border-blue-200">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700 font-medium">{SYLLABUS_CONTENT.duration}</span>
              </div>
              <div className="flex items-center gap-3 bg-purple-50 px-4 py-3 rounded-xl border border-purple-200">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700 font-medium">Level: {SYLLABUS_CONTENT.level}</span>
              </div>
              <div className="flex items-center gap-3 bg-amber-50 px-4 py-3 rounded-xl border border-amber-200">
                <Award className="w-5 h-5 text-amber-600" />
                <span className="text-gray-700 font-medium">Certificate Included</span>
              </div>
            </div>
          </div>
        </div>

        {/* MODULE LIST with Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {SYLLABUS_CONTENT.modules.map((mod) => (
            <div
              key={mod.week}
              onMouseEnter={() => setActiveWeek(mod.week)}
              onMouseLeave={() => setActiveWeek(null)}
              className={`bg-gradient-to-br ${mod.color} rounded-2xl p-1 shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl cursor-pointer`}
            >
              <div className="bg-white rounded-xl p-6 h-full border border-blue-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${mod.color} shadow-md`}>
                    <div className="text-white">
                      {mod.icon}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-blue-600">WEEK {mod.week}</span>
                    <h2 className="text-xl font-bold text-gray-900">{mod.title}</h2>
                  </div>
                </div>
                
                <ul className="space-y-3">
                  {mod.topics.map((t, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-start gap-3 text-gray-600 text-sm transition-all hover:text-gray-900"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${mod.color} mt-2 flex-shrink-0`}></div>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>

                {/* Progress indicator */}
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Progress</span>
                    <span>{activeWeek === mod.week ? 'Ready to Start' : 'Not Started'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${mod.color} transition-all duration-500 ${
                        activeWeek === mod.week ? 'w-1/3' : 'w-0'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Two-column layout for Prerequisites and Certification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prerequisites */}
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Prerequisites
            </h3>
            <div className="space-y-3">
              {SYLLABUS_CONTENT.prerequisites.map((p, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-4 p-3 rounded-xl bg-blue-50 border border-blue-100 hover:border-blue-300 transition-all"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certification Details */}
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Award className="w-6 h-6 text-blue-600" />
              Certification
            </h3>
            
            <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">{SYLLABUS_CONTENT.certificationDetails.title}</h4>
              <p className="text-sm text-blue-700">Issued by: {SYLLABUS_CONTENT.certificationDetails.issuingAuthority}</p>
              <p className="text-sm text-blue-700">Validity: {SYLLABUS_CONTENT.certificationDetails.validity}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-gray-700 mb-2 text-sm">Requirements:</h5>
                <ul className="space-y-2">
                  {SYLLABUS_CONTENT.certificationDetails.requirements.map((r, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-gray-700 mb-2 text-sm">Benefits:</h5>
                <ul className="space-y-2">
                  {SYLLABUS_CONTENT.certificationDetails.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link to={'/enroll'} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all border border-blue-500">
            Enroll Now - Start Your Robotics Journey
          </Link>
          <p className="text-gray-600 mt-4 text-sm">
            Join 2,500+ students who have transformed their careers with robotics
          </p>
        </div>
      </div>
    </div>
  );
};

export default Syllabus;