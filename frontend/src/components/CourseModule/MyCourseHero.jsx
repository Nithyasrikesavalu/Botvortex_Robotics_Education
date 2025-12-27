import React, { useState, useEffect } from "react";
import {
  Signal,
  Languages,
  Award,
  InfinityIcon,
  ArrowRight,
  Clock,
  BookOpen,
  Star,
  Users,
  Download,
  PlayCircle
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const MyCourseHero = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [courseData, setCourseData] = useState(null);
    useEffect(() => {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    }, []);

  // Sample course data - in real app, this would come from API
  const sampleCourses = {
    "robotics-101": {
      id: "robotics-101",
      title: "Advanced Robotics Engineering",
      description: "Master the fundamentals of robotics design, programming, and implementation. Build real-world projects and become a robotics expert.",
      duration: "12 weeks",
      modules: 24,
      projects: 8,
      rating: 4.9,
      reviews: 1247,
      level: "Intermediate",
      language: "English",
      category: "Engineering",
      instructor: "Dr. Sarah Chen",
      students: 15420,
      lastAccessed: "2 days ago",
      nextLesson: "Robot Kinematics & Dynamics",
      thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      
      
    },
    "ai-ml": {
      id: "ai-ml",
      title: "Machine Learning & AI Fundamentals",
      description: "Learn machine learning algorithms, neural networks, and AI concepts with hands-on projects and real-world applications.",
      duration: "10 weeks",
      modules: 18,
      projects: 6,
      rating: 4.8,
      reviews: 892,
      level: "Beginner",
      language: "English",
      category: "Data Science",
      instructor: "Prof. Michael Rodriguez",
      students: 23415,
      lastAccessed: "1 day ago",
      nextLesson: "Neural Networks Basics",
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  };

  // Theme configuration
  const themeConfig = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-700",
    accent: "bg-gradient-to-r from-green-500 to-blue-600",
    success: "bg-gradient-to-r from-green-400 to-green-600"
  };

  useEffect(() => {
    // Simulate API call
    const course = sampleCourses[courseId] || sampleCourses["robotics-101"];
    setCourseData(course);
    
    // Simulate progress calculation
    const calculatedProgress = Math.min(100, Math.floor((6 / course.modules) * 100));
    setProgress(calculatedProgress);
  }, [courseId]);

  const handleContinueLearning = () => {
    navigate(`/learn/${courseId}/module-6`);
  };

  const handleDownloadSyllabus = () => {
    // Simulate syllabus download
    alert("Syllabus download started!");
  };

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-96 rounded-b-3xl"></div>
        </div>
      </div>
    );
  }
 
  return (
    <div className=" bg-gray-50">
      {/* Hero Section */}
      <section className={`${themeConfig.primary} text-white shadow-2xl mt-19 m-4`}>
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Content */}
            <div className="flex-1">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm opacity-80 mb-4">
                <span>My Courses</span>
                <span>•</span>
                <span>{courseData.category}</span>
                <span>•</span>
                <span className="text-yellow-300">{courseData.title}</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {courseData.title}
              </h1>
              
              <p className="text-xl opacity-90 mb-8 leading-relaxed">
                {courseData.description}
              </p>

              {/* Course Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300">
                  <Clock className="w-6 h-6 mx-auto mb-2 opacity-80" />
                  <div className="text-2xl font-bold">{courseData.duration}</div>
                  <div className="text-sm opacity-80">Duration</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300">
                  <BookOpen className="w-6 h-6 mx-auto mb-2 opacity-80" />
                  <div className="text-2xl font-bold">{courseData.modules}</div>
                  <div className="text-sm opacity-80">Modules</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300">
                  <Award className="w-6 h-6 mx-auto mb-2 opacity-80" />
                  <div className="text-2xl font-bold">{courseData.projects}</div>
                  <div className="text-sm opacity-80">Projects</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300">
                  <Star className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
                  <div className="text-2xl font-bold">{courseData.rating}</div>
                  <div className="text-sm opacity-80">{courseData.reviews} reviews</div>
                </div>
              </div>

              {/* Course Details */}
              <div className="flex flex-wrap gap-6 mb-8 text-sm">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <Signal size={16} />
                  <span>Level: {courseData.level}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <Languages size={16} />
                  <span>Language: {courseData.language}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <Award size={16} />
                  <span>Certificate Included</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <InfinityIcon size={16} />
                  <span>Lifetime Access</span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 hover:bg-white/15 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Your Progress</span>
                  <span className="text-lg font-bold text-green-300">{progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 mb-3">
                  <div 
                    className={`${themeConfig.success} h-3 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm opacity-80">
                  <span>Completed: 6 of {courseData.modules} modules</span>
                  <span>Last accessed: {courseData.lastAccessed}</span>
                </div>
                
                {/* Next Lesson Info */}
                <div className="mt-4 p-3 bg-white/5 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-center gap-2 text-sm">
                    <PlayCircle size={16} className="text-yellow-400" />
                    <span className="font-medium">Next: {courseData.nextLesson}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleContinueLearning}
                  className={`${themeConfig.accent} text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-3 justify-center group`}
                >
                  <PlayCircle size={24} className="group-hover:scale-110 transition-transform" />
                  Continue Learning
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={handleDownloadSyllabus}
                  className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 hover:bg-white/30 transition-all duration-300 flex items-center gap-3 justify-center group"
                >
                  <Download size={20} className="group-hover:scale-110 transition-transform" />
                  Download Syllabus
                </button>
              </div>

              {/* Instructor & Students Info */}
              <div className="flex items-center gap-6 mt-8 text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="Instructor"
                    className="w-8 h-8 rounded-full border-2 border-white/30"
                  />
                  <span>By {courseData.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{courseData.students.toLocaleString()} students</span>
                </div>
              </div>
            </div>

            {/* Right Content - Course Thumbnail */}
            <div className="flex-1">
              <div className="relative group">
                <img 
                  src={courseData.thumbnail}
                  alt={courseData.title}
                  className="rounded-2xl shadow-2xl w-full transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center gap-2">
                    <PlayCircle size={20} />
                    Watch Trailer
                  </button>
                </div>
                
                {/* Progress Badge */}
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {progress}% Complete
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-lg font-bold">{courseData.modules}</div>
                  <div className="text-xs opacity-80">Modules</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-lg font-bold">{Math.floor(courseData.modules * 45)}m</div>
                  <div className="text-xs opacity-80">Total Time</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-lg font-bold">8</div>
                  <div className="text-xs opacity-80">Quizzes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyCourseHero;