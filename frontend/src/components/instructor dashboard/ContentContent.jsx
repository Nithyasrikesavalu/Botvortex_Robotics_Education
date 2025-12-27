import React, { useState } from "react";
import { Video, FileText, FileCheck, Upload, Plus, FolderOpen, Image, PlayCircle, Download, Trash2, Edit3, X, File, Film, BookOpen, Search, Filter, Eye } from "lucide-react";

const ContentContent = () => {
  const [activeContentType, setActiveContentType] = useState("pdfs");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  const courses = [
    "Advanced React Development",
    "JavaScript Mastery",
    "Python for Beginners",
    "Web Design Fundamentals",
    "Data Science Essentials"
  ];

  const contentTypes = [
    { id: "videos", label: "Videos", icon: Video, color: "blue", accept: "video/*", maxSize: 500 * 1024 * 1024, extensions: "MP4, MOV, MKV" },
    { id: "pdfs", label: "Documents", icon: FileText, color: "green", accept: ".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx", maxSize: 50 * 1024 * 1024, extensions: "PDF, DOC, DOCX, TXT, PPT, XLS" },
    { id: "assignments", label: "Assignments", icon: FileCheck, color: "purple", accept: ".pdf,.doc,.docx,.zip,.rar,.7z", maxSize: 100 * 1024 * 1024, extensions: "PDF, DOC, ZIP, RAR" },
    { id: "images", label: "Images", icon: Image, color: "orange", accept: "image/*", maxSize: 20 * 1024 * 1024, extensions: "JPG, PNG, GIF, WEBP" }
  ];

  const [mockContent, setMockContent] = useState({
    videos: [
      {
        id: 1,
        title: "Introduction to React",
        duration: "15:30",
        size: "45 MB",
        uploadDate: "2024-01-15",
        course: "Advanced React Development",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
        type: "video",
        url: "/videos/intro-react.mp4"
      }
    ],
    pdfs: [
      {
        id: 1,
        title: "React Cheat Sheet.pdf",
        pages: 12,
        size: "2.4 MB",
        uploadDate: "2024-01-10",
        course: "Advanced React Development",
        type: "pdf",
        url: "/pdfs/react-cheat-sheet.pdf",
        downloads: 45,
        lastAccessed: "2024-01-20"
      },
      {
        id: 2,
        title: "JavaScript ES6 Features.docx",
        pages: 8,
        size: "1.8 MB",
        uploadDate: "2024-01-12",
        course: "JavaScript Mastery",
        type: "docx",
        url: "/docs/js-es6-features.docx",
        downloads: 32,
        lastAccessed: "2024-01-18"
      }
    ],
    assignments: [
      {
        id: 1,
        title: "Build a Todo App",
        dueDate: "2024-02-15",
        submissions: 24,
        course: "Advanced React Development",
        type: "assignment",
        description: "Create a todo app using React hooks",
        attachments: 3
      }
    ],
    images: [
      {
        id: 1,
        title: "React Architecture Diagram.png",
        size: "1.2 MB",
        uploadDate: "2024-01-18",
        course: "Advanced React Development",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop",
        type: "image",
        url: "/images/react-architecture.png",
        dimensions: "1920x1080"
      }
    ]
  });

  // Filter content based on search and course selection
  const getFilteredContent = () => {
    let content = mockContent[activeContentType] || [];
    
    if (searchTerm) {
      content = content.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCourse !== "all") {
      content = content.filter(item => item.course === selectedCourse);
    }
    
    return content;
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600 border-blue-200",
      green: "bg-green-100 text-green-600 border-green-200",
      purple: "bg-purple-100 text-purple-600 border-purple-200",
      orange: "bg-orange-100 text-orange-600 border-orange-200"
    };
    return colors[color] || colors.blue;
  };

  // File upload handlers
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const currentType = contentTypes.find(t => t.id === activeContentType);
    
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > currentType.maxSize) {
        alert(`"${file.name}" is too large. Maximum size is ${formatFileSize(currentType.maxSize)}`);
        return false;
      }
      
      // Check file type
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!currentType.accept.includes(fileExtension) && !currentType.accept.includes(file.type)) {
        alert(`"${file.name}" is not a supported file type. Supported types: ${currentType.extensions}`);
        return false;
      }
      
      return true;
    });

    setUploadingFiles(prev => [...prev, ...validFiles]);
  };

  const simulateUpload = (file) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Add to mock content after upload
          setTimeout(() => {
            const newItem = createContentItem(file, activeContentType);
            setMockContent(prev => ({
              ...prev,
              [activeContentType]: [...prev[activeContentType], newItem]
            }));
            resolve();
          }, 300);
        }
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: Math.min(progress, 100)
        }));
      }, 150);
    });
  };

  const handleUpload = async () => {
    if (uploadingFiles.length === 0) return;

    // Upload files sequentially
    for (const file of uploadingFiles) {
      await simulateUpload(file);
    }

    setUploadingFiles([]);
    setUploadProgress({});
    setShowUploadModal(false);
  };

  const createContentItem = (file, type) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    
    const baseItem = {
      id: Date.now() + Math.random(),
      title: file.name,
      size: formatFileSize(file.size),
      uploadDate: new Date().toISOString().split('T')[0],
      course: courses[0], // Default to first course
      type: fileExtension,
      url: URL.createObjectURL(file),
      downloads: 0,
      lastAccessed: new Date().toISOString().split('T')[0]
    };

    switch (type) {
      case "videos":
        return {
          ...baseItem,
          duration: "00:00",
          thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop"
        };
      case "images":
        return {
          ...baseItem,
          thumbnail: URL.createObjectURL(file),
          dimensions: "1920x1080"
        };
      case "pdfs":
        return {
          ...baseItem,
          pages: Math.ceil(Math.random() * 50) + 10,
          type: fileExtension
        };
      case "assignments":
        return {
          ...baseItem,
          dueDate: "2024-03-01",
          submissions: 0,
          description: `${fileNameWithoutExt} - Assignment description`,
          attachments: 1
        };
      default:
        return baseItem;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeUploadingFile = (fileName) => {
    setUploadingFiles(prev => prev.filter(file => file.name !== fileName));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  const deleteContent = (type, id) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setMockContent(prev => ({
        ...prev,
        [type]: prev[type].filter(item => item.id !== id)
      }));
    }
  };

  const getFileIcon = (fileType, fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (fileType === 'pdf' || extension === 'pdf') {
      return { icon: FileText, color: "text-red-500" };
    } else if (['doc', 'docx'].includes(extension)) {
      return { icon: FileText, color: "text-blue-500" };
    } else if (['ppt', 'pptx'].includes(extension)) {
      return { icon: FileText, color: "text-orange-500" };
    } else if (['xls', 'xlsx'].includes(extension)) {
      return { icon: FileText, color: "text-green-500" };
    } else if (['txt'].includes(extension)) {
      return { icon: FileText, color: "text-gray-500" };
    } else {
      return { icon: File, color: "text-gray-400" };
    }
  };

  const renderContentList = () => {
    const contents = getFilteredContent();

    if (contents.length === 0) {
      return (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No {contentTypes.find(t => t.id === activeContentType)?.label} Found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCourse !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Upload your first document to get started."}
          </p>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload {contentTypes.find(t => t.id === activeContentType)?.label}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {contents.map((item) => {
          const fileIcon = getFileIcon(item.type, item.title);
          const IconComponent = fileIcon.icon;
          
          return (
            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors group">
              <div className="flex items-center gap-4 flex-1">
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.title} className="w-16 h-12 object-cover rounded" />
                ) : (
                  <div className={`w-16 h-12 rounded flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors`}>
                    <IconComponent className={`w-6 h-6 ${fileIcon.color}`} />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                      {item.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1 flex-wrap">
                    {item.duration && (
                      <span className="flex items-center gap-1">
                        <PlayCircle className="w-3 h-3" />
                        {item.duration}
                      </span>
                    )}
                    {item.pages && (
                      <span>{item.pages} pages</span>
                    )}
                    {item.dueDate && (
                      <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                    )}
                    <span>{item.size}</span>
                    <span className="text-purple-600 font-medium">{item.course}</span>
                    {item.downloads !== undefined && (
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {item.downloads}
                      </span>
                    )}
                    {item.uploadDate && (
                      <span>Uploaded: {new Date(item.uploadDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Preview">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Download">
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteContent(activeContentType, item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const UploadModal = () => {
    const currentType = contentTypes.find(t => t.id === activeContentType);
    const [selectedUploadCourse, setSelectedUploadCourse] = useState(courses[0]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Upload {currentType?.label}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Supported formats: {currentType?.extensions} • Max size: {formatFileSize(currentType?.maxSize || 0)}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadingFiles([]);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Course Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <select
                value={selectedUploadCourse}
                onChange={(e) => setSelectedUploadCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            {/* File Drop Zone */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:border-purple-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                multiple
                accept={currentType?.accept}
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer block"
              >
                <p className="text-gray-600 mb-2 text-lg">
                  <strong>Click to browse</strong> or drag and drop files here
                </p>
                <span className="text-sm text-gray-500">
                  Maximum file size: {formatFileSize(currentType?.maxSize || 0)}
                </span>
                <div className="mt-3 text-xs text-gray-400">
                  Supported: {currentType?.extensions}
                </div>
              </label>
            </div>

            {/* Uploading Files List */}
            {uploadingFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Files to Upload ({uploadingFiles.length})</h4>
                {uploadingFiles.map((file, index) => {
                  const fileIcon = getFileIcon('', file.name);
                  const IconComponent = fileIcon.icon;
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3 flex-1">
                        <IconComponent className={`w-5 h-5 ${fileIcon.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {uploadProgress[file.name] !== undefined && (
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress[file.name]}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600 w-8">
                              {Math.round(uploadProgress[file.name])}%
                            </span>
                          </div>
                        )}
                        <button 
                          onClick={() => removeUploadingFile(file.name)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              onClick={() => {
                setShowUploadModal(false);
                setUploadingFiles([]);
              }}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploadingFiles.length === 0}
              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload {uploadingFiles.length > 1 ? `(${uploadingFiles.length}) Files` : 'File'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Upload Modal */}
      {showUploadModal && <UploadModal />}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Upload New Documents
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Type Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {contentTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveContentType(type.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              activeContentType === type.id
                ? `${getColorClasses(type.color)} border-current shadow-md transform scale-105`
                : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <type.icon className="w-8 h-8 mb-2" />
            <h3 className="font-semibold text-gray-900">{type.label}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {mockContent[type.id]?.length || 0} items
            </p>
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {contentTypes.find(t => t.id === activeContentType)?.label}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {getFilteredContent().length} of {mockContent[activeContentType]?.length || 0} documents
              </p>
            </div>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Documents
            </button>
          </div>
        </div>
        <div className="p-6">
          {renderContentList()}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <FolderOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {Object.values(mockContent).reduce((total, items) => total + items.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Documents</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {mockContent.pdfs?.length || 0}
          </div>
          <div className="text-sm text-gray-600">PDF Documents</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <Download className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">1,247</div>
          <div className="text-sm text-gray-600">Total Downloads</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <FileCheck className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {mockContent.assignments?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Assignments</div>
        </div>
      </div>
    </div>
  );
};

export default ContentContent;