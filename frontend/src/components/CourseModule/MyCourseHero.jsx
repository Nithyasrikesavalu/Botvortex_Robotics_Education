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

const MyCourseHero = ({ course }) => {
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

  // Sample fallback data
  const sampleCourses = {
    "robotics-101": {
      title: "Advanced Robotics Engineering",
      description: "Master the fundamentals of robotics design, programming, and implementation. Build real-world projects and become a robotics expert.",
      duration: "12 weeks",
      modules: 24,
      rating: 4.9,
      reviews: 1247,
      level: "Intermediate",
      language: "English",
      instructor: "Alexbenson",
      students: 15420,
      thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  };

  useEffect(() => {
    // If course prop is passed, map its data
    if (course) {
      setCourseData({
        title: course.title || "Untitled Course",
        description: course.description || "Course description not available.",
        duration: course.duration || "Self-paced",
        modules: course.totalLessons || course.modules?.length || 10,
        rating: course.rating || 4.8,
        reviews: 500,
        level: course.level || "Beginner",
        language: "English",
        instructor: course.instructor || "Alexbenson",
        students: course.students || 1200,
        thumbnail: course.image || course.thumbnailUrl || sampleCourses["robotics-101"].thumbnail
      });
    } else {
      // Fallback
      setCourseData(sampleCourses["robotics-101"]);
    }
    
    setProgress(course?.progress || 0);
  }, [course, courseId]);

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
    <div className="bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative bg-[#F8FAFC] border-b border-slate-200 overflow-hidden pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
            {/* Left Content */}
            <div className="flex-1 mt-4 max-w-2xl">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight text-slate-900">
                {courseData.title}
              </h1>
              
              <p className="text-base text-slate-600 mb-8 leading-relaxed font-medium">
                {courseData.description}
              </p>

              {/* Course Details (Separated Pills) */}
              <div className="flex flex-wrap items-center gap-3 mb-10 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span>{courseData.rating} <span className="text-slate-500 font-medium">({courseData.reviews} ratings)</span></span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm">
                  <Users size={14} className="text-blue-500" />
                  <span>{courseData.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm">
                  <Signal size={14} className="text-purple-500" />
                  <span>{courseData.level}</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm">
                  <Languages size={14} className="text-emerald-500" />
                  <span>{courseData.language}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {courseData.instructor.charAt(0)}
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Created by</div>
                  <div className="font-bold text-slate-900 text-sm">{courseData.instructor}</div>
                </div>
              </div>
            </div>

            {/* Right Content - Course Card Float */}
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="bg-white text-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="h-48 bg-slate-100 relative">
                  <img src={courseData.thumbnail} alt={courseData.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                      <PlayCircle size={32} className="text-blue-600 ml-1" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">



                  <div className="space-y-3 mt-6">
                    <h4 className="font-bold text-slate-900">This course includes:</h4>
                    <ul className="space-y-3 text-sm text-slate-600 font-medium">
                      <li className="flex items-center gap-3">
                        <Clock size={16} className="text-slate-400" />
                        {courseData.duration} of on-demand video
                      </li>
                      <li className="flex items-center gap-3">
                        <BookOpen size={16} className="text-slate-400" />
                        {courseData.modules} interactive modules
                      </li>
                      <li className="flex items-center gap-3">
                        <Award size={16} className="text-slate-400" />
                        Certificate of completion
                      </li>
                      <li className="flex items-center gap-3">
                        <InfinityIcon size={16} className="text-slate-400" />
                        Full lifetime access
                      </li>
                    </ul>
                  </div>
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