import { API_URL, BASE_URL } from "../../config/api";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {

  Bot, BookOpen, Plus, Upload, FileText, Video,
  Edit3, Eye, Trash2, Download, Filter, Search,
  ChevronRight, Users, BarChart3, Clock, Star,
  FolderOpen, FileUp, Settings, MoreVertical
} from "lucide-react";

const initialCourses = [
  {
    title: "Introduction to Robotics",
    description: "Learn the fundamentals of robotics including mechanics, electronics, and basic programming.",
    level: "beginner",
    coins: 500,
    image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9",
    lectures: "20 Lectures",
    duration: "4 Weeks",
    projects: 5,
    learnings: ["Robot components", "Basic electronics", "Programming"]
  },
  {
    title: "Arduino Fundamentals",
    description: "Get started with Arduino programming and build your first interactive projects.",
    level: "beginner",
    coins: 600,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
    lectures: "22 Lectures",
    duration: "4 Weeks",
    projects: 6,
    learnings: ["Arduino IDE", "Digital I/O", "Sensors"]
  },
  {
    title: "Advanced AI Robotics",
    description: "Combine artificial intelligence with robotics to create intelligent, adaptive systems.",
    level: "advanced",
    coins: 2000,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
    lectures: "50 Lectures",
    duration: "12 Weeks",
    projects: 10,
    learnings: ["Machine learning", "Computer vision", "Neural networks"]
  }
];

const InstructorMyCourses = ({ data }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState("video"); // video, pdf, assignment
  const [courses, setCourses] = useState(data?.courses || []);
  const [loading, setLoading] = useState(!data);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [modules, setModules] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(false);

  const fetchModules = async (courseId) => {
    setModulesLoading(true);
    try {
      const response = await fetch(`${API_URL}/instructor/courses/${courseId}/modules`, {
        headers: { Authorization: `Bearer ${(localStorage.getItem("instructorToken") || localStorage.getItem("token"))}` }
      });
      if (response.ok) {
        const data = await response.json();
        setModules(data);
      }
    } catch (err) {
      console.error("Error fetching modules:", err);
    } finally {
      setModulesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse?.id) {
      fetchModules(selectedCourse.id);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    const token = localStorage.getItem("instructorToken") || (localStorage.getItem("instructorToken") || localStorage.getItem("token"));
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/instructor/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        let fetchedCourses = await response.json();

        if (fetchedCourses.length === 0) {
          // Seed if empty
          const user = JSON.parse(localStorage.getItem("user"));
          const seedRes = await fetch(`${API_URL}/courses/seed`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              courses: initialCourses,
              instructorId: user?.id || user?._id
            })
          });
          if (seedRes.ok) {
            const refreshRes = await fetch(`${API_URL}/instructor/courses`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            fetchedCourses = await refreshRes.json();
          }
        }

        // Standardize fields for UI
        const formattedCourses = fetchedCourses.map(c => ({
          id: c._id,
          title: c.title,
          description: c.description,
          students: c.students || 0,
          rating: c.rating || 0,
          price: c.coins || 0,
          status: c.status || "published",
          thumbnail: c.image || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
          modules: c.lectures || 0,
          createdAt: c.createdAt,
          category: c.level
        }));
        setCourses(formattedCourses);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;

    try {
      const response = await fetch(`${API_URL}/instructor/courses/${selectedCourse.id}/modules/${moduleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${(localStorage.getItem("instructorToken") || localStorage.getItem("token"))}` }
      });
      if (response.ok) {
        setModules(modules.filter(m => m._id !== moduleId));
      }
    } catch (err) {
      console.error("Error deleting module:", err);
    }
  };

  const handleEditClick = () => {
    setEditFormData({
      title: selectedCourse.title || "",
      description: selectedCourse.description || "",
      coins: selectedCourse.price || 0,
      level: selectedCourse.category || "beginner",
      image: selectedCourse.thumbnail || ""
    });
    setIsEditing(true);
  };

  const handleUpdateCourse = async () => {
    const token = localStorage.getItem("instructorToken") || (localStorage.getItem("instructorToken") || localStorage.getItem("token"));
    try {
      const response = await fetch(`${API_URL}/instructor/courses/${selectedCourse.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      if (response.ok) {
        const updated = await response.json();
        alert("Course updated successfully!");
        // Refresh local state
        setCourses(courses.map(c => c.id === selectedCourse.id ? {
          ...c,
          title: updated.title,
          description: updated.description,
          price: updated.coins,
          category: updated.level,
          thumbnail: updated.image || c.thumbnail
        } : c));
        setSelectedCourse({
          ...selectedCourse,
          title: updated.title,
          description: updated.description,
          price: updated.coins,
          category: updated.level,
          thumbnail: updated.image || selectedCourse.thumbnail
        });
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => c.status === "published").length,
    totalStudents: courses.reduce((sum, course) => sum + (course.students || 0), 0),
    totalEarnings: courses.reduce((sum, course) => sum + ((course.price || 0) * (course.students || 0)), 0)
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || course.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabs = [
    { id: "all", label: "All Courses" },
    { id: "published", label: "Published" },
    { id: "draft", label: "Draft" },
  ];

  // Upload Modal Component
  const UploadModal = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
      if (!title || !file) {
        alert("Please provide a title and select a file");
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", uploadType);
      formData.append(uploadType, file); // uploadType is 'video' or 'pdf'

      try {
        const response = await fetch(`${API_URL}/instructor/courses/${selectedCourse.id}/modules/${uploadType}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${(localStorage.getItem("instructorToken") || localStorage.getItem("token"))}`
          },
          body: formData
        });

        if (response.ok) {
          const newModule = await response.json();
          setModules([...modules, newModule]);
          setShowUploadModal(false);
          alert("Module uploaded successfully!");
        } else {
          const error = await response.json();
          alert(error.message || "Upload failed");
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Error connecting to server");
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Add New {uploadType === "video" ? "Video" : "PDF Notes"}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title || ""}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${uploadType} title`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {uploadType === "video" ? "Video File" : "PDF File"}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center">
                {file ? (
                  <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
                    {uploadType === "video" ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <button onClick={() => setFile(null)} className="text-red-500 text-xs ml-2 hover:underline">Change</button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Select {uploadType} to upload</p>
                    <input
                      type="file"
                      accept={uploadType === "video" ? "video/*" : ".pdf"}
                      className="hidden"
                      id="file-upload"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <label htmlFor="file-upload" className="inline-block mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm cursor-pointer hover:bg-blue-100 transition-colors">
                      Choose File
                    </label>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows="3"
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Optional description..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Uploading...
                  </>
                ) : `Upload ${uploadType.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[85vh] bg-gray-50 flex flex-col p-4">
      <header className="bg-white shadow-sm border-b border-gray-200 mb-4 rounded-xl">
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

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Side - Courses List */}
          <div className="lg:col-span-2 overflow-y-auto pr-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="relative w-48">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCourses.length === 0 ? (
                      <div className="text-center py-12 col-span-full">
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
                      filteredCourses.map((course) => (
                        <div
                          key={course.id}
                          onClick={() => { setSelectedCourse(course); setIsEditing(false); }}
                          className={`group cursor-pointer rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md ${selectedCourse?.id === course.id ? 'ring-2 ring-blue-500 border-transparent' : ''}`}
                        >
                          <div className="relative h-28 overflow-hidden">
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${course.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {course.status}
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-1">{course.title}</h3>
                            <p className="text-gray-600 text-[11px] mb-2 line-clamp-2">{course.description}</p>
                            <div className="flex items-center justify-between text-[10px] text-gray-500">
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1"><Users className="w-2.5 h-2.5" />{course.students}</span>
                                <span className="flex items-center gap-1"><Star className="w-2.5 h-2.5 text-yellow-400" />{course.rating}</span>
                              </div>
                              <span className="font-bold text-blue-600">{course.price} Coins</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-y-auto pr-2">
            {selectedCourse ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Course Management</h3>
                    {!isEditing && (
                      <button
                        onClick={handleEditClick}
                        className="text-blue-600 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="p-5 space-y-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                            value={editFormData.title || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                          <textarea
                            className="w-full px-3 py-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            value={editFormData.description || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Price (Coins)</label>
                            <input
                              type="number"
                              className="w-full px-3 py-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                              value={editFormData.coins || 0}
                              onChange={(e) => setEditFormData({ ...editFormData, coins: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Level</label>
                            <select
                              className="w-full px-3 py-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                              value={editFormData.level || "beginner"}
                              onChange={(e) => setEditFormData({ ...editFormData, level: e.target.value })}
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase">Image URL</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                            value={editFormData.image || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleUpdateCourse}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all"
                          >
                            Update Course
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-bold text-gray-900 leading-tight">{selectedCourse.title}</h4>
                          <p className="text-gray-600 text-xs mt-2 leading-relaxed">{selectedCourse.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-100">
                          <div>
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Students</span>
                            <p className="font-semibold text-gray-900">{selectedCourse.students}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Earnings</span>
                            <p className="font-semibold text-green-600">{selectedCourse.price * selectedCourse.students} C</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${selectedCourse.category === 'beginner' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {selectedCourse.category}
                          </span>
                          <span className="text-lg font-bold text-blue-600">{selectedCourse.price} Coins</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

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
                          <div key={module._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${module.type === "video" ? "bg-blue-100" : "bg-green-100"}`}>
                                {module.type === "video" ? (
                                  <Video className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <FileText className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{module.title}</h5>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span>{module.type.toUpperCase()}</span>
                                  {module.description && <span className="truncate max-w-[150px]">{module.description}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={`${BASE_URL}${module.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="View Content"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleDeleteModule(module._id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete Module"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Select a course to edit</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {showUploadModal && <UploadModal />}
    </div>
  );
};

export default InstructorMyCourses;
