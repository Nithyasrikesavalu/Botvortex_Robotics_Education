import React, { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Users,
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  Mail,
  Eye,
  Download,
  UserCheck,
  TrendingUp
} from "lucide-react";

const StudentsContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // ---------- SAMPLE DATA (EXPANDED) ----------
  const students = [
    {
      id: 1,
      fullName: "Nithya",
      email: "nithya@gmail.com",
      enrolledCourse: "React",
      progress: 76,
      joinDate: "2024-01-10",
      lastActive: "2 hours ago",
      badges: ["Top Performer", "Fast Learner"],
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      id: 2,
      fullName: "Ravanesh",
      email: "ravanesh@gmail.com",
      enrolledCourse: "Node.js",
      progress: 60,
      joinDate: "2024-02-15",
      lastActive: "1 day ago",
      badges: ["Consistency Star"],
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
      id: 3,
      fullName: "Akash",
      email: "akash@gmail.com",
      enrolledCourse: "React",
      progress: 92,
      joinDate: "2024-03-22",
      lastActive: "30 minutes ago",
      badges: ["Top Performer", "Certificate Holder"],
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      id: 4,
      fullName: "Anitha",
      email: "anitha@gmail.com",
      enrolledCourse: "Python",
      progress: 48,
      joinDate: "2024-01-05",
      lastActive: "5 days ago",
      badges: [],
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      id: 5,
      fullName: "Praveen",
      email: "praveen@gmail.com",
      enrolledCourse: "MongoDB",
      progress: 85,
      joinDate: "2024-02-01",
      lastActive: "10 minutes ago",
      badges: ["Badge Champion"],
      avatar: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    {
      id: 6,
      fullName: "Divya",
      email: "divya@gmail.com",
      enrolledCourse: "React",
      progress: 55,
      joinDate: "2024-01-28",
      lastActive: "4 hours ago",
      badges: [],
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 7,
      fullName: "Vikram",
      email: "vikram@gmail.com",
      enrolledCourse: "Node.js",
      progress: 33,
      joinDate: "2024-03-30",
      lastActive: "2 days ago",
      badges: ["Starter Badge"],
      avatar: "https://randomuser.me/api/portraits/men/33.jpg"
    },
    {
      id: 8,
      fullName: "Harini",
      email: "harini@gmail.com",
      enrolledCourse: "MongoDB",
      progress: 100,
      joinDate: "2024-01-12",
      lastActive: "Completed",
      badges: ["Certificate Holder", "Top Performer"],
      avatar: "https://randomuser.me/api/portraits/women/28.jpg"
    },
    {
      id: 9,
      fullName: "Sanjay",
      email: "sanjay@gmail.com",
      enrolledCourse: "Python",
      progress: 10,
      joinDate: "2024-04-01",
      lastActive: "7 days ago",
      badges: [],
      avatar: "https://randomuser.me/api/portraits/men/55.jpg"
    },
  ];

  // ---------- FILTER + SEARCH ----------
  const filteredStudents = students
    .filter((student) => {
      const searchMatch =
        (student.fullName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (student.email || "").toLowerCase().includes(searchTerm.toLowerCase());

      const courseMatch =
        selectedCourse === "all" ||
        student.enrolledCourse === selectedCourse;

      return searchMatch && courseMatch;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? (a.fullName || "").localeCompare(b.fullName || "")
          : (b.fullName || "").localeCompare(a.fullName || "");
      }

      if (sortBy === "progress") {
        return sortOrder === "asc"
          ? a.progress - b.progress
          : b.progress - a.progress;
      }

      if (sortBy === "joinDate") {
        return sortOrder === "asc"
          ? new Date(a.joinDate) - new Date(b.joinDate)
          : new Date(b.joinDate) - new Date(a.joinDate);
      }

      return 0;
    });

  const courses = ["all", ...new Set(students.map((s) => s.enrolledCourse))];

  // Progress color based on percentage
  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
          <p className="text-gray-600 mt-1">Manage and track your students' progress</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              <p className="text-gray-600 text-sm">Total Students</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-600 text-sm font-medium">+12% this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(students.reduce((acc, student) => acc + student.progress, 0) / students.length)}%
              </p>
              <p className="text-gray-600 text-sm">Avg Progress</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {students.filter(s => s.progress === 100).length}
              </p>
              <p className="text-gray-600 text-sm">Completed</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {students.filter(s => s.lastActive.includes("hour") || s.lastActive.includes("minute")).length}
              </p>
              <p className="text-gray-600 text-sm">Active Now</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          
          {/* Course Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {courses.map(course => (
                <option key={course} value={course}>{course === "all" ? "All Courses" : course}</option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="progress">Sort by Progress</option>
              <option value="joinDate">Sort by Join Date</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            {/* Student Header */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={student.avatar}
                alt={student.fullName}
                className="w-12 h-12 rounded-full border-2 border-purple-200"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{student.fullName}</h3>
                <p className="text-gray-600 text-sm">{student.email}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Course Info */}
            <div className="flex items-center gap-2 mb-3 text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">{student.enrolledCourse}</span>
            </div>

            {/* Badges */}
            {student.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {student.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                  >
                    <Award className="w-3 h-3" />
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Course Progress</span>
                <span className="font-semibold">{student.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className={`h-2 rounded-full ${getProgressColor(student.progress)}`}
                  style={{ width: `${student.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {student.lastActive}
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {student.joinDate}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default StudentsContent;