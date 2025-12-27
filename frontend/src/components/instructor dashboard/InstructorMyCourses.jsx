import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bot, BookOpen, Plus, Upload, FileText, Video, 
  Edit3, Eye, Trash2, Download, Filter, Search, 
  ChevronRight, Users, BarChart3, Clock, Star,
  FolderOpen, FileUp, Image, Settings, MoreVertical
} from "lucide-react";

const InstructorMyCourses = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState("video"); // video, pdf, assignment

  // Mock courses data
  const courses = [
    {
      id: 1,
      title: "Advanced React Development",
      description: "Master React with advanced patterns and best practices",
      students: 324,
      rating: 4.9,
      price: 89.99,
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      modules: 12,
      progress: 85,
      createdAt: "2024-01-15",
      category: "Web Development"
    },
    {
      id: 2,
      title: "Node.js Backend Mastery",
      description: "Build scalable backend applications with Node.js",
      students: 287,
      rating: 4.7,
      price: 79.99,
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
      modules: 8,
      progress: 92,
      createdAt: "2024-01-10",
      category: "Backend Development"
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      description: "Learn design principles and create stunning interfaces",
      students: 156,
      rating: 4.8,
      price: 69.99,
      status: "draft",
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
      modules: 6,
      progress: 45,
      createdAt: "2024-01-20",
      category: "Design"
    },
    {
      id: 4,
      title: "Python for Data Science",
      description: "Data analysis and machine learning with Python",
      students: 0,
      rating: 0,
      price: 94.99,
      status: "draft",
      thumbnail: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=250&fit=crop",
      modules: 0,
      progress: 0,
      createdAt: "2024-01-25",
      category: "Data Science"
    }
  ];

  // Mock modules data for selected course
  const modules = selectedCourse ? [
    {
      id: 1,
      title: "Introduction to React",
      type: "video",
      duration: "15:30",
      resources: 3,
      studentsCompleted: 287,
      order: 1,
      status: "published"
    },
    {
      id: 2,
      title: "React Components Deep Dive",
      type: "video",
      duration: "22:15",
      resources: 2,
      studentsCompleted: 254,
      order: 2,
      status: "published"
    },
    {
      id: 3,
      title: "State Management Guide",
      type: "pdf",
      duration: "45 pages",
      resources: 1,
      studentsCompleted: 198,
      order: 3,
      status: "published"
    },
    {
      id: 4,
      title: "Advanced Hooks Workshop",
      type: "video",
      duration: "18:45",
      resources: 4,
      studentsCompleted: 0,
      order: 4,
      status: "draft"
    }
  ] : [];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || course.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => c.status === "published").length,
    totalStudents: courses.reduce((sum, course) => sum + course.students, 0),
    totalEarnings: courses.reduce((sum, course) => sum + (course.price * course.students * 0.7), 0) // 70% instructor share
  };

  // Upload Modal Component
  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Add New {uploadType === "video" ? "Video" : uploadType === "pdf" ? "PDF Notes" : "Assignment"}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Enter ${uploadType} title`}
            />
          </div>

          {uploadType === "video" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Drag & drop video file or click to browse</p>
                <input type="file" accept="video/*" className="hidden" id="video-upload" />
                <label htmlFor="video-upload" className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm cursor-pointer">
                  Choose Video
                </label>
              </div>
            </div>
          )}

          {uploadType === "pdf" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload PDF notes or study material</p>
                <input type="file" accept=".pdf" className="hidden" id="pdf-upload" />
                <label htmlFor="pdf-upload" className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm cursor-pointer">
                  Choose PDF
                </label>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add description..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowUploadModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Upload {uploadType === "video" ? "Video" : uploadType === "pdf" ? "PDF" : "Assignment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Link to="/instructor-dashboard" className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900"> Courses Management</span>
              </Link>
            </div>
            
            <Link 
              to="/create-course"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Create New Course
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                <p className="text-gray-600 text-sm">Total Courses</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedCourses}</p>
                <p className="text-gray-600 text-sm">Published</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                <p className="text-gray-600 text-sm">Total Students</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toFixed(0)}</p>
                <p className="text-gray-600 text-sm">Total Earnings</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Courses List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Header with Search and Filters */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      {["all", "published", "draft"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-3 py-1 text-sm rounded-md capitalize transition-all ${
                            activeTab === tab
                              ? "bg-white text-blue-600 shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                    />
                  </div>
                </div>
              </div>

              {/* Courses Grid */}
              <div className="p-6">
                {filteredCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-600 mb-4">Create your first course to get started</p>
                    <Link 
                      to="/create-course"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Create Course
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className={`border rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                          selectedCourse?.id === course.id 
                            ? "border-blue-500 ring-2 ring-blue-100" 
                            : "border-gray-200"
                        }`}
                        onClick={() => setSelectedCourse(course)}
                      >
                        <div className="relative">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                            course.status === "published" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {course.status}
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {course.students}
                              </span>
                              <span className="flex items-center gap-1">
                                <FolderOpen className="w-3 h-3" />
                                {course.modules}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                {course.rating}
                              </span>
                            </div>
                            <span className="font-semibold text-green-600">${course.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Course Details & Modules */}
          <div className="space-y-6">
            {selectedCourse ? (
              <>
                {/* Course Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Course Details</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{selectedCourse.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{selectedCourse.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <p className="font-medium">{selectedCourse.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <p className="font-medium text-green-600">${selectedCourse.price}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Students:</span>
                        <p className="font-medium">{selectedCourse.students}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Rating:</span>
                        <p className="font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          {selectedCourse.rating}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <Edit3 className="w-4 h-4" />
                        Edit Course
                      </button>
                      <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modules Management */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Course Modules</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setShowUploadModal(true); setUploadType("video"); }}
                          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          Add Video
                        </button>
                        <button 
                          onClick={() => { setShowUploadModal(true); setUploadType("pdf"); }}
                          className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          Add PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {modules.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No modules yet</h4>
                        <p className="text-gray-600 mb-4">Start by adding your first module</p>
                        <button 
                          onClick={() => { setShowUploadModal(true); setUploadType("video"); }}
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add First Module
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {modules.map((module) => (
                          <div key={module.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                module.type === "video" ? "bg-blue-100" : "bg-green-100"
                              }`}>
                                {module.type === "video" ? (
                                  <Video className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <FileText className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{module.title}</h5>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span>{module.duration}</span>
                                  <span>{module.resources} resources</span>
                                  <span>{module.studentsCompleted} students completed</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Empty State when no course selected */
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Course</h3>
                <p className="text-gray-600">Choose a course from the list to view and manage its content</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && <UploadModal />}
    </div>
  );
};

export default InstructorMyCourses;