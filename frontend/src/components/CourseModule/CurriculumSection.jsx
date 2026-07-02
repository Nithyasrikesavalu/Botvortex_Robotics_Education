import React, { useEffect, useState } from "react";
import {
  PlayCircle,
  Play,
  ClipboardList,
  CheckCircle,
  Lock,
  AlertCircle,
  HelpCircle,
  FileText,
  Award
} from "lucide-react";
import { API_URL } from "../../config/api";
import CertificateModal from "../StudentDashboard/CertificateModal";


const CourseCurriculum = ({ course }) => {
  const [modules, setModules] = useState([]);
  const [courseTitle, setCourseTitle] = useState(course?.title || "Course Curriculum");
  const [finalTask, setFinalTask] = useState(null);
  const [finalTaskCompleted, setFinalTaskCompleted] = useState(false);
  const [finalProjectReport, setFinalProjectReport] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);

  // Derive courseId from the course prop (passed via router state)
  // useParams() won't work here since the route is /CoursesModule (no :courseId segment)
  const courseId = course?.courseId || course?._id || null;

  // Quiz State
  const [activeQuizModuleId, setActiveQuizModuleId] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    const fetchCourseDetails = async () => {
      // 1. Prioritize fetching from backend if course.courseId is present
      if (course?.courseId) {
        try {
          const res = await fetch(`${API_URL}/courses/${course.courseId}`);
          if (res.ok) {
            const data = await res.json();
            setCourseTitle(data.title || course.title);
            
            if (data.modules && data.modules.length > 0) {
              const mappedModules = data.modules.map((mod, idx) => ({
                id: mod._id || mod.id || idx + 1,
                title: mod.title || `Module ${idx + 1}`,
                status: idx === 0 ? "in-progress" : "upcoming",
                url: mod.url,
                notes: mod.notes,
                pdf: mod.pdf,
                quizzes: mod.quizzes || [],
                quizCompleted: false
              }));
              setModules(mappedModules);
              if (data.finalTask && data.finalTask.title) {
                setFinalTask(data.finalTask);
              }
              return; // Successfully loaded from backend
            }
          }
        } catch (err) {
          console.error("Failed to fetch course details from backend", err);
        }
      }

      // 2. Fallback to localStorage if backend fetch fails or no modules
      const savedCourse = localStorage.getItem('publishedCourse');
      let loadedFromStorage = false;
  
      if (savedCourse) {
        const parsed = JSON.parse(savedCourse);
        
        // If no course prop passed OR if the published course title matches the clicked course
        if (!course || parsed.title.toLowerCase() === course?.title?.toLowerCase()) {
          setCourseTitle(parsed.title || course?.title || "Untitled Course");
          
          if (parsed.modules && parsed.modules.length > 0) {
            const mappedModules = parsed.modules.map((mod, idx) => ({
              id: mod.id || idx + 1,
              title: mod.title || `Module ${idx + 1}`,
              status: idx === 0 ? "in-progress" : "upcoming",
              url: mod.url,
              notes: mod.notes,
              pdf: mod.pdf,
              quizzes: mod.quizzes || [],
              quizCompleted: false
            }));
            setModules(mappedModules);
            if (parsed.finalTask && parsed.finalTask.title) {
              setFinalTask(parsed.finalTask);
            }
            loadedFromStorage = true;
          }
        }
      }
  
      // 3. Fallback if no data was loaded from storage or backend for THIS specific course
      if (!loadedFromStorage && course) {
      setCourseTitle(course.title);
      // Generate some default dummy modules for the specific course so it's not empty
      setModules([
        {
          id: 1, title: `Introduction to ${course.title}`, status: "in-progress",
          url: "", notes: "Basic concepts and overview.", pdf: "", quizzes: []
        },
        {
          id: 2, title: `Core Principles of ${course.title}`, status: "upcoming",
          url: "", notes: "Deep dive into the main topics.", pdf: "", quizzes: []
        },
        {
          id: 3, title: `Advanced Applications in ${course.title}`, status: "upcoming",
          url: "", notes: "Real-world use cases.", pdf: "", quizzes: []
        }
      ]);
      } else if (!loadedFromStorage && !course) {
        setModules([]);
      }

      // 4. Fetch student progress and apply to modules
      try {
        const token = localStorage.getItem("token");
        if (token && (course?.courseId || courseId)) {
          const enrollRes = await fetch(`${API_URL}/student/courses`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (enrollRes.ok) {
            const enrollData = await enrollRes.json();
            const currentEnrollment = enrollData.find(e => e.courseId === (course?.courseId || courseId));
            if (currentEnrollment) {
              setFinalTaskCompleted(currentEnrollment.finalTaskCompleted || false);
              setFinalProjectReport(currentEnrollment.finalProjectReport || "");
              
              setModules(prev => {
                const completedCount = currentEnrollment.completedLessons || 0;
                return prev.map((mod, idx) => {
                  let status = "upcoming";
                  if (idx < completedCount) status = "completed";
                  else if (idx === completedCount) status = "in-progress";
                  return { ...mod, status, quizCompleted: idx < completedCount };
                });
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch student progress", err);
      }
    };

    fetchCourseDetails();
  }, [course]);

  const updateBackendProgress = async (newModules) => {
    if (!courseId) {
      console.warn("updateBackendProgress: courseId is null/undefined, skipping save");
      return;
    }
    try {
      const completedCount = newModules.filter(m => m.status === 'completed').length;
      const total = newModules.length || 1;
      const progress = Math.min(Math.round((completedCount / total) * 100), 99); // Max 99% until final task

      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/student/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          progress,
          completedLessons: completedCount,
          totalLessons: total
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Failed to update progress:", err);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleVideoClick = (moduleId) => {
    // Build new module list first, then call backend (not inside setState)
    setModules(prevModules => {
      const clickedIdx = prevModules.findIndex(m => m.id === moduleId);
      const newModules = prevModules.map((module, idx) => {
        // Mark clicked module AND all previous ones as completed
        if (idx <= clickedIdx) return { ...module, status: 'completed' };
        return module;
      });
      // Schedule the backend update after state is committed
      setTimeout(() => updateBackendProgress(newModules), 0);
      return newModules;
    });
  };

  const handleQuizStart = (moduleId) => {
    setActiveQuizModuleId(moduleId);
    setUserAnswers({});
  };

  const handleAnswerSelect = (quizId, optionIdx) => {
    setUserAnswers(prev => ({ ...prev, [quizId]: optionIdx }));
  };

  const handleQuizSubmit = (moduleId, quizzes) => {
    let correctCount = 0;
    quizzes.forEach(q => {
      if (userAnswers[q.id] === q.answer) {
        correctCount++;
      }
    });
    
    setModules(prevModules => {
      const newModules = prevModules.map(module => 
        module.id === moduleId 
          ? { ...module, quizCompleted: true, quizScore: `${correctCount}/${quizzes.length}` }
          : module
      );
      // Schedule the backend update after state is committed
      setTimeout(() => updateBackendProgress(newModules), 0);
      return newModules;
    });
    setActiveQuizModuleId(null);
  };

  const handleFinalTaskSubmit = async () => {
    setFinalTaskCompleted(true);
    if (!courseId) return;

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${API_URL}/student/courses/${courseId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            finalTaskCompleted: true,
            progress: 100,
            certificate: true,
            finalProjectReport: finalProjectReport
          })
        });
      }
    } catch (error) {
      console.error("Error updating final task progress:", error);
    }
  };

  const ModuleCard = ({ module, index }) => {
    const StatusIcon = module.status === 'completed' ? CheckCircle : 
                       module.status === 'in-progress' ? AlertCircle : Lock;

    return (
      <div 
        id={`module-${module.id}`}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 mb-6"
      >
        {/* Module Header */}
        <div className="bg-white border-b border-slate-200 p-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white border border-blue-200 text-blue-600 font-bold rounded flex items-center justify-center">
              <span>{index + 1}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{module.title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded font-semibold text-xs">
              <ClipboardList size={14} /> Contents
            </button>
            <button 
              onClick={() => handleVideoClick(module.id)}
              className={`flex items-center gap-2 border px-4 py-2 rounded font-semibold text-xs ${module.status === 'completed' ? 'border-green-200 bg-green-50 text-green-600' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              <CheckCircle size={14} /> {module.status === 'completed' ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>
        </div>

        {/* Module Content */}
        <div className="p-6">
          {/* Video Player Placeholder */}
          {module.url ? (
            <div className="bg-slate-900 rounded-xl overflow-hidden mb-8 border border-slate-200">
              <div className="h-48 flex items-center justify-center relative group cursor-pointer bg-slate-800">
                <PlayCircle size={48} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all group-hover:text-blue-400" />
                <div className="absolute bottom-4 left-4 bg-[#0B1527] border border-slate-700 text-white px-3 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase">
                  LESSON VIDEO
                </div>
              </div>
              <div className="bg-slate-50 border-t border-slate-200 p-4 text-slate-800">
                <h4 className="font-bold text-sm break-all">Link: {module.url}</h4>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200 mb-8">
              <p className="text-slate-500 font-bold">No video link provided for this module.</p>
            </div>
          )}

          {/* Notes & PDF Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {(module.notes || module.pdf) && (
              <div className="col-span-full border-t border-slate-100 pt-6">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-slate-900 text-sm tracking-wide uppercase">
                  Study Materials
                </h4>
              </div>
            )}
            
            {module.notes && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-2">
                  <FileText size={16} /> Key Notes
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{module.notes}</p>
              </div>
            )}
            
            {module.pdf && (
              <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-sm mb-2">
                    <ClipboardList size={16} /> PDF Material
                  </div>
                  <p className="text-slate-600 text-xs mb-4 break-all">{module.pdf}</p>
                </div>
                <a href={module.pdf} target="_blank" rel="noreferrer" className="inline-block text-center w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-colors">
                  View PDF
                </a>
              </div>
            )}
          </div>

          {/* Quiz Section */}
          {module.quizzes && module.quizzes.length > 0 && (
            <div className="bg-[#FAFAFA] rounded-xl p-5 border border-slate-200 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-purple-600">
                  <HelpCircle size={16} />
                  <span className="font-bold text-sm tracking-wide">MODULE QUIZ ({module.quizzes.length} Questions)</span>
                </div>
                {module.quizCompleted && (
                  <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Score: {module.quizScore}
                  </span>
                )}
              </div>
              
              {activeQuizModuleId === module.id ? (
                <div className="space-y-6 mt-4 border-t border-slate-200 pt-4">
                  {module.quizzes.map((q, qIdx) => (
                    <div key={q.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                      <p className="font-bold text-slate-800 text-sm mb-3">{qIdx + 1}. {q.question}</p>
                      <div className="space-y-2 pl-2">
                        {q.options.map((opt, optIdx) => (
                          <label key={optIdx} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                              type="radio" 
                              name={`quiz-${q.id}`} 
                              checked={userAnswers[q.id] === optIdx}
                              onChange={() => handleAnswerSelect(q.id, optIdx)}
                              className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 cursor-pointer"
                            />
                            <span className="text-sm text-slate-600 group-hover:text-purple-700 transition-colors">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      onClick={() => setActiveQuizModuleId(null)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleQuizSubmit(module.id, module.quizzes)}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-sm transition-colors shadow-md"
                    >
                      Submit Answers
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-2">
                  <p className="text-slate-500 font-medium text-sm">
                    {module.quizCompleted ? "You have completed this quiz. Retakes are not allowed." : `Test your knowledge on ${module.title}`}
                  </p>
                  {!module.quizCompleted && (
                    <button 
                      onClick={() => handleQuizStart(module.id)}
                      disabled={module.status === 'upcoming'}
                      className={`${module.status !== 'upcoming' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-slate-200 text-slate-500'} px-5 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 disabled:cursor-not-allowed shadow-sm`}
                    >
                      <HelpCircle size={14} />
                      Start Quiz
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Course Curriculum</h2>
          <p className="text-slate-600">
            {modules.length > 0 ? `Track your progress through ${courseTitle}.` : "No curriculum has been published yet. Check back later."}
          </p>
        </div>
        <div className="hidden sm:flex bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm items-center gap-4">
          <div className="text-center">
            <span className="block text-xl font-bold text-slate-900">{modules.length}</span>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">MODULES</span>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div className="text-center">
            <span className="block text-xl font-bold text-emerald-600">{modules.filter(m => m.status === 'completed').length}</span>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">COMPLETED</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {modules.map((module, idx) => (
          <ModuleCard key={module.id} module={module} index={idx} />
        ))}

        {modules.length === 0 && (
          <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
            <h3 className="text-xl font-bold text-slate-400 mb-2">Curriculum Empty</h3>
            <p className="text-slate-500">The instructor has not published any modules for this course yet.</p>
          </div>
        )}

        {finalTask && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-sm border border-purple-200 overflow-hidden mt-8 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
            <div className="p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Final Project: {finalTask.title}</h3>
                    <p className="text-sm font-medium text-purple-600">Required for 100% Course Completion</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 rounded-xl p-5 border border-purple-100 mb-4">
                <h4 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-wider">Project Requirements</h4>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{finalTask.description}</p>
              </div>
              
              {!finalTaskCompleted ? (
                <div className="bg-white rounded-xl p-5 border border-purple-100">
                  <h4 className="font-bold text-slate-800 text-sm mb-3">Submit Your Report / Project Link</h4>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[100px]"
                    placeholder="Paste your project URL (GitHub, Google Drive) or write a summary report here..."
                    value={finalProjectReport}
                    onChange={(e) => setFinalProjectReport(e.target.value)}
                  ></textarea>
                </div>
              ) : (
                <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                  <h4 className="font-bold text-green-800 text-sm mb-2">Submitted Report</h4>
                  <p className="text-green-700 text-sm whitespace-pre-wrap">{finalProjectReport || "Project successfully completed and submitted."}</p>
                </div>
              )}
              
              <div className="mt-6 flex justify-end gap-3">
                {finalTaskCompleted && (
                  <button 
                    onClick={() => setShowCertificate(true)}
                    className="flex items-center gap-2 border border-purple-600 bg-white text-purple-600 hover:bg-purple-50 px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm"
                  >
                    <Award size={16} /> View Certificate
                  </button>
                )}
                
                <button 
                  onClick={handleFinalTaskSubmit}
                  disabled={finalTaskCompleted || (!finalProjectReport.trim() && !finalTaskCompleted)}
                  className={`flex items-center gap-2 border px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${finalTaskCompleted ? 'bg-green-500 border-green-600 text-white shadow-green-500/20' : 'bg-purple-600 border-purple-700 text-white hover:bg-purple-700 shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                >
                  <CheckCircle size={16} /> {finalTaskCompleted ? 'Project Completed' : 'Mark Project as Complete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <CertificateModal 
        isOpen={showCertificate} 
        onClose={() => setShowCertificate(false)} 
        certData={{
          studentName: JSON.parse(localStorage.getItem("user") || "{}").fullName || JSON.parse(localStorage.getItem("user") || "{}").name || "Student",
          title: courseTitle,
          date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        }} 
      />
    </div>
  );
};

export default CourseCurriculum;
