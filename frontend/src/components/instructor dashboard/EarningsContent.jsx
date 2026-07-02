import React from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Users, Calendar, Download, Filter, Award, Crown, ArrowUpRight, CheckCircle2 } from "lucide-react";

const EarningsContent = ({ instructor }) => {
  if (!instructor) return null;
  const { stats } = instructor;

  const earningsData = {
    totalRevenue: stats.totalEarnings,
    currentMonth: 1250,
    averageMonthly: 980,
    growthPercentage: 15.4
  };

  const recentTransactions = [
    { id: 1, student: "Sarah Johnson", course: "Advanced AI Robotics", amount: 1999, date: "Today, 10:30 AM", type: "course_sale" },
    { id: 2, student: "Michael Chen", course: "IoT Systems", amount: 1499, date: "Yesterday, 3:15 PM", type: "course_sale" },
    { id: 3, student: "Platform Bonus", course: "Top Rated Instructor", amount: 500, date: "Oct 15", type: "bonus" },
  ];

  const milestones = [
    { target: 5000, reward: "Silver Instructor Badge", achieved: true },
    { target: 10000, reward: "Gold Tier & 5% Bonus", achieved: false },
    { target: 25000, reward: "Platinum Elite Status", achieved: false },
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <DollarSign className="text-emerald-400 w-8 h-8" />
            Revenue & Earnings
          </h2>
          <p className="text-slate-400 mt-1">Track your financial growth, payouts, and milestones.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-white/10 transition-colors">
            <Filter size={18} /> Filter
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 px-6 py-2.5 rounded-xl font-black hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all">
            <DollarSign size={18} /> Withdraw Funds
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 border border-white/5 hover:border-emerald-400/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-400/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
              <DollarSign size={24} />
            </div>
            <div className="flex items-center gap-1 bg-emerald-400/10 px-2 py-1 rounded-lg">
              <TrendingUp size={12} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-bold">+12%</span>
            </div>
          </div>
          <p className="text-3xl font-black text-white mb-1">₹{earningsData.totalRevenue.toLocaleString()}</p>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Revenue</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 border border-white/5 hover:border-[#00E5FF]/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#00E5FF]/10 text-[#00E5FF] rounded-xl group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
            <div className="flex items-center gap-1 bg-emerald-400/10 px-2 py-1 rounded-lg">
              <TrendingUp size={12} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-bold">+{earningsData.growthPercentage}%</span>
            </div>
          </div>
          <p className="text-3xl font-black text-white mb-1">₹{earningsData.currentMonth.toLocaleString()}</p>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">This Month</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 border border-white/5 hover:border-[#7C3AED]/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#7C3AED]/10 text-[#7C3AED] rounded-xl group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-3xl font-black text-white mb-1">₹{earningsData.averageMonthly.toLocaleString()}</p>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Avg Monthly</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 border border-white/5 hover:border-blue-400/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-400/10 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <div className="flex items-center gap-1 bg-emerald-400/10 px-2 py-1 rounded-lg">
              <TrendingUp size={12} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-bold">+45</span>
            </div>
          </div>
          <p className="text-3xl font-black text-white mb-1">{stats.totalStudents}</p>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Paid Students</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ArrowUpRight className="text-emerald-400" /> Recent Earnings
            </h3>
            <span className="text-sm font-bold text-[#00E5FF] hover:underline cursor-pointer">View All</span>
          </div>
          
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl shadow-lg ${tx.type === 'bonus' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-emerald-400/20 text-emerald-400'}`}>
                    {tx.type === 'bonus' ? <Crown size={20} /> : <DollarSign size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{tx.student}</h4>
                    <p className="text-xs text-slate-400">{tx.course}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-lg text-emerald-400">+₹{tx.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="text-yellow-400" /> Revenue Milestones
            </h3>
          </div>

          <div className="space-y-6">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg z-10 relative shadow-lg
                    ${milestone.achieved ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-900' : 'bg-slate-800 text-slate-500 border border-white/10'}`}
                  >
                    {milestone.achieved ? <CheckCircle2 size={20} /> : <Award size={20} />}
                  </div>
                  {idx !== milestones.length - 1 && (
                    <div className={`absolute top-10 bottom-[-24px] left-1/2 -translate-x-1/2 w-[2px] 
                      ${milestones[idx+1].achieved ? 'bg-emerald-400' : 'bg-slate-800'}`}></div>
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`font-bold ${milestone.achieved ? 'text-white' : 'text-slate-400'}`}>{milestone.reward}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${milestone.achieved ? 'bg-emerald-400/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      ₹{milestone.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-emerald-400 to-teal-400`}
                      style={{ width: milestone.achieved ? '100%' : `${(earningsData.totalRevenue / milestone.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="font-bold text-white mb-4">Revenue Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold">Course Sales</span>
                <span className="text-emerald-400 font-bold">+₹4,250</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold">Bonuses</span>
                <span className="text-yellow-400 font-bold">+₹890</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsContent;