import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/api';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, CheckCircle, ArrowRight, Upload, X } from 'lucide-react';

// Tasks will be generated dynamically based on enrolled courses

const TaskAssignmentHub = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('all');

  // Modal State
  const [selectedTask, setSelectedTask] = useState(null);
  const [feedbackTask, setFeedbackTask] = useState(null); // For viewing grades
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract course titles from enrolled courses, or default to dummy data if empty/undefined
  const userCourses = user?.enrolledCourses?.length > 0 
    ? user.enrolledCourses.map(c => typeof c === 'object' ? (c.title || c.course?.title) : c) 
    : ["Introduction to Robotics", "Embedded Systems 101"]; // Dummy fallback

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/tasks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const allTasks = await response.json();
          // Filter tasks to ONLY include those where the student has bought the corresponding course
          const myTasks = allTasks.filter(task => userCourses.includes(task.course));
          
          // Map to UI format
          const formatted = myTasks.map((t, index) => ({
            id: t._id,
            title: t.title,
            course: t.course,
            addedDate: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
            dueDate: new Date(t.dueDate).toLocaleDateString(),
            priority: "High",
            status: t.status || "Pending",
            progress: t.progress || 0,
            description: t.description || "Complete the assigned task.",
            grade: t.grade || null,
            review: t.review || null,
            coinsAwarded: t.coinsAwarded || 0,
            fileUrl: t.fileUrl || null
          }));
          setTasks(formatted);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const handleTaskClick = (task) => {
    if (task.status === 'Submitted' || task.status === 'Completed') return; 
    if (task.status === 'Graded') {
      setFeedbackTask(task);
      return;
    }
    setSelectedTask(task);
    setNotes('');
    setFile(null);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setNotes('');
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('notes', notes);
    if (file) {
      formData.append('taskPdf', file);
    }

    try {
      const response = await fetch(`${API_URL}/tasks/${selectedTask.id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData // Note: no Content-Type header when using FormData
      });

      if (response.ok) {
        // Update task status locally
        setTasks(prev => prev.map(t => 
          t.id === selectedTask.id ? { ...t, status: 'Completed', progress: 100 } : t
        ));
        alert('Task submitted successfully!');
        handleCloseModal();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to submit task.');
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimCoins = async () => {
    if (!feedbackTask) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tasks/${feedbackTask.id}/claim-coins`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Update local tasks state
        setTasks(prev => prev.map(t => t.id === feedbackTask.id ? { ...t, coinsClaimed: true } : t));
        setFeedbackTask(prev => ({ ...prev, coinsClaimed: true }));
        
        // Update global user coins in localStorage
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        stored.coins = data.coins;
        localStorage.setItem('user', JSON.stringify(stored));
        
        alert(`Successfully claimed ${feedbackTask.coinsAwarded} coins!`);
        // Optional: reload to immediately reflect in navbar if needed, but alerting is fine.
        window.location.reload(); 
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to claim coins');
      }
    } catch (error) {
      console.error(error);
      alert('Error claiming coins');
    }
  };

  const uniqueDates = [...new Set(tasks.map(t => t.addedDate))].sort((a, b) => new Date(b) - new Date(a));
  const displayedTasks = selectedDate === 'all' ? tasks : tasks.filter(t => t.addedDate === selectedDate);

  return (
    <div className="mb-10">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-2 h-6 bg-[#00BFFF] rounded-full"></div>
          Task & Assignment Hub
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Added Date:</span>
          <select 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#0A192F] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-[#00E5FF] font-medium focus:outline-none focus:border-[#00E5FF]/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Dates</option>
            {uniqueDates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedTasks.length > 0 ? (
          displayedTasks.map((task, index) => (
            <motion.div
              key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={() => handleTaskClick(task)}
            className={`bg-[#0A192F]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 transition-colors shadow-lg relative overflow-hidden group ${(task.status === 'Pending' || task.status === 'Graded') ? 'cursor-pointer hover:bg-[#112240]' : 'hover:bg-[#0A192F]/80'}`}
          >
            {/* Priority Indicator */}
            <div className={`absolute top-0 left-0 w-1 h-full ${
              task.status === 'Graded' ? 'bg-emerald-500' :
              task.status === 'Submitted' || task.status === 'Completed' ? 'bg-teal-500' :
              task.priority === 'High' ? 'bg-red-500' : 
              task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
            }`} />

            <div className="flex justify-between items-start mb-3 pl-2">
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                task.status === 'Graded' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                task.status === 'Submitted' || task.status === 'Completed' ? 'bg-teal-500/20 text-teal-400 border border-teal-500/20' :
                'bg-blue-500/20 text-blue-400 border border-blue-500/20'
              }`}>
                {task.status === 'Completed' ? 'Submitted' : task.status}
              </span>
              
              {task.status === 'Graded' ? (
                <CheckCircle size={18} className="text-emerald-500" />
              ) : task.status === 'Submitted' || task.status === 'Completed' ? (
                <CheckCircle size={18} className="text-teal-500" />
              ) : (
                <AlertCircle size={18} className={
                  task.priority === 'High' ? 'text-red-500' : 
                  task.priority === 'Medium' ? 'text-yellow-500' : 'text-blue-500'
                } />
              )}
            </div>

            <div className="pl-2">
              <h3 className="text-lg font-bold text-white mb-1 leading-tight group-hover:text-[#00E5FF] transition-colors">
                {task.title}
              </h3>
              <p className="text-xs text-slate-400 mb-5">{task.course}</p>

              <div className="flex items-center gap-4 text-xs text-slate-300 font-medium mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#7C3AED]" />
                  {task.dueDate}
                </div>
              </div>

              {/* Progress Bar */}
              {(task.status === 'Pending') && (
                <div>
                  <div className="flex justify-between text-[10px] mb-1 font-bold text-slate-400">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00E5FF] to-[#00BFFF] rounded-full"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {(task.status === 'Submitted' || task.status === 'Completed') && (
                <div className="w-full py-2 bg-teal-500/10 text-teal-400 text-xs font-bold rounded-lg text-center border border-teal-500/20">
                  Waiting for Grade
                </div>
              )}

              {task.status === 'Graded' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setFeedbackTask(task); }}
                  className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg transition-colors border border-emerald-500/20"
                >
                  View Feedback & Grade
                </button>
              )}
            </div>
          </motion.div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-slate-400 bg-white/5 rounded-2xl border border-white/5">
            <Calendar size={32} className="mx-auto mb-3 text-slate-500" />
            <p className="font-medium text-white">No active tasks</p>
            <p className="text-sm mt-1">Enroll in a course to see your daily assignments here.</p>
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060D1A]/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0A192F] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
          >
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold text-white mb-2">Submit Task</h3>
            <p className="text-sm text-[#00E5FF] mb-6">{selectedTask.title}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Task Notes</label>
                <textarea 
                  required
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Describe your work or any challenges..."
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7C3AED] h-24 resize-none"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Attachment (PDF)</label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-[#00E5FF]/50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={e => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                  {file ? (
                    <p className="text-[#00E5FF] text-sm font-medium">{file.name}</p>
                  ) : (
                    <p className="text-slate-400 text-sm">Click to upload your PDF file</p>
                  )}
                </div>
              </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#00E5FF] text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                </button>

            </form>
          </motion.div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060D1A]/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0A192F] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl relative"
          >
            <button onClick={() => setFeedbackTask(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle size={24} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Task Graded!</h3>
                <p className="text-sm text-[#00E5FF]">{feedbackTask.title}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Grade Received</p>
                <p className="text-3xl font-bold text-emerald-400">{feedbackTask.grade || 'N/A'}</p>
              </div>

              {feedbackTask.coinsAwarded > 0 && (
                <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="block text-sm text-amber-400 font-bold mb-1">Coins Awarded</span>
                    <span className="text-2xl font-bold text-amber-400">+{feedbackTask.coinsAwarded} 🪙</span>
                  </div>
                  {feedbackTask.coinsClaimed ? (
                    <button disabled className="px-4 py-2 bg-amber-500/20 text-amber-500 text-sm font-bold rounded-lg cursor-not-allowed border border-amber-500/20">
                      Claimed ✅
                    </button>
                  ) : (
                    <button 
                      onClick={handleClaimCoins}
                      className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 text-sm font-black rounded-lg shadow-lg hover:scale-105 transition-transform"
                    >
                      Claim Coins!
                    </button>
                  )}
                </div>
              )}

              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Instructor Feedback</p>
                <p className="text-sm text-slate-300 italic">"{feedbackTask.review || 'No additional feedback provided.'}"</p>
              </div>
            </div>

            <button 
              onClick={() => setFeedbackTask(null)}
              className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors border border-white/10"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TaskAssignmentHub;
