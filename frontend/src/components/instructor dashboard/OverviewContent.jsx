import React, { useState } from "react";
import { 
  Users, BookOpen, DollarSign, Star, TrendingUp, Plus, Award, 
  Target, Zap, Sparkles, Rocket, Brain, Lightbulb, Calendar,
  MessageCircle, Clock, BarChart3, Crown, Bookmark
} from "lucide-react";
import { Link } from "react-router-dom";

const OverviewContent = ({ data }) => {
  const { stats, courses, students, earnings } = data;
  const [activeTab, setActiveTab] = useState("insights");

  // Achievement badges data
  const achievements = [
    { icon: Crown, label: "Top Instructor", progress: 100, color: "from-yellow-400 to-orange-500" },
    { icon: Zap, label: "Fast Learner", progress: 80, color: "from-blue-400 to-purple-500" },
    { icon: Target, label: "Goal Crusher", progress: 65, color: "from-green-400 to-teal-500" },
    { icon: Brain, label: "Knowledge Guru", progress: 90, color: "from-purple-400 to-pink-500" }
  ];

  // Quick stats for the insight cards
  const quickStats = [
    { icon: Clock, label: "Avg. Watch Time", value: "42min", change: "+15%", trend: "up" },
    { icon: MessageCircle, label: "Student Questions", value: "24", change: "+8%", trend: "up" },
    { icon: Bookmark, label: "Course Completion", value: "78%", change: "+12%", trend: "up" },
    { icon: BarChart3, label: "Engagement Score", value: "9.2/10", change: "+5%", trend: "up" }
  ];

  return (
    <>
      {/* Enhanced Welcome Section with Personal Touch */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-12 translate-y-12"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <h2 className="text-2xl font-bold">Amazing work, Instructor! 🎉</h2>
            </div>
            <p className="text-purple-100 mb-4 text-lg">
              You've impacted <span className="font-semibold text-yellow-300">{stats.totalStudents.toLocaleString()}</span> learners this month. 
              That's <span className="font-semibold">+{Math.floor(stats.totalStudents * 0.12)}</span> new minds ignited!
            </p>
            <div className="flex gap-3">
              <Link to={"/create-course"} className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                <Plus className="w-4 h-4" />
                Create Magic Course
              </Link>
              <button className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all">
                <Rocket className="w-4 h-4" />
                Boost Performance
              </button>
            </div>
          </div>
          <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/30">
            <Award className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Interactive Stats Grid with Hover Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            value: stats.totalStudents.toLocaleString(), 
            label: "Active Learners", 
            icon: Users, 
            color: "blue",
            change: "+12%",
            description: "Growing community"
          },
          { 
            value: stats.totalCourses, 
            label: "Live Courses", 
            icon: BookOpen, 
            color: "purple",
            description: "Knowledge shared"
          },
          { 
            value: `₹${stats.totalEarnings.toLocaleString()}`, 
            label: "Total Impact", 
            icon: DollarSign, 
            color: "green",
            change: "+8%",
            description: "Value created"
          },
          { 
            value: stats.averageRating, 
            label: "Student Love", 
            icon: Star, 
            color: "yellow",
            description: "Out of 5 stars"
          }
        ].map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {stat.value}
                </p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                {stat.description && (
                  <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                )}
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            {stat.change && (
              <div className="flex items-center gap-1 mt-3">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                <span className="text-gray-400 text-xs ml-auto">this month</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Tabs for Different Views */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-4">
            {["insights", "achievements", "performance"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                  activeTab === tab
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "insights" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <div key={index} className="text-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                  <stat.icon className={`w-8 h-8 mx-auto mb-2 ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`} />
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <span className={`text-xs font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.change}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${achievement.color}`}>
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{achievement.label}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${achievement.color}`}
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{achievement.progress}% complete</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "performance" && (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Performance Insights</h4>
              <p className="text-gray-600 mb-4">Your engagement rate is 35% higher than platform average</p>
              <button className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                <BarChart3 className="w-4 h-4" />
                View Detailed Analytics
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Recent Courses with Progress Animation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Trending Courses
              </h3>
              <span className="text-sm text-purple-600 font-medium">{courses.length} active</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {courses.slice(0, 3).map((course, index) => (
              <div 
                key={course.id} 
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      index === 0 ? "bg-green-500" : 
                      index === 1 ? "bg-blue-500" : "bg-purple-500"
                    }`}></div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {course.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ₹{course.revenue}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      {course.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{course.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Recent Students with Engagement Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Active Learners
              </h3>
              <span className="text-sm text-blue-600 font-medium">{students.length} engaged</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {students.slice(0, 3).map((student, index) => (
              <div 
                key={student.id} 
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-full border-2 border-white group-hover:border-blue-200 transition-colors"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      student.progress > 80 ? "bg-green-500" : 
                      student.progress > 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {student.name}
                    </h4>
                    <p className="text-sm text-gray-600">{student.course}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Last active: {Math.floor(Math.random() * 24)}h ago
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mb-1">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{student.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Note: Revenue Momentum section has been removed as requested */}
    </>
  );
};

export default OverviewContent;