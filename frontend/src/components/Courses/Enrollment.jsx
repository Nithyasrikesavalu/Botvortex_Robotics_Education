import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCoins, FaStar, FaCheck, FaClock, FaBook, FaVideo, FaFilePdf, FaQuestionCircle, FaRocket, FaGem, FaShieldAlt, FaMagic } from "react-icons/fa";

// Fallback course data
const fallbackCourses = [
  {
    id: 1,
    title: "Introduction to Robotics",
    description: "Learn the fundamentals of robotics including mechanics, electronics, and basic programming.",
    level: "Beginner",
    duration: "4 Weeks",
    coins: 500,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9",
    instructor: "Dr. Sarah Chen",
    videoNotes: 20,
    pdfNotes: 15,
    quizzes: 5,
    learnings: [
      "Robot components and architecture",
      "Basic electronics for robotics",
      "Simple robot programming",
      "Sensor integration basics"
    ],
    components: ["Video Lessons", "PDF Notes", "Quizzes", "Projects"]
  }
];

const DEFAULT_THUMBNAIL = "https://images.unsplash.com/photo-1581094271901-8022df4466f9";

const Enrollment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  const [courses] = useState(() => {
    // Standardizing on fallbackCourses for now since data/Course is missing or inconsistently placed
    return fallbackCourses;
  });

  const passedCourse = location.state?.course;
  const initialCourse = passedCourse || courses[0] || fallbackCourses[0];

  const [course] = useState(initialCourse);
  const [userCoins, setUserCoins] = useState(1250);
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState({ name: "", email: "", mobile: "" });
  const [errors, setErrors] = useState({});
  const [paid, setPaid] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Fetch user profile to get real coin balance
  useEffect(() => {
    const fetchCoins = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5000/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.coins !== undefined) {
            setUserCoins(data.coins);
          }
        }
      } catch (err) {
        console.error("Error fetching coins:", err);
      }
    };
    fetchCoins();
  }, []);

  // Pre-fill user info if logged in
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUserInfo(prev => ({
          ...prev,
          name: storedUser.fullName || prev.name,
          email: storedUser.email || prev.email
        }));
      }
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }
  }, []);

  const validateStep2 = () => {
    const e = {};
    if (!userInfo.name.trim()) e.name = "Name required";
    if (!userInfo.email.trim() || !/\S+@\S+\.\S+/.test(userInfo.email)) e.email = "Valid email required";
    if (!/^\d{10}$/.test(userInfo.mobile)) e.mobile = "Valid 10-digit mobile required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to enroll in this course.");
      navigate("/login");
      return;
    }

    if (userCoins < (course.coins || 0)) {
      alert("Not enough coins. Please recharge.");
      return;
    }

    setPaid(true);

    try {
      // POST to backend to create real enrollment
      const response = await fetch("http://localhost:5000/api/student/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: course.courseId || `C-${course.id || Date.now()}`,
          title: course.title,
          instructor: course.instructor || "Expert Instructor",
          thumbnailEmoji: course.thumbnailEmoji || "🤖",
          totalLessons: course.videoNotes || course.lectures || 10,
          totalTests: course.quizzes || 0,
          progress: 0
        })
      });

      if (response.ok) {
        setUserCoins(prev => prev - (course.coins || 0));
        setTimeout(() => {
          setStep(4);
          setPaid(false);
        }, 1500);
      } else {
        const data = await response.json();
        alert(data.message || "Enrollment failed. Maybe you are already enrolled?");
        setPaid(false);
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("An error occurred during enrollment. Please check if backend is running.");
      setPaid(false);
    }
  };

  const getDateStr = () => new Date().toLocaleString();
  const remainingCoins = userCoins - (course.coins || 0);

  // Floating animation elements
  const FloatingOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20"
          style={{
            width: Math.random() * 60 + 20,
            height: Math.random() * 60 + 20,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingOrbs />

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        {/* Main card with glass morphism effect */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header with gradient accent */}
          <div className="relative bg-gradient-to-r from-cyan-600 via-purple-600 to-cyan-600 p-1">
            <div className="bg-slate-900/90 backdrop-blur-sm p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <FaRocket className="text-cyan-300 text-2xl" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                      Course Enrollment
                    </h1>
                    <p className="text-white/70 mt-1">Begin your learning journey today</p>
                  </div>
                </div>

                {/* Coin Balance with gem design */}
                <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white/10 w-full lg:w-auto">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <FaGem className="text-cyan-300 text-2xl animate-pulse" />
                      <div className="absolute -inset-1 bg-cyan-400/20 rounded-full blur-sm"></div>
                    </div>
                    <div>
                      <div className="text-xs text-white/60">Your Balance</div>
                      <div className="font-bold text-xl text-cyan-300">{userCoins}</div>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/20"></div>
                  <div>
                    <div className="text-xs text-white/60">Course Cost</div>
                    <div className="font-bold text-lg flex items-center gap-2 text-purple-300">
                      <FaCoins className="text-amber-400" />
                      {course.coins || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 p-6 lg:p-8">
            {/* Left Sidebar - Enhanced Course Card */}
            <div className="lg:col-span-1 space-y-6">
              {/* Main Course Card */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000"></div>
                <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
                  <div className="relative overflow-hidden">
                    <img
                      src={course.image || course.thumbnail || DEFAULT_THUMBNAIL}
                      alt={course.title}
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-700"
                      onError={(e) => {
                        e.target.src = DEFAULT_THUMBNAIL;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-cyan-500/20 backdrop-blur-sm rounded-full text-cyan-300 text-sm border border-cyan-500/30">
                        {course.level || "Beginner"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg text-white mb-2">{course.title}</h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{course.description}</p>

                    {/* Course Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <div className="p-2 bg-white/5 rounded-lg">
                          <FaClock className="text-cyan-400" />
                        </div>
                        <span>{course.duration || "4 Weeks"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <div className="p-2 bg-white/5 rounded-lg">
                          <FaStar className="text-amber-400" />
                        </div>
                        <span>{course.rating || 4.8}</span>
                      </div>
                    </div>

                    {/* Price Highlight */}
                    <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-xl p-4 text-center border border-amber-500/30">
                      <div className="text-xs text-amber-200/80">Total Investment</div>
                      <div className="flex items-center justify-center gap-2 font-bold text-xl text-amber-300">
                        <FaCoins className="text-amber-400 animate-bounce" />
                        {course.coins || 0} Coins
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Features */}
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <div className="font-semibold text-lg mb-4 flex items-center gap-3 text-white">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <FaMagic className="text-cyan-400" />
                  </div>
                  Course Includes
                </div>
                <ul className="space-y-3">
                  {[
                    { icon: FaVideo, text: `${course.videoNotes || 20} Video Lessons`, color: "text-green-400" },
                    { icon: FaFilePdf, text: `${course.pdfNotes || 15} PDF Notes`, color: "text-red-400" },
                    { icon: FaQuestionCircle, text: `${course.quizzes || 5} Quizzes`, color: "text-purple-400" },
                    { icon: FaShieldAlt, text: "Certificate of Completion", color: "text-amber-400" }
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-white/80 group">
                      <div className={`p-2 bg-white/5 rounded-lg group-hover:scale-110 transition duration-300 ${item.color}`}>
                        <item.icon />
                      </div>
                      <span className="group-hover:text-white transition-colors">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Content - Enhanced Steps */}
            <div className="lg:col-span-2 bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10">
              {/* Animated Progress Steps */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-4 relative">
                  {[1, 2, 3, 4].map((stepNum) => (
                    <div key={stepNum} className="flex flex-col items-center relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step >= stepNum
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 border-transparent scale-110'
                        : 'bg-white/5 border-white/20'
                        }`}>
                        {step > stepNum ? (
                          <FaCheck className="text-white text-sm" />
                        ) : (
                          <span className={`text-sm font-semibold ${step >= stepNum ? 'text-white' : 'text-white/50'
                            }`}>
                            {stepNum}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs mt-2 ${step >= stepNum ? 'text-white font-semibold' : 'text-white/40'
                        }`}>
                        {['Details', 'Info', 'Payment', 'Success'][stepNum - 1]}
                      </span>
                    </div>
                  ))}
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-white/10 -z-10">
                    <div
                      className="h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                      style={{ width: step === 1 ? '0%' : step === 2 ? '33%' : step === 3 ? '66%' : '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="min-h-[400px]">
                {/* Step 1: Course Details */}
                {step === 1 && (
                  <div className="animate-fadeIn">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                      Course Overview
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                        <div className="text-sm text-white/60">Duration</div>
                        <div className="font-semibold text-lg text-white flex items-center gap-3 mt-2">
                          <div className="p-2 bg-cyan-500/20 rounded-lg">
                            <FaClock className="text-cyan-400" />
                          </div>
                          {course.duration || "4 Weeks"}
                        </div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                        <div className="text-sm text-white/60">Level</div>
                        <div className="font-semibold text-lg text-white flex items-center gap-3 mt-2">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <FaStar className="text-purple-400" />
                          </div>
                          {course.level || "Beginner"}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6">
                      <h3 className="font-semibold mb-3 text-white flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <FaCheck className="text-green-400" />
                        </div>
                        What You'll Master
                      </h3>
                      <div className="grid md:grid-cols-2 gap-2">
                        {course.learnings ? (
                          course.learnings.slice(0, 4).map((learning, index) => (
                            <div key={index} className="flex items-center gap-3 text-white/80 group">
                              <div className="w-2 h-2 bg-green-400 rounded-full group-hover:scale-150 transition duration-300"></div>
                              <span className="text-sm group-hover:text-white transition-colors">{learning}</span>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="flex items-center gap-3 text-white/80">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-sm">Comprehensive learning materials</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-sm">Hands-on projects and exercises</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2 justify-center group"
                        onClick={() => navigate(-1)}
                      >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        Back to Courses
                      </button>
                      <button
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white transition-all duration-300 flex-1 flex items-center gap-2 justify-center group"
                        onClick={() => setStep(2)}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                      >
                        Continue to Enrollment
                        <span className={`group-hover:translate-x-1 transition-transform ${isHovering ? 'animate-bounce' : ''}`}>→</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: User Information */}
                {step === 2 && (
                  <div className="animate-fadeIn">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                      Your Information
                    </h2>

                    <div className="grid gap-5 mb-6">
                      {[
                        { key: 'name', label: 'Full Name', placeholder: 'Enter your full name', type: 'text' },
                        { key: 'email', label: 'Email Address', placeholder: 'you@example.com', type: 'email' },
                        { key: 'mobile', label: 'Mobile Number', placeholder: '10-digit mobile number', type: 'tel' }
                      ].map((field) => (
                        <div key={field.key} className="group">
                          <label className="text-sm text-white/60 mb-3 block">{field.label}</label>
                          <input
                            type={field.type}
                            value={userInfo[field.key]}
                            onChange={(e) => setUserInfo({ ...userInfo, [field.key]: e.target.value })}
                            className="w-full p-4 rounded-xl bg-white/5 text-white outline-none border border-white/10 focus:border-cyan-500/50 transition-all duration-300 placeholder-white/30"
                            placeholder={field.placeholder}
                          />
                          {errors[field.key] && (
                            <div className="text-red-400 text-xs mt-2 flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                              {errors[field.key]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                      <button
                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                        onClick={() => setStep(1)}
                      >
                        ← Back
                      </button>
                      <button
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white transition-all duration-300 flex items-center gap-2"
                        onClick={() => { if (validateStep2()) setStep(3); }}
                      >
                        Continue to Payment
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <div className="animate-fadeIn">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                      Payment & Confirmation
                    </h2>

                    <div className="grid lg:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                          <h3 className="font-semibold mb-4 text-white flex items-center gap-3">
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                              <FaFilePdf className="text-cyan-400" />
                            </div>
                            Order Summary
                          </h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-white/80">
                              <span>Course:</span>
                              <span className="font-semibold text-white">{course.title}</span>
                            </div>
                            <div className="flex justify-between text-white/80">
                              <span>Instructor:</span>
                              <span>{course.instructor || "Expert Instructor"}</span>
                            </div>
                            <div className="flex justify-between text-white/80">
                              <span>Duration:</span>
                              <span>{course.duration || "4 Weeks"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                          <h3 className="font-semibold mb-4 text-white flex items-center gap-3">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                              <FaCheck className="text-green-400" />
                            </div>
                            What's Included
                          </h3>
                          <ul className="text-sm space-y-2 text-white/80">
                            <li className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                              Lifetime access to course materials
                            </li>
                            <li className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                              Certificate of completion
                            </li>
                            <li className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                              Community support
                            </li>
                            <li className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                              Project files and resources
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 p-5 rounded-xl border border-amber-500/30">
                          <div className="text-sm text-amber-200/80">Total Amount</div>
                          <div className="flex items-center gap-3 font-bold text-2xl lg:text-3xl mt-2 text-amber-300">
                            <FaCoins className="text-amber-400" />
                            {course.coins || 0} Coins
                          </div>
                        </div>

                        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                          <div className="text-sm text-white/60">Your Coin Balance</div>
                          <div className="font-semibold text-xl mt-1 text-cyan-300">{userCoins} Coins</div>

                          <div className="mt-4 space-y-3 text-sm">
                            <div className="flex justify-between text-white/80">
                              <span>Course Cost:</span>
                              <span className="font-semibold text-white">{course.coins || 0} Coins</span>
                            </div>
                            <div className="flex justify-between text-white/80">
                              <span>Remaining Balance:</span>
                              <span className={remainingCoins >= 0 ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
                                {remainingCoins} Coins
                              </span>
                            </div>
                          </div>

                          {remainingCoins < 0 && (
                            <div className="mt-3 p-3 bg-red-500/20 rounded-lg text-sm text-red-300 border border-red-500/30">
                              Insufficient coins. Please recharge your account.
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
                            onClick={() => setStep(2)}
                          >
                            ← Back
                          </button>
                          <button
                            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                            onClick={handleEnroll}
                            disabled={remainingCoins < 0 || paid}
                          >
                            {paid ? (
                              <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                              </span>
                            ) : (
                              <>
                                <FaShieldAlt />
                                Enroll & Pay Now
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                  <div className="text-center animate-fadeIn">
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-cyan-600 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center">
                        <div className="bg-slate-900 p-4 rounded-full shadow-2xl">
                          <FaCheck className="text-white text-2xl" />
                        </div>
                      </div>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                      Enrollment Successful!
                    </h2>
                    <p className="text-white/70 text-lg mb-6">
                      You are now enrolled in <strong className="text-white">{course.title}</strong>
                    </p>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-6 text-left max-w-md mx-auto">
                      <h3 className="font-semibold mb-4 text-center text-white">Enrollment Details</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-white/80">
                          <span>Reference ID:</span>
                          <span className="font-mono text-cyan-300">ENR-{Date.now().toString().slice(-6)}</span>
                        </div>
                        <div className="flex justify-between text-white/80">
                          <span>Enrollment Date:</span>
                          <span>{getDateStr()}</span>
                        </div>
                        <div className="flex justify-between text-white/80">
                          <span>Amount Paid:</span>
                          <span className="font-semibold text-amber-300">{course.coins || 0} Coins</span>
                        </div>
                        <div className="flex justify-between text-white/80">
                          <span>Remaining Balance:</span>
                          <span className="text-green-400 font-semibold">{userCoins} Coins</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white transition-all duration-300 flex items-center gap-2 group"
                        onClick={() => navigate("/my-courses")}
                      >
                        <FaRocket className="group-hover:animate-bounce" />
                        Start Learning Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <div className="text-center text-white/40 text-sm">
              BotVortex Learning Platform • 24/7 Support • Certificate Included
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Enrollment;