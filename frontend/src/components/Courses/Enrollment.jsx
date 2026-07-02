import { API_URL } from "../../config/api";
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
    instructor: "Alexbenson",
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
        const response = await fetch(`${API_URL}/student/profile`, {
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
      const response = await fetch(`${API_URL}/student/courses`, {
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
          progress: 0,
          coins: course.coins || 0
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
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-blue-400/10 to-indigo-600/10"
          style={{
            width: Math.random() * 80 + 40,
            height: Math.random() * 80 + 40,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 15 + 15}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 5}s`,
            filter: 'blur(2px)',
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      <FloatingOrbs />

      <div className="w-full max-w-6xl relative z-10 py-8">
        {/* Main Interface Container */}
        <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">

          {/* Top Navigation / Progress Header */}
          <div className="p-8 pb-4 border-b border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]">
                  <FaRocket className="text-blue-400 text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white">
                    MISSION <span className="text-blue-500">ENROLL</span>
                  </h1>
                  <p className="text-slate-400 font-medium text-sm tracking-wide uppercase">Phase {step} of 4 • Authorization Required</p>
                </div>
              </div>

              {/* Enhanced Balance Display */}
              <div className="flex items-center gap-2 bg-black/40 p-1 px-1 pr-4 rounded-full border border-white/5 backdrop-blur-md">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full shadow-lg">
                  <FaGem className="text-white text-xl animate-pulse" />
                </div>
                <div className="ml-2">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Credits Available</p>
                  <p className="text-xl font-black text-white leading-none">{userCoins.toLocaleString()}</p>
                </div>
                <div className="w-px h-8 bg-white/10 mx-2"></div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Required</p>
                  <p className="text-xl font-black text-amber-500 leading-none">{course.coins || 0}</p>
                </div>
              </div>
            </div>

            {/* Futuristic Progress Bar */}
            <div className="mt-10 mb-2 px-4">
              <div className="flex justify-between relative">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex flex-col items-center z-10 group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-700 ${step >= s
                      ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)] scale-110'
                      : 'bg-slate-800 border border-white/10'
                      }`}>
                      {step > s ? <FaCheck className="text-white text-xs" /> : <span className={`text-xs font-bold ${step >= s ? 'text-white' : 'text-slate-500'}`}>{s}</span>}
                    </div>
                    <span className={`text-[10px] mt-2 font-bold uppercase tracking-widest ${step >= s ? 'text-blue-400' : 'text-slate-600'}`}>
                      {['Target', 'Identity', 'Validate', 'Go'][s - 1]}
                    </span>
                  </div>
                ))}
                <div className="absolute top-4 left-0 right-0 h-[2px] bg-slate-800 -z-0">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-1000 ease-out"
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 grid lg:grid-cols-12 gap-0 overflow-hidden">
            {/* Sidebar - Course Briefing */}
            <div className="lg:col-span-4 bg-black/20 border-r border-white/5 p-8 space-y-8">
              <div className="relative group">
                <div className="absolute -inset-2 bg-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img
                    src={course.image || course.thumbnail || DEFAULT_THUMBNAIL}
                    alt={course.title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-600/80 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-widest">
                        {course.level || "Classified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  {course.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed italic">
                  "{course.description}"
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Duration</p>
                    <p className="text-white font-bold flex items-center gap-2 mt-1 whitespace-nowrap">
                      <FaClock className="text-blue-500" /> {course.duration}
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Rating</p>
                    <p className="text-white font-bold flex items-center gap-2 mt-1">
                      <FaStar className="text-amber-500" /> {course.rating}
                    </p>
                  </div>
                </div>
              </div>

              <div className={"bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-4"}>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Package Inventory</h4>
                <div className="space-y-3">
                  {[
                    { icon: FaVideo, label: `${course.videoNotes || 20} Data Uplinks`, color: 'text-blue-400' },
                    { icon: FaFilePdf, label: `${course.pdfNotes || 15} Blueprints`, color: 'text-cyan-400' },
                    { icon: FaQuestionCircle, label: `${course.quizzes || 5} Simulations`, color: 'text-indigo-400' },
                    { icon: FaShieldAlt, label: "Neural Certification", color: 'text-emerald-400' }
                  ].map((inv, idx) => (
                    <div key={idx} className="flex items-center gap-3 group">
                      <div className={`p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors ${inv.color}`}>
                        <inv.icon className="text-sm" />
                      </div>
                      <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">{inv.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 p-8 lg:p-12 h-full flex flex-col">
              <div className="flex-1">
                {step === 1 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-4xl font-black text-white mb-6">Course <span className="text-blue-500">Specs</span></h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                      <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative bg-white/5 p-6 rounded-2xl border border-white/5 flex items-start gap-4">
                          <div className="p-3 bg-blue-600/20 rounded-xl">
                            <FaBook className="text-blue-500 text-xl" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white">Full Access</h4>
                            <p className="text-slate-400 text-xs mt-1">Unlimited lifetime access to all course modules and updates.</p>
                          </div>
                        </div>
                      </div>
                      <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-400 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative bg-white/5 p-6 rounded-2xl border border-white/5 flex items-start gap-4">
                          <div className="p-3 bg-indigo-600/20 rounded-xl">
                            <FaMagic className="text-indigo-500 text-xl" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white">Project Based</h4>
                            <p className="text-slate-400 text-xs mt-1">Learn by building real-world robotics applications.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-600/5 rounded-3xl border border-blue-500/10 p-8 mb-10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/20 transition-colors"></div>
                      <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider flex items-center gap-3">
                        <span className="w-8 h-px bg-blue-500"></span>
                        Key Learnings
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                        {(course.learnings || ["Advanced Mechanics", "Core Programming", "Sensor Logic", "AI Integration"]).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 group/item">
                            <div className="w-5 h-5 bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30 group-hover/item:bg-blue-600 group-hover/item:border-transparent transition-all">
                              <FaCheck className="text-[8px] text-blue-400 group-hover/item:text-white" />
                            </div>
                            <span className="text-sm font-medium text-slate-300 group-hover/item:text-white transition-colors">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => navigate(-1)}
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl border border-white/5 transition-all"
                      >
                        Abort Mission
                      </button>
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-2 group"
                      >
                        INITIALIZE PHASE 2
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                    <h2 className="text-4xl font-black text-white mb-2">Identity <span className="text-blue-500">Verification</span></h2>
                    <p className="text-slate-400 mb-8 uppercase text-xs tracking-[0.2em] font-bold">Secure Data Entry Required</p>

                    <div className="space-y-6 mb-10">
                      {[
                        { id: 'name', label: 'Candidate Name', icon: FaRocket, placeholder: 'Enter full name...' },
                        { id: 'email', label: 'Comm Link (Email)', icon: FaBook, placeholder: 'nexus@botvortex.ai' },
                        { id: 'mobile', label: 'Signal Range (Mobile)', icon: FaShieldAlt, placeholder: '10-digit frequency...' }
                      ].map((field) => (
                        <div key={field.id} className="group flex flex-col">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">{field.label}</label>
                          <div className={`flex items-center bg-black/40 border ${errors[field.id] ? 'border-red-500/50' : 'border-white/10 group-focus-within:border-blue-500/50'} rounded-2xl p-1 transition-all`}>
                            <div className="p-3 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                              <field.icon />
                            </div>
                            <input
                              type={field.id === 'email' ? 'email' : 'text'}
                              value={userInfo[field.id]}
                              onChange={(e) => setUserInfo({ ...userInfo, [field.id]: e.target.value })}
                              placeholder={field.placeholder}
                              className="bg-transparent border-none outline-none flex-1 p-3 text-white font-medium placeholder-slate-700"
                            />
                          </div>
                          {errors[field.id] && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase tracking-tighter">{errors[field.id]}</p>}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep(1)}
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl border border-white/5 transition-all"
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={() => { if (validateStep2()) setStep(3); }}
                        className="flex-1 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-2 group"
                      >
                        PROCEED TO VALIDATION
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                    <h2 className="text-4xl font-black text-white mb-2">Final <span className="text-blue-500">Validation</span></h2>
                    <p className="text-slate-400 mb-8 uppercase text-xs tracking-[0.2em] font-bold">Encrypted Credit Transfer</p>

                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                        <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest">Selected Payload</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Mission Title</p>
                            <p className="text-white font-bold leading-tight mt-1">{course.title}</p>
                          </div>
                          <div className="w-full h-px bg-white/5"></div>
                          <div className="flex justify-between">
                            <div>
                              <p className="text-[10px] text-slate-500 font-bold uppercase">Instructor</p>
                              <p className="text-white font-semibold text-sm mt-1">{course.instructor || "Classified"}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-slate-500 font-bold uppercase">Access</p>
                              <p className="text-white font-semibold text-sm mt-1">Unlimited</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-600/10 p-6 rounded-3xl border border-blue-500/20 space-y-6 text-center flex flex-col justify-center">
                        <div>
                          <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-2">Required Alignment</p>
                          <div className="flex items-center justify-center gap-2 text-4xl font-black text-white">
                            <FaCoins className="text-amber-500 text-3xl" />
                            {course.coins || 0}
                          </div>
                        </div>
                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-2">
                            <span>Balance After Transfer</span>
                          </div>
                          <div className={`text-xl font-black ${remainingCoins >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                            {remainingCoins.toLocaleString()} Credits
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {remainingCoins < 0 ? (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
                          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                            <FaShieldAlt />
                          </div>
                          <p className="text-xs font-bold text-red-400">INSUFFICIENT CREDITS. PLEASE REPLENISH YOUR VAULT TO CONTINUE.</p>
                        </div>
                      ) : (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                            <FaCheck />
                          </div>
                          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Neural Connection Secure. Credits Verified.</p>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <button
                          onClick={() => setStep(2)}
                          className="px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl border border-white/5 transition-all"
                        >
                          Revise Info
                        </button>
                        {remainingCoins < 0 ? (
                          <button
                            onClick={() => alert("Redirecting to Coin Store... (Feature under development)")}
                            className="flex-1 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl shadow-[0_10px_20px_-10px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-3 group"
                          >
                            BUY COINS
                            <FaCoins className="group-hover:scale-110 transition-transform" />
                          </button>
                        ) : (
                          <button
                            onClick={handleEnroll}
                            disabled={paid}
                            className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black rounded-2xl shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-3 group"
                          >
                            {paid ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                PROCESSING...
                              </>
                            ) : (
                              <>
                                AUTHORIZE & START MISSION
                                <FaRocket className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-700 p-4">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-blue-500 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.6)] relative z-10">
                        <FaCheck className="text-white text-4xl" />
                      </div>
                    </div>

                    <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">MISSION <span className="text-emerald-400">ACTIVE</span></h2>
                    <p className="text-slate-400 max-w-sm mx-auto mb-10 text-lg font-medium leading-relaxed">
                      Lifting off! Your enrollment in <span className="text-white font-bold">{course.title}</span> is now confirmed and authorized.
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-10">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Access ID</p>
                        <p className="font-mono text-blue-400 font-bold">#BV-{Date.now().toString().slice(-6)}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Status</p>
                        <p className="text-emerald-400 font-bold">OPERATIONAL</p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/my-courses")}
                      className="w-full max-w-md bg-white text-slate-950 font-black py-4 rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] group"
                    >
                      ENTER LEARNING NEURAL LINK
                      <FaMagic className="group-hover:rotate-12 transition-transform" />
                    </button>
                  </div>
                )}
              </div>

              {/* Status Bar / Bottom Help */}
              {step < 4 && (
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3 text-slate-500">
                    <FaShieldAlt className="text-blue-500/50" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Encrypted Session</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    v4.1.0 • BotVortex Neural Network
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-30px) translateX(20px) rotate(5deg); }
          66% { transform: translateY(10px) translateX(-20px) rotate(-5deg); }
        }
      `}</style>
    </div>
  );
};

export default Enrollment;
