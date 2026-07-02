import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Flame, TrendingUp, Search, PlusCircle, ThumbsUp, MessageCircle } from 'lucide-react';

const discussions = [
  { id: 1, title: 'Tips for Arduino memory optimization?', author: 'Alex_Robo', category: 'Hardware', comments: 24, likes: 156, time: '2 hours ago', hot: true },
  { id: 2, name: 'Understanding PID Tuning in Drones', author: 'SkyFlyer99', category: 'Theory', comments: 18, likes: 89, time: '5 hours ago', hot: false },
  { id: 3, name: 'Best sensors for line following?', author: 'NoobMaker', category: 'Sensors', comments: 45, likes: 210, time: '1 day ago', hot: true },
  { id: 4, name: 'Help: Raspberry Pi heating issue', author: 'Techie_Tom', category: 'Troubleshooting', comments: 8, likes: 12, time: '2 days ago', hot: false },
];

const Community = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <Users size={32} className="text-[#00E5FF]" /> 
          Community Hub
        </h2>
        <p className="text-slate-400 mt-2">Connect, collaborate, and grow with fellow robotics enthusiasts.</p>
      </div>
      
      <div className="flex gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search discussions..." 
            className="w-full bg-[#0A192F]/60 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
          />
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-[#00E5FF] to-[#00BFFF] hover:from-[#00BFFF] hover:to-[#00E5FF] text-[#0A192F] font-bold rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]">
          <PlusCircle size={18} /> <span className="hidden sm:inline">New Post</span>
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Main Feed */}
      <div className="xl:col-span-2 space-y-4">
        {discussions.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-[#0A192F]/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-[#00E5FF]/30 transition-colors shadow-lg group relative overflow-hidden"
          >
            {post.hot && (
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl"></div>
            )}
            
            <div className="flex gap-4">
              {/* Upvote Column */}
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <button className="hover:text-[#00E5FF] hover:-translate-y-1 transition-all"><ThumbsUp size={20} /></button>
                <span className="font-bold text-white">{post.likes}</span>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30 rounded-md">
                    {post.category}
                  </span>
                  {post.hot && (
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-orange-400">
                      <Flame size={12} /> Hot
                    </span>
                  )}
                  <span className="text-xs font-medium text-slate-500 ml-auto">{post.time}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00E5FF] transition-colors cursor-pointer">
                  {post.title || post.name}
                </h3>
                
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"></div>
                    <span className="text-slate-300">By <span className="font-bold text-white">{post.author}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
                    <MessageCircle size={14} /> {post.comments} Replies
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        <button className="w-full py-4 text-sm font-bold text-[#00E5FF] bg-[#0A192F]/40 hover:bg-[#0A192F]/80 border border-dashed border-[#00E5FF]/30 rounded-2xl transition-colors">
          Load More Discussions
        </button>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-[#1A0B2E] to-[#0A192F] p-6 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#7C3AED]/20 rounded-full blur-[40px]"></div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 relative z-10">
            <TrendingUp size={20} className="text-[#00E5FF]" /> Trending Tags
          </h3>
          <div className="flex flex-wrap gap-2 relative z-10">
            {['#Arduino', '#PID_Tuning', '#Sensors', '#RaspberryPi', '#C++', '#DroneBuild'].map((tag) => (
              <span key={tag} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium rounded-lg cursor-pointer transition-colors border border-white/5">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0A192F]/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl"
        >
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Star size={20} className="text-[#ffd700]" /> Top Contributors
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Sarah Connor', points: 4500, avatar: 'SC' },
              { name: 'Tony Stark', points: 3800, avatar: 'TS' },
              { name: 'Ada Lovelace', points: 3200, avatar: 'AL' }
            ].map((user, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#7C3AED] flex items-center justify-center font-bold text-white text-sm">
                  {user.avatar}
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{user.name}</p>
                  <p className="text-xs text-[#00E5FF]">{user.points} XP</p>
                </div>
                <div className="ml-auto text-xs font-black text-slate-500">#{i + 1}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

export default Community;
