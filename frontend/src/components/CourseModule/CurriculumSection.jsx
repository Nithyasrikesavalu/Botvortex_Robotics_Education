import React, { useEffect, useState } from "react";
import {
  PlayCircle,
  Play,
  Clock,
  HelpCircle,
  Workflow,
  Upload,
  ClipboardList,
  CheckCircle,
  Lock,
  AlertCircle
} from "lucide-react";

const CourseCurriculum = () => {
  const [modules, setModules] = useState([
    {
      id: 1,
      title: "Module 1: Introduction to Robotics",
      status: "completed",
      videos: [
        { title: "History of Robotics", duration: "15:20", active: true },
        { title: "Basic Robotics Concepts", duration: "22:45", active: false },
        { title: "Types of Industrial Robots", duration: "18:30", active: false },
        { title: "Robotics Applications", duration: "25:10", active: false }
      ],
      quiz: { completed: true, score: "18/20" },
      project: null
    },
    {
      id: 2,
      title: "Module 2: Robotics Mathematics",
      status: "completed",
      videos: [
        { title: "Coordinate Systems", duration: "20:15", active: true },
        { title: "Transformation Matrices", duration: "28:40", active: false },
        { title: "Kinematics Fundamentals", duration: "32:20", active: false },
        { title: "Dynamics Principles", duration: "26:50", active: false }
      ],
      quiz: { completed: true, score: "19/20" },
      project: null
    },
    {
      id: 3,
      title: "Module 3: Robot Programming",
      status: "in-progress",
      videos: [
        { title: "Programming Basics", duration: "18:30", active: true },
        { title: "Motion Programming", duration: "25:45", active: false },
        { title: "Sensor Integration", duration: "22:10", active: false },
        { title: "Advanced Programming", duration: "30:20", active: false }
      ],
      quiz: { completed: false, score: null },
      project: null
    },
    {
      id: 4,
      title: "Module 4: Robot Design & Simulation",
      status: "upcoming",
      videos: [
        { title: "CAD for Robotics", duration: "24:15", active: true },
        { title: "Simulation Tools", duration: "28:30", active: false },
        { title: "Design Principles", duration: "26:40", active: false },
        { title: "Prototyping", duration: "32:20", active: false }
      ],
      quiz: { completed: false, score: null },
      project: { title: "Design a robotic arm for industrial application" }
    },
    {
      id: 5,
      title: "Module 5: Advanced Robotics Systems",
      status: "upcoming",
      videos: [
        { title: "AI in Robotics", duration: "29:15", active: true },
        { title: "Machine Learning Applications", duration: "31:40", active: false },
        { title: "Autonomous Systems", duration: "27:20", active: false },
        { title: "Future Trends", duration: "24:50", active: false }
      ],
      quiz: { completed: false, score: null },
      project: { title: "Build an autonomous navigation system" }
    },
    {
      id: 6,
      title: "Module 6: Real-world Applications",
      status: "upcoming",
      videos: [
        { title: "Industrial Automation", duration: "26:15", active: true },
        { title: "Healthcare Robotics", duration: "23:40", active: false },
        { title: "Agricultural Robotics", duration: "28:20", active: false },
        { title: "Space Robotics", duration: "30:50", active: false }
      ],
      quiz: { completed: false, score: null },
      project: { title: "Case study analysis and implementation" }
    }
  ]);

  const themeConfig = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-700",
    accent: "bg-gradient-to-r from-green-500 to-blue-600",
    success: "bg-gradient-to-r from-green-400 to-green-600",
    card: "bg-white dark:bg-gray-800",
    border: "border border-gray-200 dark:border-gray-700",
    text: "text-gray-800 dark:text-white",
    hover: "hover:bg-gray-50 dark:hover:bg-gray-700"
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1";
      case 'in-progress':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1";
      case 'upcoming':
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1";
      default:
        return "bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium";
    }
  };

  const handleVideoClick = (moduleId, videoIndex) => {
    setModules(prevModules => 
      prevModules.map(module => 
        module.id === moduleId 
          ? {
              ...module,
              videos: module.videos.map((video, index) => ({
                ...video,
                active: index === videoIndex
              }))
            }
          : module
      )
    );
  };

  const handleQuizStart = (moduleId) => {
    console.log(`Starting quiz for module ${moduleId}`);
    // Add quiz start logic here
  };

  const handleProjectSubmit = (moduleId) => {
    console.log(`Submitting project for module ${moduleId}`);
    // Add project submission logic here
  };

  const ModuleCard = ({ module }) => {
    const StatusIcon = module.status === 'completed' ? CheckCircle : 
                      module.status === 'in-progress' ? AlertCircle : Lock;

    useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);
    return (
      <div 
        id={`module-${module.id}`}
        className={`${themeConfig.card} rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 ${themeConfig.border} scroll-mt-24`}
      >
        {/* Module Header */}
        <div className={`${themeConfig.primary} text-white p-6 flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="font-semibold text-sm">{module.id}</span>
            </div>
            <h3 className="text-lg font-semibold">{module.title}</h3>
          </div>
          <span className={getStatusBadge(module.status)}>
            <StatusIcon size={14} />
            {module.status === 'completed' && 'Completed'}
            {module.status === 'in-progress' && 'In Progress'}
            {module.status === 'upcoming' && 'Upcoming'}
          </span>
        </div>

        {/* Module Content */}
        <div className="p-6">
          {/* Video Player Placeholder */}
          <div className="bg-black rounded-2xl overflow-hidden mb-6">
            <div className="h-48 flex items-center justify-center bg-gray-900 relative group cursor-pointer">
              <PlayCircle size={48} className="text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                Featured Video
              </div>
            </div>
            <div className={`bg-gray-100 dark:bg-gray-700 p-4 ${themeConfig.text}`}>
              <h4 className="font-semibold">
                {module.videos.find(v => v.active)?.title || module.videos[0]?.title}
              </h4>
            </div>
          </div>

          {/* Videos List */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Play size={16} />
              Videos ({module.videos.length})
            </h4>
            <ul className="space-y-2">
              {module.videos.map((video, index) => (
                <li 
                  key={index}
                  onClick={() => handleVideoClick(module.id, index)}
                  className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    video.active 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 transform scale-105' 
                      : `${themeConfig.hover} ${themeConfig.border}`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {video.active ? (
                      <Play size={16} className="text-blue-500" />
                    ) : (
                      <Clock size={16} className="text-gray-400" />
                    )}
                    <span className={video.active ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}>
                      {video.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{video.duration}</span>
                    {video.active && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quiz Section */}
          {module.quiz && (
            <div className={`${themeConfig.card} rounded-2xl p-4 mb-4 ${themeConfig.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle size={18} className="text-purple-500" />
                <span className="font-semibold">Quiz Test</span>
              </div>
              {module.quiz.completed ? (
                <div className="space-y-3">
                  <p className="text-green-600 dark:text-green-400 font-semibold">
                    Completed ✓ | Score: {module.quiz.score}
                  </p>
                  <button 
                    onClick={() => handleQuizStart(module.id)}
                    className={`${themeConfig.primary} text-white px-4 py-2 rounded-xl text-sm hover:scale-105 transition-transform flex items-center gap-2`}
                  >
                    <HelpCircle size={16} />
                    Review Quiz
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-400">Not Started</p>
                  <button 
                    onClick={() => handleQuizStart(module.id)}
                    disabled={module.status === 'upcoming'}
                    className={`${module.status !== 'upcoming' ? themeConfig.primary : 'bg-gray-400'} text-white px-4 py-2 rounded-xl text-sm hover:scale-105 transition-transform flex items-center gap-2 disabled:cursor-not-allowed`}
                  >
                    <HelpCircle size={16} />
                    Start Quiz
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Project Section */}
          {module.project && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-3">
                <Workflow size={18} className="text-green-500" />
                <span className="font-semibold">Project Submission</span>
              </div>
              <p className="mb-3 text-gray-700 dark:text-gray-300">{module.project.title}</p>
              <button 
                onClick={() => handleProjectSubmit(module.id)}
                disabled={module.status === 'upcoming'}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200 hover:scale-105"
              >
                <Upload size={16} />
                Submit Project
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-gray-800 dark:text-white">
          Course Curriculum
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Master robotics engineering through our comprehensive curriculum with hands-on projects and assessments
        </p>

        {/* Modules Grid - One by One in Y-axis */}
        <div className="space-y-8 max-w-6xl mx-auto">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>

        {/* Overall Assessment */}
        <div className={`${themeConfig.card} rounded-2xl p-8 mt-12 text-center border-2 border-dashed border-blue-200 dark:border-blue-800 max-w-4xl mx-auto`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <ClipboardList size={28} className="text-blue-500" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              Final Assessment: Comprehensive Test
            </h3>
          </div>
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
            Complete evaluation covering all modules with 50 questions and practical tasks
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            <strong>Status:</strong> Locked (Available after completing all modules)
          </p>
          <button 
            disabled 
            className="bg-gray-400 text-white px-8 py-4 rounded-2xl font-semibold cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            <Lock size={20} />
            Take Final Assessment
          </button>
        </div>
      </div>
    </section>
  );
};

export default CourseCurriculum;
