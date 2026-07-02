import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, Plus, Search, Filter, Clock, AlertCircle, 
  CheckCircle2, Users, FileText, Send, X 
} from 'lucide-react';
import { API_URL } from '../../config/api';

const availableCourses = [
  'Introduction to Robotics',
  'Advanced Embedded Systems',
  'Python for Automation',
  'IoT Architecture',
  'AI-Powered Robotics Mastery',
  'Master of Robotics Engineering',
  'Advanced Control Systems',
  'Embedded Systems 101',
  'Computer Vision for Drones',
  'ROS (Robot Operating System) Basics',
  'Autonomous Vehicles: Path Planning',
  'Machine Learning for Robotics',
  'Deep Learning and Neural Networks',
  'Sensor Fusion & Perception',
  'Kinematics and Dynamics of Robots',
  'Reinforcement Learning in AI',
  'Industrial Robotics & Automation',
  'Mobile Robot Navigation',
  'Haptics and Teleoperation',
  'Drone Swarm Algorithms',
  'Human-Robot Interaction',
  'Cyber-Physical Systems',
  'Robotic Grasping and Manipulation',
  'Edge AI and TinyML'
];

const InstructorTaskManagement = () => {
  const [activeTab, setActiveTab] = useState('assigned');
  const [isAssigning, setIsAssigning] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    course: "",
    dueDate: "",
    description: "",
  });

  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Grading Modal State
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ grade: '', review: '', coins: 0 });
  const [isGrading, setIsGrading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('instructorToken') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
      
      const subRes = await fetch(`${API_URL}/tasks/all/submissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubmissions(subData);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('instructorToken') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });
      
      if (response.ok) {
        const createdTask = await response.json();
        setTasks([createdTask, ...tasks]);
        
        // Notify students
        const existingNotifs = JSON.parse(localStorage.getItem('studentNotifications') || '[]');
        existingNotifs.unshift({ id: Date.now(), message: `New Task Assigned: ${newTask.title} in ${newTask.course}`, read: false, time: new Date().toLocaleTimeString() });
        localStorage.setItem('studentNotifications', JSON.stringify(existingNotifs));

        setIsAssigning(false);
        setNewTask({ title: "", course: "", dueDate: "", description: "" });
        alert("Task successfully assigned to students!");
      } else {
        alert("Failed to assign task");
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      alert("An error occurred");
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      setIsGrading(true);
      const token = localStorage.getItem('instructorToken') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tasks/submissions/${selectedSubmission._id}/grade`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gradeData)
      });

      if (response.ok) {
        const updatedSub = await response.json();
        // Update local submissions
        setSubmissions(submissions.map(sub => sub._id === updatedSub._id ? updatedSub : sub));
        
        // Notify Student
        const existingNotifs = JSON.parse(localStorage.getItem('studentNotifications') || '[]');
        existingNotifs.unshift({ 
          id: Date.now(), 
          message: `Your task "${selectedSubmission.taskId?.title}" has been graded! Grade: ${gradeData.grade}`, 
          read: false, 
          time: new Date().toLocaleTimeString() 
        });
        localStorage.setItem('studentNotifications', JSON.stringify(existingNotifs));

        setSelectedSubmission(null);
        setGradeData({ grade: '', review: '', coins: 0 });
        alert("Submission successfully graded!");
      } else {
        alert("Failed to grade submission");
      }
    } catch (error) {
      console.error("Error grading submission:", error);
      alert("Error grading submission");
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <CheckSquare className="text-[#00E5FF] w-8 h-8" />
            Task Management
          </h2>
          <p className="text-slate-400 mt-1">Assign projects, daily tasks, and monitor submissions.</p>
        </div>
        <button 
          onClick={() => setIsAssigning(true)}
          className="px-6 py-3 bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#00E5FF] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center gap-2"
        >
          <Plus size={18} /> Assign New Task
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-2 bg-[#0A192F]/60 backdrop-blur-md rounded-2xl border border-white/5 w-fit">
        {['assigned', 'submissions', 'graded'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl font-bold text-sm capitalize transition-all ${
              activeTab === tab ? 'bg-[#7C3AED] text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab} Tasks
          </button>
        ))}
      </div>

      {/* Task List */}
      {activeTab === 'assigned' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <div key={task._id || task.id || index} className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 border border-white/5 hover:border-[#00E5FF] transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-[#00E5FF]">
                  {task.course}
                </span>
                <div className="p-2 bg-white/5 rounded-xl text-slate-400 group-hover:text-[#00E5FF] group-hover:bg-[#00E5FF]/10 transition-colors">
                  <FileText size={18} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-6 leading-tight">{task.title}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-2"><Users size={16} /> Assigned</span>
                  <span className="font-bold text-white">{task.assignedTo || 0} Students</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-2"><CheckCircle2 size={16} /> Submitted</span>
                  <span className="font-bold text-emerald-400">{task.submitted || 0} Students</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full" style={{ width: `${task.assignedTo > 0 ? (task.submitted/task.assignedTo)*100 : 0}%` }}></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-400 bg-orange-400/10 px-3 py-1.5 rounded-lg border border-orange-400/20">
                  <Clock size={14} /> Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Submissions List (Pending Only) */}
      {activeTab === 'submissions' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {submissions.filter(sub => sub.status !== 'Graded').length === 0 ? (
            <div className="text-center py-10 bg-[#0A192F]/60 backdrop-blur-md rounded-3xl border border-white/5">
              <CheckSquare className="text-slate-500 w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-slate-400 font-bold text-lg">No pending submissions</p>
              <p className="text-slate-500 text-sm mt-1">When students submit tasks, they will appear here for grading.</p>
            </div>
          ) : (
            submissions.filter(sub => sub.status !== 'Graded').map((sub, index) => (
              <div key={sub._id || index} className="bg-[#0A192F]/60 backdrop-blur-md rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row justify-between gap-6 hover:border-[#00E5FF]/30 transition-all group">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#7C3AED] flex items-center justify-center font-bold text-white shadow-lg shrink-0">
                    {sub.studentId?.fullName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg flex items-center gap-2">
                      {sub.studentId?.fullName || 'Unknown Student'}
                      <span className={`px-2 py-1 text-[10px] uppercase tracking-widest rounded-md border ${sub.status === 'Graded' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                        {sub.status || 'Submitted'}
                      </span>
                    </h4>
                    <p className="text-slate-400 text-sm mt-1">Task: <span className="text-[#00E5FF] font-medium">{sub.taskId?.title || 'Unknown Task'}</span></p>
                    
                    {sub.notes && (
                      <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/5 text-sm text-slate-300">
                        <span className="text-xs text-slate-500 block mb-1 font-bold">Student Notes:</span>
                        "{sub.notes}"
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col justify-center gap-3 md:items-end min-w-[140px]">
                  <p className="text-slate-400 text-xs flex items-center gap-1">
                    <Clock size={12} /> {new Date(sub.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex flex-col gap-2 w-full">
                    {sub.fileUrl && (
                      <a 
                        href={`${API_URL.replace('/api', '')}${sub.fileUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full text-center px-4 py-2 bg-white/5 hover:bg-white/10 text-[#00E5FF] rounded-lg text-sm font-bold transition-colors"
                      >
                        View Attachment
                      </a>
                    )}
                    <button 
                      onClick={() => {
                        setSelectedSubmission(sub);
                        setGradeData({ grade: '', review: '', coins: 0 });
                      }}
                        className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-teal-500 hover:to-emerald-500 text-white rounded-lg text-sm font-bold shadow-lg transition-all"
                      >
                        Grade / Review
                      </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* Graded Tasks List */}
      {activeTab === 'graded' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {submissions.filter(sub => sub.status === 'Graded').length === 0 ? (
            <div className="text-center py-10 bg-[#0A192F]/60 backdrop-blur-md rounded-3xl border border-white/5">
              <CheckSquare className="text-slate-500 w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-slate-400 font-bold text-lg">No graded tasks yet</p>
              <p className="text-slate-500 text-sm mt-1">Graded student submissions will appear here.</p>
            </div>
          ) : (
            submissions.filter(sub => sub.status === 'Graded').map((sub, index) => (
              <div key={sub._id || index} className="bg-[#0A192F]/60 backdrop-blur-md rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row justify-between gap-6 hover:border-[#00E5FF]/30 transition-all group opacity-80 hover:opacity-100">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 shadow-lg shrink-0 border border-emerald-500/20">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg flex items-center gap-2">
                      {sub.studentId?.fullName || 'Unknown Student'}
                      <span className="px-2 py-1 text-[10px] uppercase tracking-widest rounded-md border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        Graded
                      </span>
                    </h4>
                    <p className="text-slate-400 text-sm mt-1">Task: <span className="text-emerald-400 font-medium">{sub.taskId?.title || 'Unknown Task'}</span></p>
                    
                    {sub.notes && (
                      <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/5 text-sm text-slate-300">
                        <span className="text-xs text-slate-500 block mb-1 font-bold">Student Notes:</span>
                        "{sub.notes}"
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col justify-center gap-3 md:items-end min-w-[140px]">
                  <p className="text-slate-400 text-xs flex items-center gap-1">
                    <Clock size={12} /> {new Date(sub.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex flex-col gap-2 w-full">
                    {sub.fileUrl && (
                      <a 
                        href={`${API_URL.replace('/api', '')}${sub.fileUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full text-center px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-sm font-bold transition-colors"
                      >
                        View Attachment
                      </a>
                    )}
                    <div className="w-full px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-bold text-center border border-emerald-500/20">
                      Grade: {sub.grade}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* Task Creation Modal */}
      <AnimatePresence>
        {isAssigning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0A192F] w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Plus className="text-[#00E5FF]" /> Assign New Task
                </h3>
                <button onClick={() => setIsAssigning(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAssignTask} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Task Title</label>
                  <input 
                    type="text" required
                    value={newTask.title || ""} onChange={e => setNewTask({...newTask, title: e.target.value})}
                    placeholder="e.g. Build an Obstacle Avoiding Robot"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Course</label>
                    <select 
                      required
                      value={newTask.course || ""} onChange={e => setNewTask({...newTask, course: e.target.value})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] transition-colors appearance-none"
                    >
                      <option value="">Select a Course</option>
                      {availableCourses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Due Date</label>
                    <input 
                      type="date" required
                      value={newTask.dueDate || ""} onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Task Description / Instructions</label>
                  <textarea 
                    required rows="4"
                    value={newTask.description || ""} onChange={e => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Describe what the students need to do..."
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setIsAssigning(false)} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-3 bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#00E5FF] text-white rounded-xl font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all">
                    <Send size={18} /> Assign to Students
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grading Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0A192F] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckSquare className="text-[#00E5FF]" /> Grade Submission
              </h2>

              <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-slate-400 text-sm">Student: <span className="text-white font-bold">{selectedSubmission.studentId?.fullName}</span></p>
                <p className="text-slate-400 text-sm mt-1">Task: <span className="text-white font-bold">{selectedSubmission.taskId?.title}</span></p>
              </div>

              <form onSubmit={handleGradeSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Grade / Score</label>
                  <input
                    type="text"
                    required
                    value={gradeData.grade}
                    onChange={(e) => setGradeData({...gradeData, grade: e.target.value})}
                    placeholder="e.g. A, 10/10, Excellent"
                    className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] transition-colors placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Coins to Award (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={gradeData.coins}
                    onChange={(e) => setGradeData({...gradeData, coins: parseInt(e.target.value) || 0})}
                    placeholder="e.g. 50"
                    className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] transition-colors placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Review Notes</label>
                  <textarea
                    required
                    rows="3"
                    value={gradeData.review}
                    onChange={(e) => setGradeData({...gradeData, review: e.target.value})}
                    placeholder="Provide constructive feedback..."
                    className="w-full bg-[#112240] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] transition-colors resize-none placeholder:text-slate-500"
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGrading}
                    className="flex-1 py-3 bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#00E5FF] text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
                  >
                    {isGrading ? 'Saving...' : 'Submit Grade'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InstructorTaskManagement;
