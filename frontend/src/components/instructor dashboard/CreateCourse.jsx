import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Upload, Settings, BookOpen, Video, Target, Sparkles, 
  Trash2, X, AlertCircle, Save, Send, ChevronRight, Edit3, Users, Star
} from "lucide-react";
import { API_URL } from "../../config/api";

const CreateCourse = ({ instructor }) => {
  const [viewMode, setViewMode] = useState("list"); // "list" or "create"
  const [activeStep, setActiveStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: "",
    category: "",
    description: "",
    objectives: ["", ""],
    price: "",
    discount: "",
    modules: [{ id: 1, title: "", url: "", notes: "", pdf: "", quizzes: [] }],
    finalTask: { title: "", description: "" },
    thumbnail: null,
    id: null
  });

  const handleEditCourse = (course, step = 1) => {
    setCourseData({
      title: course.title || "",
      category: "Robotics", // Dummy default for now if no category exists
      description: course.description || "",
      objectives: course.learnings && course.learnings.length > 0 ? course.learnings : [""],
      price: course.coins?.toString() || "0",
      discount: "0",
      modules: course.modules && course.modules.length > 0 ? course.modules.map(m => ({
        ...m,
        id: m._id || m.id || Date.now(),
        notes: m.description || m.notes || "",
        url: m.url || "",
        pdf: m.pdf || ""
      })) : [{ id: Date.now(), title: "", url: "", notes: "", pdf: "", quizzes: [] }],
      finalTask: course.finalTask || { title: "", description: "" },
      thumbnail: course.image,
      id: course.id || course._id
    });
    setActiveStep(step);
    setViewMode("create");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...courseData.objectives];
    newObjectives[index] = value;
    setCourseData(prev => ({ ...prev, objectives: newObjectives }));
  };

  const handleModuleChange = (idx, field, value) => {
    const updated = [...courseData.modules];
    updated[idx][field] = value;
    setCourseData(prev => ({...prev, modules: updated}));
  };

  const addModule = () => {
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, { id: Date.now(), title: "", url: "", notes: "", pdf: "", quizzes: [] }]
    }));
  };

  const addQuiz = (moduleIdx) => {
    const updated = [...courseData.modules];
    if (updated[moduleIdx].quizzes.length >= 10) {
      alert("Maximum 10 quizzes allowed per module.");
      return;
    }
    updated[moduleIdx].quizzes.push({ id: Date.now(), question: "", options: ["", "", "", ""], answer: 0 });
    setCourseData(prev => ({...prev, modules: updated}));
  };

  const handleQuizChange = (moduleIdx, quizIdx, field, value) => {
    const updated = [...courseData.modules];
    updated[moduleIdx].quizzes[quizIdx][field] = value;
    setCourseData(prev => ({...prev, modules: updated}));
  };

  const handleQuizOptionChange = (moduleIdx, quizIdx, optionIdx, value) => {
    const updated = [...courseData.modules];
    updated[moduleIdx].quizzes[quizIdx].options[optionIdx] = value;
    setCourseData(prev => ({...prev, modules: updated}));
  };

  const removeQuiz = (moduleIdx, quizIdx) => {
    const updated = [...courseData.modules];
    updated[moduleIdx].quizzes = updated[moduleIdx].quizzes.filter((_, i) => i !== quizIdx);
    setCourseData(prev => ({...prev, modules: updated}));
  };

  const resetForm = () => {
    setCourseData({
      title: "", category: "", description: "", objectives: ["", ""],
      price: "", discount: "", modules: [{ id: 1, title: "", url: "", notes: "", pdf: "", quizzes: [] }], finalTask: { title: "", description: "" }, thumbnail: null, id: null
    });
    setActiveStep(1);
  };

  const handleCreateNew = () => {
    resetForm();
    setViewMode("create");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Saving Course Data to Database:", courseData);
    
    try {
      const token = localStorage.getItem("instructorToken") || localStorage.getItem("token");
      
      const payload = {
        title: courseData.title,
        description: courseData.description,
        level: courseData.category === "Robotics" ? "beginner" : "intermediate",
        coins: parseInt(courseData.price) || 0,
        learnings: courseData.objectives.filter(obj => obj.trim() !== ""),
        finalTask: courseData.finalTask,
        modules: courseData.modules.map((m, index) => ({
          _id: m._id,
          title: m.title || `Module ${index + 1}`,
          type: m.type || (m.pdf ? 'pdf' : 'video'),
          url: m.url || m.pdf || '#', // required by backend schema
          description: m.notes || m.description || '',
          order: m.order || index + 1
        })),
        duration: "4 Weeks", // static for now
        lectures: `${courseData.modules.length} Lectures`,
        projects: 1
      };

      const url = courseData.id 
        ? `${API_URL}/instructor/courses/${courseData.id}` 
        : `${API_URL}/instructor/courses`;
        
      const method = courseData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Course saved successfully! It is now live.");
        setViewMode("list");
        // We should really re-fetch the list here, let's force a reload for simplicity
        window.location.reload();
      } else {
        const errData = await response.json();
        alert("Error saving course: " + (errData.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save course. Check console for details.");
    }
  };

  const [existingCourses, setExistingCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("instructorToken") || localStorage.getItem("token");
        const res = await fetch(`${API_URL}/instructor/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Map MongoDB courses to UI format but KEEP all backend data
          const mappedCourses = data.map(course => ({
            ...course,
            id: course._id,
            title: course.title,
            level: course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : "Beginner",
            students: course.students || 0,
            rating: course.rating || 4.5,
            coins: course.coins || 0,
            status: "Published",
            image: course.image || "https://images.unsplash.com/photo-1581094794329-c8112a89af12"
          }));
          setExistingCourses(mappedCourses);
        }
      } catch (err) {
        console.error("Failed to fetch instructor courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  if (viewMode === "list") {
    return (
      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-xl">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <BookOpen className="text-[#00E5FF] w-8 h-8" />
              Handling Courses
            </h2>
            <p className="text-slate-400 mt-2">Manage your existing courses or create a new one.</p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="px-6 py-3 bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#00E5FF] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center gap-2"
          >
            <Plus size={18} /> Create New Course
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingCourses ? (
            <div className="col-span-3 text-center text-slate-400 py-10">Loading your courses...</div>
          ) : existingCourses.length === 0 ? (
            <div className="col-span-3 text-center text-slate-400 py-10">No courses found. Create one!</div>
          ) : (
            existingCourses.map(course => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl overflow-hidden border border-white/5 hover:border-[#00E5FF]/30 transition-all group">
              <div className="h-40 overflow-hidden relative">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] to-transparent"></div>
                <span className="absolute bottom-3 left-3 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/10">
                  {course.level}
                </span>
                <span className="absolute top-3 right-3 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/30">
                  {course.status}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 line-clamp-1">{course.title}</h3>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Users size={16} /> <span className="font-bold text-white">{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-yellow-400">
                    <Star size={16} className="fill-yellow-400" /> <span className="font-bold">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-amber-500">
                    <span className="font-bold">₹{course.coins}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditCourse(course, 1)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    <Edit3 size={16} /> Edit
                  </button>
                  <button onClick={() => handleEditCourse(course, 2)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    <Video size={16} /> Content
                  </button>
                </div>
              </div>
            </motion.div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-8 border border-[#00E5FF]/30 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Sparkles className="text-[#00E5FF] w-8 h-8" />
            {courseData.title ? `Editing: ${courseData.title}` : 'Course Builder'}
          </h2>
          <p className="text-slate-400 mt-2">Design, upload, and publish premium courses.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setViewMode("list")} className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2">
            <X size={18} /> Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#00E5FF] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center gap-2"
          >
            <Send size={18} /> Publish Course
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4 bg-[#0A192F]/80 p-3 rounded-full border border-white/5">
          <button onClick={() => setActiveStep(1)} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeStep === 1 ? 'bg-[#7C3AED] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
            1. Basic Info
          </button>
          <button onClick={() => setActiveStep(2)} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeStep === 2 ? 'bg-[#7C3AED] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
            2. Curriculum & Videos
          </button>
          <button onClick={() => setActiveStep(3)} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeStep === 3 ? 'bg-[#7C3AED] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
            3. Pricing & Publish
          </button>
        </div>
      </div>

      <div className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-xl">
        
        {/* Step 1: Basic Info */}
        {activeStep === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Course Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Course Title</label>
                <input 
                  type="text" name="title" value={courseData.title || ""} onChange={handleInputChange}
                  placeholder="e.g. Advanced AI Robotics"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                <select 
                  name="category" value={courseData.category || ""} onChange={handleInputChange}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] transition-colors appearance-none"
                >
                  <option value="">Select Category</option>
                  <option value="Robotics">Robotics</option>
                  <option value="AI">Artificial Intelligence</option>
                  <option value="IoT">IoT Systems</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Course Description</label>
              <textarea 
                name="description" value={courseData.description || ""} onChange={handleInputChange} rows="4"
                placeholder="What will students learn in this course?"
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] transition-colors resize-none"
              ></textarea>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Learning Objectives</label>
              {courseData.objectives.map((obj, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="p-3 bg-[#00E5FF]/10 text-[#00E5FF] rounded-lg"><Target size={20} /></div>
                  <input 
                    type="text" value={obj || ""} onChange={(e) => handleObjectiveChange(idx, e.target.value)}
                    placeholder="e.g. Build a functional autonomous robot"
                    className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] transition-colors"
                  />
                  <button 
                    onClick={() => setCourseData(prev => ({...prev, objectives: prev.objectives.filter((_, i) => i !== idx)}))}
                    className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setCourseData(prev => ({...prev, objectives: [...prev.objectives, ""]}))}
                className="text-[#00E5FF] text-sm font-bold flex items-center gap-2 hover:underline"
              >
                <Plus size={16} /> Add another objective
              </button>
            </div>
            
            <div className="flex justify-end pt-6 border-t border-white/10 mt-8">
              <button onClick={() => setActiveStep(2)} className="px-6 py-3 bg-[#7C3AED] text-white rounded-xl font-bold flex items-center gap-2">
                Continue to Curriculum <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Curriculum */}
        {activeStep === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Curriculum & Video Uploads</h3>
            
            <div className="space-y-6">
              {courseData.modules.map((mod, idx) => (
                <div key={mod.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#7C3AED] rounded-full flex items-center justify-center text-xs">{idx + 1}</div>
                      Module Setup
                    </h4>
                    <button 
                      onClick={() => setCourseData(prev => ({...prev, modules: prev.modules.filter((_, i) => i !== idx)}))}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Module Title</label>
                      <input 
                        type="text" value={mod.title || ""} onChange={(e) => handleModuleChange(idx, 'title', e.target.value)}
                        placeholder="e.g. Introduction to Sensors"
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Video URL / Upload</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" value={mod.url || ""} onChange={(e) => handleModuleChange(idx, 'url', e.target.value)}
                            placeholder="Link to video (or upload)"
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] transition-colors"
                          />
                          <button className="p-3 bg-[#00E5FF]/10 text-[#00E5FF] rounded-xl hover:bg-[#00E5FF]/20 transition-colors shrink-0">
                            <Upload size={20} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Text Notes</label>
                        <textarea 
                          value={mod.notes || ''} onChange={(e) => handleModuleChange(idx, 'notes', e.target.value)}
                          placeholder="Add key notes or references for this module"
                          rows="2"
                          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] transition-colors resize-none"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">PDF Materials</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" value={mod.pdf || ''} onChange={(e) => handleModuleChange(idx, 'pdf', e.target.value)}
                            placeholder="URL to PDF file"
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
                          />
                          <label 
                            className="p-3 bg-[#7C3AED]/10 text-[#7C3AED] rounded-xl hover:bg-[#7C3AED]/20 transition-colors shrink-0 cursor-pointer"
                            title="Upload PDF Notes from Local Storage"
                          >
                            <Upload size={20} />
                            <input 
                              type="file" 
                              accept=".pdf" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if(file) {
                                  // Simulate local upload by setting a fake path with the original file name
                                  handleModuleChange(idx, 'pdf', `/local-storage/pdfs/${file.name}`);
                                }
                              }} 
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quizzes Section */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-bold text-white text-sm">Module Quizzes ({(mod.quizzes || []).length}/10)</h5>
                      <button 
                        onClick={() => addQuiz(idx)}
                        className="text-[#00E5FF] text-xs font-bold flex items-center gap-1 hover:underline"
                      >
                        <Plus size={14} /> Add Quiz Question
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(mod.quizzes || []).map((quiz, qIdx) => (
                        <div key={quiz.id} className="bg-slate-900/50 rounded-xl p-4 border border-white/5 relative">
                          <button 
                            onClick={() => removeQuiz(idx, qIdx)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="space-y-4 pr-8">
                            <input 
                              type="text" value={quiz.question || ""} onChange={(e) => handleQuizChange(idx, qIdx, 'question', e.target.value)}
                              placeholder={`Question ${qIdx + 1}`}
                              className="w-full bg-transparent border-b border-white/10 px-0 py-2 text-white focus:outline-none focus:border-[#00E5FF] transition-colors font-bold text-sm"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {quiz.options.map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-2">
                                  <input 
                                    type="radio" name={`quiz-${mod.id}-${quiz.id}`}
                                    checked={quiz.answer === oIdx}
                                    onChange={() => handleQuizChange(idx, qIdx, 'answer', oIdx)}
                                    className="accent-[#00E5FF]"
                                  />
                                  <input 
                                    type="text" value={opt || ""} onChange={(e) => handleQuizOptionChange(idx, qIdx, oIdx, e.target.value)}
                                    placeholder={`Option ${oIdx + 1}`}
                                    className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-white/20 text-xs"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={addModule}
              className="w-full py-4 border-2 border-dashed border-white/20 hover:border-[#00E5FF] text-slate-400 hover:text-[#00E5FF] rounded-2xl flex items-center justify-center gap-2 font-bold transition-all"
            >
              <Plus size={20} /> Add New Module
            </button>

            {/* Final Task Section */}
            <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-2xl p-6 shadow-lg mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Target className="text-[#7C3AED] w-6 h-6" />
                <h4 className="font-bold text-white text-lg">Final Project / Task</h4>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Students must complete this final task to achieve 100% course completion.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Task Title</label>
                  <input 
                    type="text" 
                    value={courseData.finalTask?.title || ""} 
                    onChange={(e) => setCourseData(prev => ({...prev, finalTask: {...prev.finalTask, title: e.target.value}}))}
                    placeholder="e.g. Build an Autonomous Drone"
                    className="w-full bg-slate-900/50 border border-[#7C3AED]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Task Requirements / Description</label>
                  <textarea 
                    value={courseData.finalTask?.description || ""} 
                    onChange={(e) => setCourseData(prev => ({...prev, finalTask: {...prev.finalTask, description: e.target.value}}))}
                    placeholder="Describe what the student needs to submit to complete this course."
                    rows="3"
                    className="w-full bg-slate-900/50 border border-[#7C3AED]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7C3AED] transition-colors resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-white/10 mt-8">
              <button onClick={() => setActiveStep(1)} className="px-6 py-3 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                Back
              </button>
              <button onClick={() => setActiveStep(3)} className="px-6 py-3 bg-[#7C3AED] text-white rounded-xl font-bold flex items-center gap-2">
                Continue to Publish <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Publish */}
        {activeStep === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Pricing</h3>
            
            <div className="max-w-md gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Course Price (₹)</label>
                  <input 
                    type="number" name="price" value={courseData.price || ""} onChange={handleInputChange}
                    placeholder="e.g. 1999"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] transition-colors text-2xl font-black"
                  />
                </div>
                
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 text-emerald-400">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">Setting the price to 0 makes this a free course. Premium courses earn you 70% revenue share.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-white/10 mt-8">
              <button onClick={() => setActiveStep(2)} className="px-6 py-3 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                Back
              </button>
              <button onClick={handleSubmit} className="px-8 py-3 bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#00E5FF] text-white rounded-xl font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center gap-2">
                <Send size={18} /> Publish Course
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default CreateCourse;
