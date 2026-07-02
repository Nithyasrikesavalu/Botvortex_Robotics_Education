import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Send, BookOpen, Clock, ThumbsUp } from 'lucide-react';
import { API_URL } from '../../config/api';

const Reviews = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [myReviews, setMyReviews] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Fetch enrolled courses for the dropdown
      const coursesRes = await fetch(`${API_URL}/student/courses`, { headers });
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setEnrolledCourses(coursesData);
        if (coursesData.length > 0) {
            setSelectedCourse(coursesData[0].courseId);
        }
      }

      // Fetch past reviews
      const reviewsRes = await fetch(`${API_URL}/student/reviews`, { headers });
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setMyReviews(reviewsData.map(r => ({
          id: r._id,
          course: r.courseTitle,
          rating: r.rating,
          date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          text: r.text,
          helpful: r.helpful || 0
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedCourse || rating === 0 || !reviewText.trim()) {
      setMessage('Please select a course, provide a rating, and write your feedback.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/student/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          rating,
          text: reviewText
        })
      });

      if (response.ok) {
        setMessage('Review submitted successfully!');
        setRating(0);
        setReviewText('');
        fetchData(); // Refresh list
      } else {
        const data = await response.json();
        setMessage(data.message || 'Error submitting review.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage('Server error submitting review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <MessageSquare size={32} className="text-[#00BFFF]" /> 
          Course Reviews
        </h2>
        <p className="text-slate-400 mt-2">Share your learning experience and read feedback from others.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Write a Review Section */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0A192F]/60 backdrop-blur-md p-6 rounded-3xl border border-[#00BFFF]/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00BFFF]/10 rounded-full blur-[40px]"></div>
            
            <h3 className="text-xl font-bold text-white mb-6 relative z-10">Write a Review</h3>
            
            <div className="space-y-5 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Course</label>
                {enrolledCourses.length > 0 ? (
                  <select 
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00BFFF]/50 transition-colors appearance-none"
                  >
                    {enrolledCourses.map(course => (
                      <option key={course._id} value={course.courseId}>{course.title}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-slate-500">
                    No enrolled courses found.
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={28} 
                      className={`cursor-pointer transition-colors ${
                        star <= (hoverRating || rating) ? 'fill-[#ffd700] text-[#ffd700]' : 'text-slate-600'
                      }`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Feedback</label>
                <textarea 
                  rows="4" 
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you like or dislike about this course?"
                  className="w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00BFFF]/50 transition-colors resize-none"
                ></textarea>
              </div>

              {message && (
                <div className={`text-sm ${message.includes('successfully') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {message}
                </div>
              )}

              <button 
                onClick={handleSubmitReview}
                disabled={submitting || enrolledCourses.length === 0}
                className="w-full py-3 bg-gradient-to-r from-[#00E5FF] to-[#00BFFF] hover:from-[#00BFFF] hover:to-[#00E5FF] text-[#0A192F] font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] disabled:opacity-50"
              >
                <Send size={18} /> {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* My Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen size={24} className="text-[#7C3AED]" /> My Past Reviews
          </h3>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-slate-400 py-8 text-center animate-pulse">Loading reviews...</div>
            ) : myReviews.length === 0 ? (
              <div className="text-slate-400 py-8 text-center border border-dashed border-white/10 rounded-2xl">
                You haven't submitted any reviews yet.
              </div>
            ) : myReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="bg-[#0A192F]/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors shadow-lg group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-[#00E5FF] transition-colors">{review.course}</h4>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mt-1">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {review.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-[#ffd700]/10 px-3 py-1.5 rounded-lg border border-[#ffd700]/20">
                    <Star size={16} className="fill-[#ffd700] text-[#ffd700]" />
                    <span className="font-bold text-[#ffd700]">{review.rating}.0</span>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  "{review.text}"
                </p>
                
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <ThumbsUp size={14} className="text-emerald-400" />
                  <span>{review.helpful} people found this helpful</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reviews;
