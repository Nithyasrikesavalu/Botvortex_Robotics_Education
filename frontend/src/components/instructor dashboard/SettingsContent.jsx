import { API_URL } from "../../config/api";


import React, { useState, useEffect } from "react";
import {
  Save,
  Upload,
  Bell,
  Mail,
  MessageSquare,
  TrendingUp,
  Users,
  LogOut,
  User as UserIconLucide
} from "lucide-react";
import { Link } from "react-router-dom";

const UserIcon = () => <UserIconLucide className="w-4 h-4" />;

const SettingsContent = ({ user, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const tabs = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "notifications", label: "Notifications", icon: Bell }
  ];

  const [profileData, setProfileData] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    bio: user?.instructorDetails?.bio || "Expert robotics instructor at BotVortex.",
    expertise: user?.instructorDetails?.expertise || "",
    website: user?.instructorDetails?.website || "",
    phone: user?.instructorDetails?.phone || "",
    location: user?.instructorDetails?.location || "India"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("instructorToken") || localStorage.getItem("token");
        const response = await fetch(`${API_URL}/instructor/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const fetchedUser = await response.json();
          setProfileData({
            name: fetchedUser.fullName || "",
            email: fetchedUser.email || "",
            bio: fetchedUser.instructorDetails?.bio || "",
            expertise: fetchedUser.instructorDetails?.expertise || "",
            website: fetchedUser.instructorDetails?.website || "",
            phone: fetchedUser.instructorDetails?.phone || "",
            location: fetchedUser.instructorDetails?.location || ""
          });
          if (fetchedUser.avatar) {
            setAvatarPreview(`${API_URL.replace('/api', '')}${fetchedUser.avatar}`);
          }
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    studentMessages: true,
    courseUpdates: true,
    marketingEmails: false,
    pushNotifications: true,
    weeklyReports: true
  });

  const fileInputRef = React.useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("https://randomuser.me/api/portraits/men/32.jpg");

  const handleSave = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("instructorToken") || (localStorage.getItem("instructorToken") || localStorage.getItem("token"));
    if (!token) return;

    try {
      const formData = new FormData();
      formData.append("fullName", profileData.name);
      formData.append("instructorDetails", JSON.stringify({
        expertise: profileData.expertise,
        website: profileData.website,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio
      }));
      
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await fetch(`${API_URL}/instructor/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        if (onUpdate) onUpdate(); // Refresh InstructorDashboard

        setSuccessMessage("Settings updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      console.error("Error updating settings:", err);
      setSuccessMessage("Failed to update settings.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotification = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="bg-[#0A192F] rounded-xl p-6 border border-[#233554]">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={avatarPreview}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }
              }}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-[#64FFDA] text-[#0A192F] font-semibold p-2 rounded-full hover:bg-[#64FFDA]/90 transition-all shadow-lg"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{profileData.name}</h3>
            <p className="text-[#64FFDA] font-medium">{profileData.expertise}</p>
            <p className="text-slate-400 text-sm mt-2">{profileData.bio}</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profileData.name || ""}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-4 py-3 border border-[#233554] bg-[#0A192F] text-white rounded-xl focus:ring-2 focus:ring-[#64FFDA]/50 focus:border-[#64FFDA] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profileData.email || ""}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-4 py-3 border border-[#233554] bg-[#0A192F] text-white rounded-xl focus:ring-2 focus:ring-[#64FFDA]/50 focus:border-[#64FFDA] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone || ""}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-[#233554] bg-[#0A192F] text-white rounded-xl focus:ring-2 focus:ring-[#64FFDA]/50 focus:border-[#64FFDA] transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              className="w-full px-4 py-3 border border-[#233554] bg-[#0A192F] text-white rounded-xl focus:ring-2 focus:ring-[#64FFDA]/50 focus:border-[#64FFDA] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
              className="w-full px-4 py-3 border border-[#233554] bg-[#0A192F] text-white rounded-xl focus:ring-2 focus:ring-[#64FFDA]/50 focus:border-[#64FFDA] transition-all"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Areas of Expertise
            </label>
            <input
              type="text"
              value={profileData.expertise}
              onChange={(e) => setProfileData({ ...profileData, expertise: e.target.value })}
              className="w-full px-4 py-3 border border-[#233554] bg-[#0A192F] text-white rounded-xl focus:ring-2 focus:ring-[#64FFDA]/50 focus:border-[#64FFDA] transition-all"
              placeholder="Web Development, React, Node.js"
            />
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Professional Bio
        </label>
        <textarea
          value={profileData.bio}
          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          placeholder="Tell students about your teaching experience and expertise..."
        />
        <p className="text-sm text-slate-500 mt-2">
          This will be displayed on your instructor profile page.
        </p>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {/* Notification Header */}
      <div className="bg-[#0A192F] rounded-xl p-6 border border-[#233554]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#233554] rounded-lg">
            <Bell className="w-6 h-6 text-[#64FFDA]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Notification Preferences</h3>
            <p className="text-slate-400">Choose how you want to be notified about platform activities</p>
          </div>
        </div>
      </div>

      {/* Notification Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#64FFDA]" />
            Email Notifications
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-[#112240] border border-[#233554] rounded-xl hover:border-[#64FFDA] transition-all">
              <div>
                <p className="font-medium text-white">Course Updates</p>
                <p className="text-sm text-slate-400">New students, reviews, and progress</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.courseUpdates}
                  onChange={() => toggleNotification('courseUpdates')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#233554] peer-focus:ring-4 peer-focus:ring-[#64FFDA]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-200 after:border-transparent after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#64FFDA]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#112240] border border-[#233554] rounded-xl hover:border-[#64FFDA] transition-all">
              <div>
                <p className="font-medium text-white">Student Messages</p>
                <p className="text-sm text-slate-400">When students send you messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.studentMessages}
                  onChange={() => toggleNotification('studentMessages')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#233554] peer-focus:ring-4 peer-focus:ring-[#64FFDA]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-200 after:border-transparent after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#64FFDA]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#112240] border border-[#233554] rounded-xl hover:border-[#64FFDA] transition-all">
              <div>
                <p className="font-medium text-white">Weekly Reports</p>
                <p className="text-sm text-slate-400">Performance and earnings summary</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.weeklyReports}
                  onChange={() => toggleNotification('weeklyReports')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#233554] peer-focus:ring-4 peer-focus:ring-[#64FFDA]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-200 after:border-transparent after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#64FFDA]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Platform Notifications */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#64FFDA]" />
            Platform Notifications
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-[#112240] border border-[#233554] rounded-xl hover:border-[#64FFDA] transition-all">
              <div>
                <p className="font-medium text-white">Push Notifications</p>
                <p className="text-sm text-slate-400">Browser and mobile push alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.pushNotifications}
                  onChange={() => toggleNotification('pushNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#233554] peer-focus:ring-4 peer-focus:ring-[#64FFDA]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-200 after:border-transparent after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#64FFDA]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#112240] border border-[#233554] rounded-xl hover:border-[#64FFDA] transition-all">
              <div>
                <p className="font-medium text-white">Marketing Emails</p>
                <p className="text-sm text-slate-400">Platform updates and promotions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.marketingEmails}
                  onChange={() => toggleNotification('marketingEmails')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#233554] peer-focus:ring-4 peer-focus:ring-[#64FFDA]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-200 after:border-transparent after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#64FFDA]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#112240] border border-[#233554] rounded-xl hover:border-[#64FFDA] transition-all">
              <div>
                <p className="font-medium text-white">All Email Notifications</p>
                <p className="text-sm text-slate-400">Master switch for all emails</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={() => toggleNotification('emailNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#233554] peer-focus:ring-4 peer-focus:ring-[#64FFDA]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-200 after:border-transparent after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#64FFDA]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Summary */}
      <div className="bg-transparent rounded-xl p-6 border border-[#233554]">
        <h4 className="font-semibold text-white mb-2">Notification Summary</h4>
        <p className="text-sm text-slate-400">
          You have {Object.values(notificationSettings).filter(Boolean).length} out of {Object.keys(notificationSettings).length} notification types enabled.
        </p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "notifications":
        return renderNotificationsTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <div className="bg-[#112240] rounded-2xl shadow-sm border border-[#233554] p-4 sticky top-6">
              <h2 className="text-xl font-bold text-white mb-6">Settings</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${activeTab === tab.id
                        ? "bg-[#64FFDA]/10 text-[#64FFDA] border border-[#64FFDA]/30 shadow-sm"
                        : "text-slate-400 hover:bg-[#233554] hover:text-white"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}

                {/* Logout Button in Sidebar */}
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/";
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 text-red-500 hover:bg-red-500/10 hover:text-red-400 mt-4 border border-transparent hover:border-red-500/30"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-[#112240] rounded-2xl shadow-sm border border-[#233554]">
              <div className="p-8">
                {renderTabContent()}

                {/* Save Button */}
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-[#233554]">
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-[#64FFDA] text-[#0A192F] font-semibold px-8 py-3 rounded-xl hover:bg-[#64FFDA]/90 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
                    >
                      <Save className="w-4 h-4" />
                      {isLoading ? "Saving Changes..." : "Save Changes"}
                    </button>
                    <button className="bg-[#233554] text-slate-300 px-8 py-3 rounded-xl hover:bg-[#233554]/80 transition-all">
                      Cancel
                    </button>
                  </div>
                  {successMessage && (
                    <div className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${successMessage.includes("Failed") ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-[#64FFDA]/10 text-[#64FFDA] border border-[#64FFDA]/30"}`}>
                      {successMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;
