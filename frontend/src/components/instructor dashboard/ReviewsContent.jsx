import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Filter, ThumbsUp, TrendingUp, Award, Calendar, Quote, ChevronDown, Check } from "lucide-react";
import { API_URL } from "../../config/api";

const ReviewsContent = ({ instructor }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchReviews();
  }, [instructor]);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('instructorToken') || localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_URL}/instructor/reviews`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching instructor reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!instructor) return null;

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : "0.0";
  const positiveReviews = reviews.filter(r => r.rating >= 4).length;
  const positivePercentage = totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0;
  const fiveStarReviews = reviews.filter(r => r.rating === 5).length;
  const fiveStarPct = totalReviews > 0 ? Math.round((fiveStarReviews / totalReviews) * 100) : 0;

  const filteredReviews = reviews.filter(r => {
    if (filter === '5-stars') return r.rating === 5;
    if (filter === '4-stars') return r.rating === 4;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Star className="text-yellow-400 w-8 h-8 fill-yellow-400" />
            Student Feedback
          </h2>
          <p className="text-slate-400 mt-1">See what your students are saying about your courses.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10">
          <MessageSquare className="text-[#00E5FF] w-5 h-5" />
          <span className="font-black text-white">{totalReviews}</span>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Reviews</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] rounded-3xl p-6 shadow-[0_0_30px_rgba(124,58,237,0.2)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-4xl font-black text-white">{averageRating}</p>
            <div className="p-3 bg-white/10 rounded-2xl">
              <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
            </div>
          </div>
          <div className="flex gap-1 mb-3">
            {[1,2,3,4,5].map(i => <Star key={i} size={16} className={i <= Math.round(averageRating) ? "text-yellow-300 fill-yellow-300" : "text-yellow-300/30"} />)}
          </div>
          <p className="text-sm font-bold text-white/80 uppercase tracking-widest">Average Rating</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-400/10 text-emerald-400 rounded-xl">
              <ThumbsUp size={24} />
            </div>
            {totalReviews > 0 && (
              <div className="flex items-center gap-1 bg-emerald-400/10 px-2 py-1 rounded-lg">
                <TrendingUp size={12} className="text-emerald-400" />
                <span className="text-emerald-400 text-xs font-bold">+5%</span>
              </div>
            )}
          </div>
          <p className="text-3xl font-black text-white mb-1">{positivePercentage}%</p>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Positive Feedback</p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${positivePercentage}%` }}></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-400/10 text-yellow-400 rounded-xl">
              <Award size={24} />
            </div>
          </div>
          <p className="text-3xl font-black text-white mb-1">{fiveStarReviews}</p>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">5-Star Reviews</p>
          <p className="text-xs text-slate-500 mt-2">Making up {fiveStarPct}% of all reviews</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8 border-b border-white/10 pb-6">
              <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
                {[
                  { id: 'all', label: 'All Reviews' },
                  { id: '5-stars', label: '5 Stars' },
                  { id: '4-stars', label: '4 Stars' }
                ].map(f => (
                  <button 
                    key={f.id} onClick={() => setFilter(f.id)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === f.id ? 'bg-[#7C3AED] text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <select 
                  value={sortBy || ""} onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold outline-none appearance-none pr-10 cursor-pointer"
                >
                  <option value="newest" className="bg-[#0A192F]">Newest First</option>
                  <option value="highest" className="bg-[#0A192F]">Highest Rated</option>
                </select>
                <ChevronDown size={16} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="text-slate-400 text-center py-8">Loading...</div>
              ) : filteredReviews.length === 0 ? (
                <div className="text-slate-400 text-center py-8">No reviews found.</div>
              ) : filteredReviews.map(review => (
                <div key={review.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all relative group">
                  <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote size={40} className="text-white" />
                  </div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full border-2 border-[#7C3AED] bg-slate-700 flex items-center justify-center font-bold text-white text-lg">
                        {review.studentName ? review.studentName.charAt(0) : 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{review.studentName}</h4>
                        <p className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider">{review.courseName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-1 justify-end mb-1">
                        {[1,2,3,4,5].map(i => <Star key={i} size={14} className={i <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} />)}
                      </div>
                      <span className="text-xs font-bold text-slate-500">{review.date}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed relative z-10">{review.text}</p>
                  
                  <div className="flex gap-4 mt-6 pt-4 border-t border-white/10 relative z-10">
                    <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors">
                      <ThumbsUp size={14} /> Helpful
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#00E5FF] transition-colors">
                      <MessageSquare size={14} /> Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-6">
          <div className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6">Rating Distribution</h3>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map(stars => {
                const count = reviews.filter(r => r.rating === stars).length;
                const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-sm">
                    <span className="w-12 font-bold text-slate-400 flex items-center gap-1">{stars} <Star size={12} className="text-yellow-400 fill-yellow-400" /></span>
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="w-8 text-right font-bold text-white">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-3xl p-6 border border-emerald-500/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-400 rounded-xl text-slate-900 mt-1">
                <TrendingUp size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Excellent Performance</h4>
                <p className="text-sm text-emerald-200/80 leading-relaxed">
                  Your recent courses are receiving exceptionally positive feedback. Keep up the great work!
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReviewsContent;