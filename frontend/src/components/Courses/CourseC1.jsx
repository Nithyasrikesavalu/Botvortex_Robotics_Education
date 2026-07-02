import React, { useEffect, useState } from "react";
import { Play, Download, Star, Clock, Users, BookOpen, CheckCircle, ChevronDown, ChevronUp, Award, Target, BarChart3 } from "lucide-react";
import { Link, Links } from "react-router-dom";

const CourseC1 = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [openModule, setOpenModule] = useState(null);
   

   // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);
  const TABS = ["overview", "curriculum", "instructor", "reviews"];

  const MODULES = [
    {
      id: 1,
      title: "Module 1: Introduction to Robotics",
      duration: "6 hours",
      content: "What is robotics, applications, types of robots, industries & future scope. Learn about the history and evolution of robotics technology.",
      lessons: ["Robotics Fundamentals", "Types of Robots", "Industry Applications", "Future Trends"],
      projects: "Build a basic robot chassis"
    },
    {
      id: 2,
      title: "Module 2: Sensors, Motors & Components",
      duration: "8 hours",
      content: "Learn about microcontrollers, actuators, motors, ultrasonic sensors, IR modules, and power systems. Hands-on component identification.",
      lessons: ["Sensor Technology", "Motor Types", "Power Systems", "Component Integration"],
      projects: "Sensor integration project"
    },
    {
      id: 3,
      title: "Module 3: Programming Robots",
      duration: "10 hours",
      content: "Fundamentals of robot coding, algorithm control, decision making, and real-time logic. Build your first robot program.",
      lessons: ["Programming Basics", "Control Algorithms", "Decision Logic", "Real-time Systems"],
      projects: "Autonomous navigation program"
    },
    {
      id: 4,
      title: "Module 4: Build Your First Robot",
      duration: "12 hours",
      content: "Complete guide to assemble, test and operate a fully working robot. Final project and certification.",
      lessons: ["Assembly Guide", "Testing Procedures", "Operation Training", "Project Completion"],
      projects: "Complete robot assembly"
    },
  ];



  const handleModuleToggle = (id) => {
    setOpenModule(openModule === id ? null : id);
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      {/* HERO SECTION - With Background Image */}
      <div 
        className="relative pt-32 pb-20 px-6 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
        }}
      >
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Left Content */}
            <div className="flex-1 text-white">
              <div className="inline-flex items-center gap-2 bg-blue-600/90 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-blue-400">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">Professional Certification</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Advanced Robotics Engineering
              </h1>
              
              <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
                Master industrial robotics, automation systems, and AI integration. Designed for engineers and technical professionals.
              </p>

              {/* Key Metrics */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-400">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">36h</div>
                    <div className="text-gray-300 text-sm">Course Duration</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-400">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">24</div>
                    <div className="text-gray-300 text-sm">Modules</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-400">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">4</div>
                    <div className="text-gray-300 text-sm">Projects</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={'/enroll'} className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg border border-blue-500">
                  Enroll Now 
                </Link>
                <Link to={"/syllabus"} className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all">
                  Download Syllabus
                </Link>
              </div>
            </div>

            {/* Right Side - Stats Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-2xl w-full lg:w-80 text-white">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="text-3xl font-bold">4.8</div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="text-gray-300 text-sm">Based on 1,247 reviews</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Skill Level</span>
                  <span className="font-semibold">Intermediate</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Language</span>
                  <span className="font-semibold">English</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Certificate</span>
                  <span className="font-semibold text-green-300">Included</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Lifetime Access</span>
                  <span className="font-semibold text-green-300">Yes</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">2,847 students enrolled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white/80">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm">Live classes starting soon</span>
        </div>
      </div>

      {/* TABS - White with Dark Blue */}
      <div className="max-w-6xl mx-auto mt-12 px-4">
        <div className="flex overflow-x-auto scrollbar-hide bg-white rounded-lg shadow-sm p-1 gap-1 border border-gray-300">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] px-6 py-4 rounded-md font-semibold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* OVERVIEW - White with Dark Blue */}
        {activeTab === "overview" && (
          <div className="bg-white p-8 rounded-xl shadow-sm mt-6 border border-gray-300">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Course Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  This comprehensive robotics engineering course provides in-depth knowledge of industrial automation, 
                  robotic systems design, and AI integration. Through hands-on projects and real-world case studies, 
                  you'll gain the skills needed to design, implement, and maintain advanced robotic systems.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Learning Objectives</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        Design robotic systems for industrial applications
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        Program and integrate AI algorithms
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        Troubleshoot and maintain robotic systems
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Career Outcomes</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        Robotics Engineer
                      </li>
                      <li className="flex items-start gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        Automation Specialist
                      </li>
                      <li className="flex items-start gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        Systems Integrator
                      </li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-bold mt-8 mb-4 text-gray-900">Prerequisites</h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Basic understanding of programming concepts
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Familiarity with electronics fundamentals
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      College-level mathematics recommended
                    </li>
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Tools You'll Use</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-blue-200">
                      <span className="text-gray-700 font-medium">ROS</span>
                      <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">Robotic OS</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-blue-200">
                      <span className="text-gray-700 font-medium">Python</span>
                      <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">Programming</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-700 font-medium">SolidWorks</span>
                      <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">CAD Design</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-300 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Industry Recognition</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                        <Award className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">ISO Certified</div>
                        <div className="text-sm text-gray-500">Quality Standard</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Industry Partners</div>
                        <div className="text-sm text-gray-500">10+ Companies</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CURRICULUM - White with Dark Blue */}
        {activeTab === "curriculum" && (
          <div className="bg-white p-8 rounded-xl shadow-sm mt-6 border border-gray-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
              <div className="text-sm text-gray-500">
                Total Duration: <span className="font-semibold text-blue-600">36 hours</span>
              </div>
            </div>

            <div className="space-y-4">
              {MODULES.map((module) => (
                <div
                  key={module.id}
                  className="border border-gray-300 rounded-lg overflow-hidden hover:border-blue-300 transition-all bg-white"
                >
                  <button
                    className="w-full flex justify-between items-center p-6 bg-white font-semibold hover:bg-blue-50 transition-all"
                    onClick={() => handleModuleToggle(module.id)}
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                          <span className="text-sm font-bold text-blue-600">{module.id}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{module.title}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {module.duration}
                        </span>
                        <span>{module.lessons.length} lessons</span>
                        <span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">{module.projects}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-blue-600 font-semibold">
                        {openModule === module.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </span>
                    </div>
                  </button>

                  {openModule === module.id && (
                    <div className="p-6 bg-blue-50 border-t border-blue-200">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                          <p className="text-gray-700 leading-relaxed">{module.content}</p>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-gray-900">Lessons</h4>
                            <span className="text-sm text-blue-600 font-medium">Practical Project</span>
                          </div>
                          <ul className="space-y-3">
                            {module.lessons.map((lesson, index) => (
                              <li key={index} className="flex items-center justify-between text-gray-700 p-2 rounded hover:bg-white transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 bg-white border border-blue-200 rounded flex items-center justify-center">
                                    <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                                  </div>
                                  {lesson}
                                </div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INSTRUCTOR - White with Dark Blue */}
        {activeTab === "instructor" && (
          <div className="bg-white p-8 rounded-xl shadow-sm mt-6 border border-gray-300">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Course Instructor</h2>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                  alt="Alexbenson"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                />
                <div className="mt-4 text-center">
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">4.9/5 Instructor Rating</div>
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Alexbenson</h3>
                  <p className="text-blue-600 font-medium">Senior Robotics Engineer & Research Lead</p>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  Dr. Chen leads robotics research at TechInnovate Labs with 12+ years of experience in industrial 
                  automation and AI-driven robotics. Her work has been implemented in manufacturing facilities 
                  worldwide, improving efficiency by 40% on average. She holds patents in robotic vision systems 
                  and has published numerous papers in leading robotics journals.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xl font-bold text-blue-600">12+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xl font-bold text-blue-600">47</div>
                    <div className="text-sm text-gray-600">Publications</div>
                  </div>
                  <div className="text-center bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xl font-bold text-blue-600">8</div>
                    <div className="text-sm text-gray-600">Patents</div>
                  </div>
                  <div className="text-center bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xl font-bold text-blue-600">5.2k</div>
                    <div className="text-sm text-gray-600">Students</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                    PhD Robotics - MIT
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                    Industrial Automation
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                    AI Integration
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                    Research Lead
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS - White with Dark Blue */}
        {activeTab === "reviews" && (
          <div className="bg-white p-8 rounded-xl shadow-sm mt-6 border border-gray-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Reviews</h2>
                <p className="text-gray-600">What professionals are saying about this course</p>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="text-center bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">4.8</div>
                  <div className="flex justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-gray-600 text-sm">1,247 reviews</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { 
                  name: "Michael Rodriguez", 
                  role: "Automation Engineer",
                  company: "AutoTech Solutions",
                  review: "The industrial automation modules provided practical insights we implemented directly in our production line. Excellent balance of theory and practice.",
                  rating: 5,
                  date: "2 months ago"
                },
                { 
                  name: "Jennifer Park", 
                  role: "Systems Integrator",
                  company: "Global Robotics",
                  review: "Comprehensive coverage of ROS and system integration. The projects were challenging but incredibly valuable for real-world applications.",
                  rating: 5,
                  date: "1 month ago"
                },
                { 
                  name: "David Thompson", 
                  role: "Technical Lead",
                  company: "Manufacturing Corp",
                  review: "AI integration section was particularly strong. Helped our team implement machine learning in our quality control systems.",
                  rating: 4,
                  date: "3 weeks ago"
                },
                { 
                  name: "Emily Watson", 
                  role: "R&D Engineer",
                  company: "Innovation Labs",
                  review: "The course materials and instructor support were exceptional. Complex concepts were broken down perfectly for implementation.",
                  rating: 5,
                  date: "2 weeks ago"
                },
              ].map((review, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-lg border border-gray-300 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <p className="text-sm text-gray-600">{review.role} • {review.company}</p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < review.rating ? "text-amber-400" : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed">{review.review}</p>
                  <div className="text-blue-600 text-sm font-medium">{review.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="text-center py-12 text-gray-600 mt-16 bg-white border-t border-gray-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="text-left mb-6 md:mb-0">
              <p className="text-xl font-semibold text-gray-900">Robotics Engineering Institute</p>
              <p className="text-gray-500 mt-2">Advancing industrial automation through education</p>
            </div>
            <div className="flex gap-6">
              <span className="text-blue-600 hover:text-blue-700 cursor-pointer">Privacy Policy</span>
              <span className="text-blue-600 hover:text-blue-700 cursor-pointer">Terms of Service</span>
              <span className="text-blue-600 hover:text-blue-700 cursor-pointer">Contact</span>
            </div>
          </div>
          <p className="text-gray-500 border-t border-gray-300 pt-6">© 2024 Robotics Engineering Institute. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default CourseC1;

