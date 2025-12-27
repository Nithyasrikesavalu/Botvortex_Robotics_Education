import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    profile: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bio: "",
      location: "",
      website: "",
      language: "English",
      timezone: ""
    },
    account: {
      username: "",
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: true,
      newsletter: false,
      courseUpdates: true,
      securityAlerts: true,
      twoFactorAuth: false
    },
    privacy: {
      profileVisibility: "public",
      showProgress: true,
      showAchievements: true,
      showCourses: true,
      dataSharing: false,
      personalizedAds: false,
      searchVisibility: true
    },
    learning: {
      autoPlayVideos: false,
      downloadQuality: "high",
      defaultPlaybackSpeed: "1.0x",
      subtitles: true,
      darkMode: false,
      focusMode: true,
      weeklyGoals: true,
      goalHours: 10
    },
    payment: {
      plan: "pro",
      cardNumber: "",
      expiryDate: "",
      cardHolder: "",
      billingAddress: "",
      autoRenew: true
    }
  });

  const handleSettingChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Scroll to top on component mount & Load User Settings
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });

    const loadData = async () => {
      try {
        const storedUserJSON = localStorage.getItem("user");
        const storedUser = storedUserJSON ? JSON.parse(storedUserJSON) : null;

        // Initial fallback from localStorage
        if (storedUser) {
          const [first, ...rest] = (storedUser.fullName || "").split(" ");
          setSettings(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              firstName: first || prev.profile.firstName,
              lastName: rest.join(" ") || prev.profile.lastName,
              email: storedUser.email || prev.profile.email,
            },
            account: {
              ...prev.account,
              username: storedUser.username || prev.account.username
            }
          }));
        }

        // Fetch from API
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch("http://localhost:5000/api/student/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();

            // Merge API data
            setSettings(prev => ({
              ...prev,
              profile: {
                ...prev.profile,
                firstName: data.personal?.firstName || prev.profile.firstName,
                lastName: data.personal?.lastName || prev.profile.lastName,
                email: data.personal?.email || prev.profile.email,
                phone: data.personal?.phone || prev.profile.phone,
                bio: data.personal?.bio || "",
                location: data.personal?.location || "",
                website: data.personal?.website || "",
                language: data.personal?.language || "English",
                timezone: data.personal?.timezone || ""
              },
              account: { ...prev.account, ...(data.settings?.account || {}) },
              privacy: { ...prev.privacy, ...(data.settings?.privacy || {}) },
              learning: { ...prev.learning, ...(data.settings?.learning || {}) },
              payment: { ...prev.payment, ...(data.settings?.payment || {}) }
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = {
        personal: {
          firstName: settings.profile.firstName,
          lastName: settings.profile.lastName,
          email: settings.profile.email,
          phone: settings.profile.phone,
          bio: settings.profile.bio,
          location: settings.profile.location,
          website: settings.profile.website,
          language: settings.profile.language,
          timezone: settings.profile.timezone,
          name: `${settings.profile.firstName} ${settings.profile.lastName}`.trim()
        },
        settings: {
          account: settings.account,
          privacy: settings.privacy,
          learning: settings.learning,
          payment: settings.payment
        }
      };

      const response = await fetch("http://localhost:5000/api/student/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Settings saved successfully!");
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser) {
          storedUser.firstName = settings.profile.firstName;
          storedUser.lastName = settings.profile.lastName;
          storedUser.fullName = `${settings.profile.firstName} ${settings.profile.lastName}`.trim();
          localStorage.setItem("user", JSON.stringify(storedUser));
          window.dispatchEvent(new Event("storage"));
        }
      } else {
        alert("Failed to save settings.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("An error occurred while saving.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("ARE YOU SURE? This will permanently delete your account and all enrolled courses. This action cannot be undone.")) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/student/profile", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert("Account deleted successfully.");
        localStorage.clear();
        navigate("/");
        window.location.reload();
      } else {
        alert("Failed to delete account.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error connecting to server.");
    }
  };

  const TabButton = ({ tab, icon, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 w-full text-left whitespace-nowrap lg:whitespace-normal ${activeTab === tab
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
        }`}
    >
      <i className={`fas ${icon} w-5 text-center`} />
      <span className="text-sm md:text-base">{label}</span>
    </button>
  );

  const Switch = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${enabled ? 'bg-blue-600' : 'bg-gray-300'
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
    </button>
  );

  const InputField = ({ label, value, onChange, type = "text", placeholder }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white p-6">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your account preferences and settings</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300 text-sm font-medium">
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium">
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-4 sm:p-6 space-y-1 sm:space-y-2 overflow-x-auto lg:overflow-visible">
              <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
                <TabButton tab="profile" icon="fa-user" label="Profile" />
                <TabButton tab="account" icon="fa-cog" label="Account" />
                <TabButton tab="privacy" icon="fa-shield-alt" label="Privacy" />
                <TabButton tab="learning" icon="fa-graduation-cap" label="Learning" />
                <TabButton tab="payment" icon="fa-credit-card" label="Payment" />
                <TabButton tab="notifications" icon="fa-bell" label="Alerts" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors duration-200 w-full text-left"
                >
                  <i className="fas fa-sign-out-alt w-5" />
                  Sign Out All Devices
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors duration-200 w-full text-left"
                >
                  <i className="fas fa-trash-alt w-5" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 text-center sm:text-left">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
                    {settings.profile.firstName?.[0]}{settings.profile.lastName?.[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                    <p className="text-sm text-gray-600">Update your personal details and profile information</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="First Name"
                    value={settings.profile.firstName}
                    onChange={(value) => handleSettingChange("profile", "firstName", value)}
                    placeholder="Enter your first name"
                  />
                  <InputField
                    label="Last Name"
                    value={settings.profile.lastName}
                    onChange={(value) => handleSettingChange("profile", "lastName", value)}
                    placeholder="Enter your last name"
                  />
                  <InputField
                    label="Email"
                    value={settings.profile.email}
                    onChange={(value) => handleSettingChange("profile", "email", value)}
                    type="email"
                    placeholder="Enter your email"
                  />
                  <InputField
                    label="Phone"
                    value={settings.profile.phone}
                    onChange={(value) => handleSettingChange("profile", "phone", value)}
                    placeholder="Enter your phone number"
                  />
                  <div className="md:col-span-2">
                    <InputField
                      label="Bio"
                      value={settings.profile.bio}
                      onChange={(value) => handleSettingChange("profile", "bio", value)}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                  <InputField
                    label="Location"
                    value={settings.profile.location}
                    onChange={(value) => handleSettingChange("profile", "location", value)}
                    placeholder="Enter your location"
                  />
                  <InputField
                    label="Website"
                    value={settings.profile.website}
                    onChange={(value) => handleSettingChange("profile", "website", value)}
                    placeholder="https://your-website.com"
                  />
                  <SelectField
                    label="Language"
                    value={settings.profile.language}
                    onChange={(value) => handleSettingChange("profile", "language", value)}
                    options={[
                      { value: "English", label: "English" },
                      { value: "Spanish", label: "Spanish" },
                      { value: "French", label: "French" },
                      { value: "German", label: "German" }
                    ]}
                  />
                  <SelectField
                    label="Timezone"
                    value={settings.profile.timezone}
                    onChange={(value) => handleSettingChange("profile", "timezone", value)}
                    options={[
                      { value: "IST (UTC+5:30)", label: "IST (UTC+5:30)" },
                      { value: "EST (UTC-5)", label: "EST (UTC-5)" },
                      { value: "PST (UTC-8)", label: "PST (UTC-8)" },
                      { value: "GMT (UTC+0)", label: "GMT (UTC+0)" }
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Username"
                      value={settings.account.username}
                      onChange={(value) => handleSettingChange("account", "username", value)}
                      placeholder="Enter username"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        enabled={settings.account.twoFactorAuth}
                        onChange={(value) => handleSettingChange("account", "twoFactorAuth", value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy & Security */}
            {activeTab === "privacy" && (
              <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy & Security</h2>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Profile Visibility</p>
                        <p className="text-sm text-gray-600">Who can see your profile and progress</p>
                      </div>
                      <SelectField
                        value={settings.privacy.profileVisibility}
                        onChange={(value) => handleSettingChange("privacy", "profileVisibility", value)}
                        options={[
                          { value: "public", label: "Public" },
                          { value: "private", label: "Private" },
                          { value: "friends", label: "Friends Only" }
                        ]}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Show Learning Progress</p>
                        <p className="text-sm text-gray-600">Display your course progress to others</p>
                      </div>
                      <Switch
                        enabled={settings.privacy.showProgress}
                        onChange={(value) => handleSettingChange("privacy", "showProgress", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Show Achievements</p>
                        <p className="text-sm text-gray-600">Display your badges and certificates</p>
                      </div>
                      <Switch
                        enabled={settings.privacy.showAchievements}
                        onChange={(value) => handleSettingChange("privacy", "showAchievements", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Data Sharing for Research</p>
                        <p className="text-sm text-gray-600">Help improve our platform anonymously</p>
                      </div>
                      <Switch
                        enabled={settings.privacy.dataSharing}
                        onChange={(value) => handleSettingChange("privacy", "dataSharing", value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Learning Preferences */}
            {activeTab === "learning" && (
              <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Learning Preferences</h2>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Auto-play Videos</p>
                        <p className="text-sm text-gray-600">Automatically play next video in course</p>
                      </div>
                      <Switch
                        enabled={settings.learning.autoPlayVideos}
                        onChange={(value) => handleSettingChange("learning", "autoPlayVideos", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Dark Mode</p>
                        <p className="text-sm text-gray-600">Use dark theme across the platform</p>
                      </div>
                      <Switch
                        enabled={settings.learning.darkMode}
                        onChange={(value) => handleSettingChange("learning", "darkMode", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Focus Mode</p>
                        <p className="text-sm text-gray-600">Minimize distractions during learning</p>
                      </div>
                      <Switch
                        enabled={settings.learning.focusMode}
                        onChange={(value) => handleSettingChange("learning", "focusMode", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Weekly Learning Goals</p>
                        <p className="text-sm text-gray-600">Set and track weekly learning targets</p>
                      </div>
                      <Switch
                        enabled={settings.learning.weeklyGoals}
                        onChange={(value) => handleSettingChange("learning", "weeklyGoals", value)}
                      />
                    </div>

                    {settings.learning.weeklyGoals && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                          label="Weekly Goal Hours"
                          value={settings.learning.goalHours}
                          onChange={(value) => handleSettingChange("learning", "goalHours", value)}
                          type="number"
                          placeholder="Enter hours per week"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment & Billing */}
            {activeTab === "payment" && (
              <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment & Billing</h2>

                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-blue-900">Current Plan: Pro</p>
                        <p className="text-sm text-blue-700">$29/month • Unlimited access to all courses</p>
                      </div>
                      <button className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:shadow transition-all duration-300">
                        Change Plan
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Card Number"
                      value={settings.payment.cardNumber}
                      onChange={(value) => handleSettingChange("payment", "cardNumber", value)}
                      placeholder="•••• •••• •••• ••••"
                    />
                    <InputField
                      label="Expiry Date"
                      value={settings.payment.expiryDate}
                      onChange={(value) => handleSettingChange("payment", "expiryDate", value)}
                      placeholder="MM/YY"
                    />
                    <InputField
                      label="Card Holder"
                      value={settings.payment.cardHolder}
                      onChange={(value) => handleSettingChange("payment", "cardHolder", value)}
                      placeholder="Full name on card"
                    />
                    <InputField
                      label="Billing Address"
                      value={settings.payment.billingAddress}
                      onChange={(value) => handleSettingChange("payment", "billingAddress", value)}
                      placeholder="Enter billing address"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">Auto-renew Subscription</p>
                      <p className="text-sm text-gray-600">Automatically renew your plan each month</p>
                    </div>
                    <Switch
                      enabled={settings.payment.autoRenew}
                      onChange={(value) => handleSettingChange("payment", "autoRenew", value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <Switch
                        enabled={settings.account.emailNotifications}
                        onChange={(value) => handleSettingChange("account", "emailNotifications", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Push Notifications</p>
                        <p className="text-sm text-gray-600">Get browser push notifications</p>
                      </div>
                      <Switch
                        enabled={settings.account.pushNotifications}
                        onChange={(value) => handleSettingChange("account", "pushNotifications", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Receive text message alerts</p>
                      </div>
                      <Switch
                        enabled={settings.account.smsNotifications}
                        onChange={(value) => handleSettingChange("account", "smsNotifications", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Course Updates</p>
                        <p className="text-sm text-gray-600">Notifications about new course content</p>
                      </div>
                      <Switch
                        enabled={settings.account.courseUpdates}
                        onChange={(value) => handleSettingChange("account", "courseUpdates", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Security Alerts</p>
                        <p className="text-sm text-gray-600">Important security notifications</p>
                      </div>
                      <Switch
                        enabled={settings.account.securityAlerts}
                        onChange={(value) => handleSettingChange("account", "securityAlerts", value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;