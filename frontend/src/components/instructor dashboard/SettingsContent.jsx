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

const SettingsContent = ({ user }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

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
    if (user) {
      setProfileData({
        name: user.fullName || "",
        email: user.email || "",
        bio: user.instructorDetails?.bio || "Expert robotics instructor at BotVortex.",
        expertise: user.instructorDetails?.expertise || "",
        website: user.instructorDetails?.website || "",
        phone: user.instructorDetails?.phone || "",
        location: user.instructorDetails?.location || "India"
      });
    }
  }, [user]);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    studentMessages: true,
    courseUpdates: true,
    marketingEmails: false,
    pushNotifications: true,
    weeklyReports: true
  });

  const handleSave = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("instructor_token");
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/instructor/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: profileData.name,
          instructorDetails: {
            expertise: profileData.expertise,
            website: profileData.website,
            phone: profileData.phone,
            location: profileData.location,
            bio: profileData.bio
          }
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem("instructor_user", JSON.stringify(updatedUser));
        alert("Settings updated successfully!");
      }
    } catch (err) {
      console.error("Error updating settings:", err);
      alert("Failed to update settings.");
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
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <button className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-all shadow-lg">
              <Upload className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{profileData.name}</h3>
            <p className="text-purple-600 font-medium">{profileData.expertise}</p>
            <p className="text-gray-600 text-sm mt-2">{profileData.bio}</p>
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
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
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
        <p className="text-sm text-gray-500 mt-2">
          This will be displayed on your instructor profile page.
        </p>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {/* Notification Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Notification Preferences</h3>
            <p className="text-gray-600">Choose how you want to be notified about platform activities</p>
          </div>
        </div>
      </div>

      {/* Notification Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-purple-600" />
            Email Notifications
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 transition-all">
              <div>
                <p className="font-medium text-gray-900">Course Updates</p>
                <p className="text-sm text-gray-600">New students, reviews, and progress</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.courseUpdates}
                  onChange={() => toggleNotification('courseUpdates')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 transition-all">
              <div>
                <p className="font-medium text-gray-900">Student Messages</p>
                <p className="text-sm text-gray-600">When students send you messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.studentMessages}
                  onChange={() => toggleNotification('studentMessages')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 transition-all">
              <div>
                <p className="font-medium text-gray-900">Weekly Reports</p>
                <p className="text-sm text-gray-600">Performance and earnings summary</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.weeklyReports}
                  onChange={() => toggleNotification('weeklyReports')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Platform Notifications */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            Platform Notifications
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-all">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Browser and mobile push alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.pushNotifications}
                  onChange={() => toggleNotification('pushNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-all">
              <div>
                <p className="font-medium text-gray-900">Marketing Emails</p>
                <p className="text-sm text-gray-600">Platform updates and promotions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.marketingEmails}
                  onChange={() => toggleNotification('marketingEmails')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-all">
              <div>
                <p className="font-medium text-gray-900">All Email Notifications</p>
                <p className="text-sm text-gray-600">Master switch for all emails</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={() => toggleNotification('emailNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Summary */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-2">Notification Summary</h4>
        <p className="text-sm text-gray-600">
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${activeTab === tab.id
                        ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
                    localStorage.removeItem("instructor_token");
                    localStorage.removeItem("instructor_user");
                    window.location.href = "/";
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 mt-4 border border-transparent hover:border-red-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-8">
                {renderTabContent()}

                {/* Save Button */}
                <div className="flex gap-3 pt-8 mt-8 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? "Saving Changes..." : "Save Changes"}
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-300 transition-all">
                    Cancel
                  </button>
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
