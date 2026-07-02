import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, User, Play, ChevronRight, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../config/api';

const MyCoursesPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch(`${API_URL}/student/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [navigate]);

  const ProgressBar = ({ value = 0 }) => (
    <div className="w-full bg-[#1E2A40] rounded-full h-2.5 overflow-hidden border border-gray-800">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] transition-all duration-700 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  return (
    <section className="min-h-screen bg-[#F8FAFC] p-4 relative font-sans text-slate-800 overflow-x-hidden">
      {/* Background glowing effects for light theme */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400 opacity-10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-400 opacity-10 rounded-full blur-[150px] -z-10" />

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        
      </div>

      <div className="pt-24 pb-12 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            My Enrolled Courses
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Pick up right where you left off. Track your progress and master new skills.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-[#1E2A40] rounded-3xl border border-[#2F3E5B] p-12 text-center shadow-lg max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-[#2A3E5B] text-[#00E5FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen size={30} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No courses yet</h3>
            <p className="text-gray-300 mb-8 max-w-sm mx-auto text-sm font-medium">
              You haven't bought or registered for any courses yet. Browse our catalog and start learning today!
            </p>
            <Link
              to="/Courses"
              className="bg-[#00E5FF] hover:bg-[#00BFFF] text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md inline-flex items-center gap-2"
            >
              Browse Courses <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants} initial="hidden" animate="visible">
            {courses.map((course) => (
              <motion.div
                key={course.courseId}
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-[#1E2A40] rounded-2xl border border-[#2F3E5B] overflow-hidden shadow-sm hover:shadow-lg hover:border-[#00E5FF] transition-all duration-300 flex flex-col h-full group"
              >
                {/* Thumbnail */}
                <div className="h-32 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative shrink-0">
                  {course.image ? (
                    <img src={course.image} alt={course.title} className="w-14 h-14 rounded-2xl object-cover border border-blue-200" />
                  ) : course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-14 h-14 rounded-2xl object-cover border border-blue-200" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                      {course.thumbnailEmoji || "🎓"}
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-white text-slate-800 text-[9px] font-bold px-2 py-0.5 rounded-md border border-slate-200 uppercase tracking-wider shadow-sm">
                    {course.courseId}
                  </span>
                  {course.progress >= 100 && (
                    <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                      Completed
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-white text-base line-clamp-2 leading-tight" title={course.title}>
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                      <User size={13} className="text-gray-400" />
                      {course.instructor || "BotVortex Instructor"}
                    </p>

                    {/* Progress */}
                    <div className="pt-3">
                      <div className="flex justify-between items-center text-[11px] font-bold mb-1.5">
                        <span className="text-[#00E5FF]">{course.progress}% Completed</span>
                        <span className="text-gray-400">
                          {course.completedLessons || 0}/{course.totalLessons || 10} Lessons
                        </span>
                      </div>
                      <ProgressBar value={course.progress} />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700 flex">
                    <Link
                      to="/CoursesModule"
                      state={{ course }}
                      className="flex-1 text-center bg-[#00E5FF] hover:bg-[#00BFFF] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shadow-[#00E5FF]/20"
                    >
                      {course.progress > 0 ? "Continue Learning" : "Start Learning"}
                    </Link>
                  </div>
                </div>
                </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MyCoursesPage;
