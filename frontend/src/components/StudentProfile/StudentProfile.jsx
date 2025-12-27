import React, { useEffect, useState } from "react";

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [editMode, setEditMode] = useState(false);

  const [studentData, setStudentData] = useState({
    personal: {
      name: "Nguyen Van A",
      role: "Computer Science Student | Faculty of Information Technology",
      studentId: "ST2024001",
      phone: "0912 345 678",
      studentAccount: "student001",
      email: "student001@university.edu",
      gender: "Male",
      dob: "15th August, 2002",
      language: "Vietnamese, English",
    },
    education: {
      degree: "Bachelor in Computer Science",
      period: "2020-2024",
      university: "University of Engineering and Technology",
      certificate: "Certificate of Web Development",
      certPeriod: "2022-2023",
      certInstitution: "TechMaster University"
    },
    academic: {
      semester: "Fall 2024",
      gpa: "3.8/4.0",
      creditsCompleted: "120",
      standing: "Excellent",
      advisor: "Dr. Tran Thi B",
      major: "Computer Science",
      specialization: "Artificial Intelligence"
    }
  });

  const handleChange = (section, field, value) => {
    setStudentData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Load Profile from Backend
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        let basicData = {};

        if (storedUser) {
          basicData = JSON.parse(storedUser);
        }

        if (!token) return;

        const res = await fetch("http://localhost:5000/api/student/profile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const profileData = await res.json();
          const derivedName = profileData.fullName ||
            (profileData.personal?.name) ||
            (profileData.personal?.firstName ? `${profileData.personal.firstName} ${profileData.personal.lastName || ''}`.trim() : '') ||
            basicData.fullName ||
            "Student";

          setStudentData(prev => ({
            ...prev,
            personal: {
              ...prev.personal,
              ...profileData.personal,
              name: derivedName,
              email: profileData.personal?.email || basicData.email || prev.personal.email,
              role: basicData.role ? `${basicData.role.charAt(0).toUpperCase() + basicData.role.slice(1)}` : prev.personal.role,
              studentAccount: basicData.username || prev.personal.studentAccount
            },
            education: {
              ...prev.education,
              ...profileData.education
            },
            academic: {
              ...prev.academic,
              ...profileData.academic
            }
          }));
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to save.");
        return;
      }

      const names = (studentData.personal.name || "").trim().split(' ');
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(' ') || "";

      const payload = {
        ...studentData,
        personal: {
          ...studentData.personal,
          firstName,
          lastName
        }
      };

      const res = await fetch("http://localhost:5000/api/student/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        setEditMode(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-indigo-100/50 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left w-full sm:w-auto">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.personal.name)}&background=6366f1&color=fff&size=128`}
                    alt="Student Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {editMode && (
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors border-2 border-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {studentData.personal.name}
                </h1>
                <p className="text-gray-600 mt-1 max-w-md">{studentData.personal.role}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Active
                  </span>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {studentData.academic.semester}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit/Save Buttons */}
            <div className="flex gap-3 w-full lg:w-auto">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 md:px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 md:px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-semibold text-gray-900">{studentData.personal.studentId}</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">{studentData.personal.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{studentData.personal.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8 border border-indigo-100/50 overflow-x-auto">
          <div className="flex gap-2 sm:gap-3 min-w-max sm:min-w-0">
            <TabButton tab="personal" activeTab={activeTab} setActiveTab={setActiveTab}>
              Personal
            </TabButton>
            <TabButton tab="education" activeTab={activeTab} setActiveTab={setActiveTab}>
              Education
            </TabButton>
            <TabButton tab="academic" activeTab={activeTab} setActiveTab={setActiveTab}>
              Academic
            </TabButton>
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100/50 backdrop-blur-sm">
          {activeTab === "personal" && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
              </div>
              <div className="space-y-2">
                {Object.keys(studentData.personal).map((key) => (
                  <InfoRow
                    key={key}
                    section="personal"
                    field={key}
                    label={key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                    value={studentData.personal[key]}
                    editMode={editMode}
                    handleChange={handleChange}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Education Background</h3>
              </div>
              <div className="space-y-2">
                {Object.keys(studentData.education).map((key) => (
                  <InfoRow
                    key={key}
                    section="education"
                    field={key}
                    label={key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                    value={studentData.education[key]}
                    editMode={editMode}
                    handleChange={handleChange}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "academic" && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Academic Information</h3>
              </div>
              <div className="space-y-2">
                {Object.keys(studentData.academic).map((key) => (
                  <InfoRow
                    key={key}
                    section="academic"
                    field={key}
                    label={key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                    value={studentData.academic[key]}
                    editMode={editMode}
                    handleChange={handleChange}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ section, field, label, value, editMode, handleChange }) => (
  <div className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-100 hover:bg-indigo-50/30 transition-all duration-200 rounded-lg px-3">
    <span className="text-sm font-semibold text-gray-600 min-w-[180px] flex items-start sm:items-center">
      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-2 sm:mt-0 flex-shrink-0"></span>
      {label}
    </span>
    {editMode ? (
      <input
        className="flex-1 border border-indigo-200 bg-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        value={value}
        onChange={(e) => handleChange(section, field, e.target.value)}
      />
    ) : (
      <span className="flex-1 text-gray-800 font-medium bg-gray-50/80 px-4 py-2 rounded-lg border border-transparent">
        {value}
      </span>
    )}
  </div>
);

const TabButton = ({ tab, children, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tab)}
    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === tab
      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
      : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-200"
      }`}
  >
    {children}
  </button>
);

export default StudentProfile;