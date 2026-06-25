import React from "react";
import { Coins, TrendingUp, Users, Calendar, Download, Filter, Award, Gift, Crown, Zap, DollarSign } from "lucide-react";

const EarningsContent = ({ data }) => {
  const { stats = { totalStudents: 0, totalCourses: 0, totalEarnings: 0 }, earnings = [], students = [] } = data;

  // Use real students as recent transactions
  const recentTransactions = students.map((s, idx) => ({
    id: s.id || idx,
    student: s.name,
    course: s.course,
    coins: stats.totalEarnings / stats.totalStudents || 0, // Approximation or actual price if we had it per enrollment
    date: s.joinDate ? new Date(s.joinDate).toLocaleDateString() : "Recent",
    type: "course_sale",
    icon: "🎓"
  }));

  // If no students yet, show empty or a few placeholders
  const earningsData = earnings.length > 0 ? earnings : [
    { month: "Jan", coins: 0, students: 0 },
    { month: "Feb", coins: 0, students: 0 },
    { month: "Mar", coins: 0, students: 0 },
    { month: "Apr", coins: 0, students: 0 },
    { month: "May", coins: 0, students: 0 },
    { month: "Jun", coins: 0, students: 0 }
  ];

  const rewardsMilestones = [
    { coins: 1000, reward: "Bronze Badge", achieved: true },
    { coins: 2500, reward: "Silver Badge", achieved: true },
    { coins: 5000, reward: "Gold Badge", achieved: true },
    { coins: 10000, reward: "Platinum Rank", achieved: false },
    { coins: 25000, reward: "Diamond Tier", achieved: false },
    { coins: 50000, reward: "Master Instructor", achieved: false }
  ];

  const calculateStats = () => {
    const currentMonth = earningsData[earningsData.length - 1];
    const previousMonth = earningsData[earningsData.length - 2];
    const growthPercentage = previousMonth ? ((currentMonth.coins - previousMonth.coins) / previousMonth.coins * 100).toFixed(1) : 0;

    const totalCoins = earningsData.reduce((sum, month) => sum + month.coins, 0);
    const averageMonthly = Math.round(totalCoins / earningsData.length);
    const totalStudents = earningsData.reduce((sum, month) => sum + month.students, 0);

    return {
      currentMonth,
      growthPercentage,
      totalCoins,
      averageMonthly,
      totalStudents
    };
  };

  const statsData = calculateStats();

  const getTransactionColor = (type) => {
    switch (type) {
      case 'course_sale': return 'text-green-600 bg-green-100';
      case 'bonus': return 'text-yellow-600 bg-yellow-100';
      case 'referral': return 'text-purple-600 bg-purple-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getTransactionLabel = (type) => {
    switch (type) {
      case 'course_sale': return 'Course Sale';
      case 'bonus': return 'Bonus';
      case 'referral': return 'Referral';
      default: return 'Reward';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Revenue & Earnings</h2>
          <p className="text-gray-600 mt-1">Track your financial growth and rewards</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
            <DollarSign className="w-4 h-4" />
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">₹{statsData.totalCoins.toLocaleString()}</p>
              <p className="text-gray-600 text-sm">Total Revenue</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-600 text-sm font-medium">All Time Growth</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">₹{statsData.currentMonth.coins.toLocaleString()}</p>
              <p className="text-gray-600 text-sm">Monthly Earnings</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-600 text-sm font-medium">+{statsData.growthPercentage}% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">₹{statsData.averageMonthly.toLocaleString()}</p>
              <p className="text-gray-600 text-sm">Avg Monthly</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-gray-600 text-sm">Monthly average income</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{statsData.totalStudents}</p>
              <p className="text-gray-600 text-sm">Paid Students</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-600 text-sm font-medium">Direct enrollment</span>
          </div>
        </div>
      </div>

      {/* Recent Rewards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Enrollments</h3>
            <span className="text-sm text-gray-600">{recentTransactions.length} sales</span>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getTransactionColor(transaction.type)}`}>
                    {transaction.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{transaction.student}</h4>
                    <p className="text-sm text-gray-600">{transaction.course}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 flex items-center gap-1 justify-end">
                    ₹{transaction.coins}
                  </p>
                  <p className="text-xs text-gray-500">{getTransactionLabel(transaction.type)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rewards & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Milestones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Milestones</h3>
            <p className="text-gray-600 text-sm mt-1">Unlock professional perks as you reach earning goals</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {rewardsMilestones.map((milestone, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${milestone.achieved ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                      {milestone.achieved ? <Crown className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{milestone.reward}</h4>
                      <p className="text-sm text-gray-600">₹{milestone.coins.toLocaleString()} Revenue Goal</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${milestone.achieved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {milestone.achieved ? 'Reached! 🎉' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown & Goals */}
        <div className="space-y-6">
          {/* Revenue Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Revenue Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Course Sales</span>
                <span className="font-semibold text-green-600">+₹4,250</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bonuses</span>
                <span className="font-semibold text-yellow-600">+₹890</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Referrals</span>
                <span className="font-semibold text-purple-600">+₹560</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-900">Withdrawable Balance</span>
                <span className="font-bold text-green-600 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ₹{statsData.totalCoins.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Next Goal */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6" />
              <h4 className="font-semibold text-lg">Next Goal</h4>
            </div>
            <p className="text-yellow-100 mb-2">Earn ₹10,000 to unlock Platinum Rank</p>
            <div className="w-full bg-yellow-200 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: `${(statsData.totalCoins / 10000) * 100}%` }}
              ></div>
            </div>
            <p className="text-yellow-100 text-sm mt-2 text-right">
              ₹{statsData.totalCoins.toLocaleString()} / ₹10,000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsContent;