// import { API_URL } from "../../config/api";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const SettingsPage = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("profile");
//   const [loading, setLoading] = useState(true);
//   const [settings, setSettings] = useState({
//     profile: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       phone: "",
//       bio: "",
//       location: "",
//       website: "",
//       language: "English",
//       timezone: "",
//     },
//     account: {
//       username: "",
//       emailNotifications: true,
//       pushNotifications: false,
//       smsNotifications: true,
//       newsletter: false,
//       courseUpdates: true,
//       securityAlerts: true,
//       twoFactorAuth: false,
//     },
//     privacy: {
//       profileVisibility: "public",
//       showProgress: true,
//       showAchievements: true,
//       showCourses: true,
//       dataSharing: false,
//       personalizedAds: false,
//       searchVisibility: true,
//     },
//     learning: {
//       autoPlayVideos: false,
//       downloadQuality: "high",
//       defaultPlaybackSpeed: "1.0x",
//       subtitles: true,
//       darkMode: false,
//       focusMode: true,
//       weeklyGoals: true,
//       goalHours: 10,
//     },
//     payment: {
//       plan: "pro",
//       cardNumber: "",
//       expiryDate: "",
//       cardHolder: "",
//       billingAddress: "",
//       autoRenew: true,
//     },
//   });

//   const handleSettingChange = (section, field, value) => {
//     setSettings((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value,
//       },
//     }));
//   };

//   // Scroll to top on component mount & Load User Settings
//   useEffect(() => {
//     window.scrollTo({ top: 0, left: 0 });

//     const loadData = async () => {
//       const storedUserJSON = localStorage.getItem("user");
//       const storedUser = storedUserJSON ? JSON.parse(storedUserJSON) : null;

//       if (!storedUser) {
//         navigate("/login");
//         return;
//       }

//       // Role check: Instructors stay in their dashboard
//       if (storedUser.role === "instructor") {
//         window.location.replace("/instructor-dashboard");
//         return;
//       }

//       try {
//         // Initial fallback from localStorage
//         if (storedUser) {
//           const [first, ...rest] = (storedUser.fullName || "").split(" ");
//           setSettings((prev) => ({
//             ...prev,
//             profile: {
//               ...prev.profile,
//               firstName: first || prev.profile.firstName,
//               lastName: rest.join(" ") || prev.profile.lastName,
//               email: storedUser.email || prev.profile.email,
//             },
//             account: {
//               ...prev.account,
//               username: storedUser.username || prev.account.username,
//             },
//           }));
//         }

//         // Fetch from API
//         const token = localStorage.getItem("token");
//         if (token) {
//           const response = await fetch(`${API_URL}/student/profile`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           if (response.ok) {
//             const data = await response.json();

//             // Merge API data
//             setSettings((prev) => ({
//               ...prev,
//               profile: {
//                 ...prev.profile,
//                 firstName: data.personal?.firstName || prev.profile.firstName,
//                 lastName: data.personal?.lastName || prev.profile.lastName,
//                 email: data.personal?.email || prev.profile.email,
//                 phone: data.personal?.phone || prev.profile.phone,
//                 bio: data.personal?.bio || "",
//                 location: data.personal?.location || "",
//                 website: data.personal?.website || "",
//                 language: data.personal?.language || "English",
//                 timezone: data.personal?.timezone || "",
//               },
//               account: { ...prev.account, ...(data.settings?.account || {}) },
//               privacy: { ...prev.privacy, ...(data.settings?.privacy || {}) },
//               learning: {
//                 ...prev.learning,
//                 ...(data.settings?.learning || {}),
//               },
//               payment: { ...prev.payment, ...(data.settings?.payment || {}) },
//             }));
//           }
//         }
//       } catch (error) {
//         console.error("Failed to load settings", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   const handleSave = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const payload = {
//         personal: {
//           firstName: settings.profile.firstName,
//           lastName: settings.profile.lastName,
//           email: settings.profile.email,
//           phone: settings.profile.phone,
//           bio: settings.profile.bio,
//           location: settings.profile.location,
//           website: settings.profile.website,
//           language: settings.profile.language,
//           timezone: settings.profile.timezone,
//           name: `${settings.profile.firstName} ${settings.profile.lastName}`.trim(),
//         },
//         settings: {
//           account: settings.account,
//           privacy: settings.privacy,
//           learning: settings.learning,
//           payment: settings.payment,
//         },
//       };

//       const response = await fetch(`${API_URL}/student/profile`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         alert("Settings saved successfully!");
//         const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//         if (storedUser) {
//           storedUser.firstName = settings.profile.firstName;
//           storedUser.lastName = settings.profile.lastName;
//           storedUser.fullName =
//             `${settings.profile.firstName} ${settings.profile.lastName}`.trim();
//           localStorage.setItem("user", JSON.stringify(storedUser));
//           window.dispatchEvent(new Event("storage"));
//         }
//       } else {
//         alert("Failed to save settings.");
//       }
//     } catch (error) {
//       console.error("Error saving settings:", error);
//       alert("An error occurred while saving.");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/");
//     window.location.reload();
//   };

//   const handleDeleteAccount = async () => {
//     if (
//       !window.confirm(
//         "ARE YOU SURE? This will permanently delete your account and all enrolled courses. This action cannot be undone.",
//       )
//     ) {
//       return;
//     }

//     const token = localStorage.getItem("token");
//     try {
//       const response = await fetch(`${API_URL}/student/profile`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         alert("Account deleted successfully.");
//         localStorage.clear();
//         navigate("/");
//         window.location.reload();
//       } else {
//         alert("Failed to delete account.");
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//       alert("Error connecting to server.");
//     }
//   };

//   const TabButton = ({ tab, icon, label }) => (
//     <button
//       onClick={() => setActiveTab(tab)}
//       className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 w-full text-left whitespace-nowrap lg:whitespace-normal ${
//         activeTab === tab
//           ? "bg-blue-600 text-white shadow-sm"
//           : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
//       }`}
//     >
//       <i className={`fas ${icon} w-5 text-center`} />
//       <span className="text-sm md:text-base">{label}</span>
//     </button>
//   );

//   const Switch = ({ enabled, onChange }) => (
//     <button
//       onClick={() => onChange(!enabled)}
//       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
//         enabled ? "bg-blue-600" : "bg-gray-300"
//       }`}
//     >
//       <span
//         className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
//           enabled ? "translate-x-6" : "translate-x-1"
//         }`}
//       />
//     </button>
//   );

//   const InputField = ({
//     label,
//     value,
//     onChange,
//     type = "text",
//     placeholder,
//   }) => (
//     <div className="space-y-2">
//       <label className="text-sm font-medium text-gray-700">{label}</label>
//       <input
//         type={type}
//         value={value || ""}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//       />
//     </div>
//   );

//   const SelectField = ({ label, value, onChange, options }) => (
//     <div className="space-y-2">
//       <label className="text-sm font-medium text-gray-700">{label}</label>
//       <select
//         value={value || ""}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
//       >
//         {options.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6">
//       <link
//         rel="stylesheet"
//         href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
//       />

//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 rounded-xl p-4 md:p-6 mb-6">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//                 Settings
//               </h1>
//               <p className="text-sm text-gray-600 mt-1">
//                 Manage your account preferences and settings
//               </p>
//             </div>
//             <div className="flex gap-3 w-full sm:w-auto">
//               <button className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all duration-300 text-sm font-medium">
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Sidebar Navigation */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 rounded-xl p-4 sm:p-6 space-y-1 sm:space-y-2 overflow-x-auto lg:overflow-visible">
//               <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
//                 <TabButton tab="profile" icon="fa-user" label="Profile" />
//                 <TabButton tab="account" icon="fa-cog" label="Account" />
//                 <TabButton tab="privacy" icon="fa-shield-alt" label="Privacy" />
//                 <TabButton
//                   tab="learning"
//                   icon="fa-graduation-cap"
//                   label="Learning"
//                 />
//                 <TabButton
//                   tab="payment"
//                   icon="fa-credit-card"
//                   label="Payment"
//                 />
//                 <TabButton tab="notifications" icon="fa-bell" label="Alerts" />
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 rounded-xl p-6 mt-6">
//               <h3 className="font-semibold text-gray-900 mb-4">
//                 Quick Actions
//               </h3>
//               <div className="space-y-3">
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors duration-200 w-full text-left"
//                 >
//                   <i className="fas fa-sign-out-alt w-5" />
//                   Sign Out All Devices
//                 </button>
//                 <button
//                   onClick={handleDeleteAccount}
//                   className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors duration-200 w-full text-left"
//                 >
//                   <i className="fas fa-trash-alt w-5" />
//                   Delete Account
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             {/* Profile Settings */}
//             {activeTab === "profile" && (
//               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 rounded-xl p-4 md:p-6">
//                 <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 text-center sm:text-left">
//                   <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
//                     {settings.profile.firstName?.[0]}
//                     {settings.profile.lastName?.[0]}
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-900">
//                       Profile Information
//                     </h2>
//                     <p className="text-sm text-gray-600">
//                       Update your personal details and profile information
//                     </p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <InputField
//                     label="First Name"
//                     value={settings.profile.firstName}
//                     onChange={(value) =>
//                       handleSettingChange("profile", "firstName", value)
//                     }
//                     placeholder="Enter your first name"
//                   />
//                   <InputField
//                     label="Last Name"
//                     value={settings.profile.lastName}
//                     onChange={(value) =>
//                       handleSettingChange("profile", "lastName", value)
//                     }
//                     placeholder="Enter your last name"
//                   />
//                   <InputField
//                     label="Email"
//                     value={settings.profile.email}
//                     onChange={(value) =>
//                       handleSettingChange("profile", "email", value)
//                     }
//                     type="email"
//                     placeholder="Enter your email"
//                   />
//                   <InputField
//                     label="Phone"
//                     value={settings.profile.phone}
//                     onChange={(value) =>
//                       handleSettingChange("profile", "phone", value)
//                     }
//                     placeholder="Enter your phone number"
//                   />
//                   <div className="md:col-span-2">
//                     <InputField
//                       label="Bio"
//                       value={settings.profile.bio}
//                       onChange={(value) =>
//                         handleSettingChange("profile", "bio", value)
//                       }
//                       placeholder="Tell us about yourself"
//                     />
//                   </div>
//                   <InputField
//                     label="Location"
//                     value={settings.profile.location}
//                     onChange={(value) =>
//                       handleSettingChange("profile", "location", value)
//                     }
//                     placeholder="Enter your location"
//                   />
//                   <InputField
//                     label="Website"
//                     value={settings.profile.website}
//                     onChange={(value) =>
//                       handleSettingChange("profile", "website", value)
//                     }
//                     placeholder="https://your-website.com"
//                   />
//                   <SelectField
//                     label="Language"
//                     value={settings.profile.language}
//                     onChange={(value) =>
//                       handleSettingChange("profile", "language", value)
//                     }
//                     options={[
//                       { value: "English", label: "English" },
//                       { value: "Spanish", label: "Spanish" },
//                       { value: "French", label: "French" },
//                       { value: "German", label: "German" },
//                     ]}
//                   />
//                   <SelectField
//                     label="Timezone"
//                     value={settings.profile.timezone}
//                     onChange={(value) =>
//                       handleSettingChange("profile", "timezone", value)
//                     }
//                     options={[
//                       { value: "IST (UTC+5:30)", label: "IST (UTC+5:30)" },
//                       { value: "EST (UTC-5)", label: "EST (UTC-5)" },
//                       { value: "PST (UTC-8)", label: "PST (UTC-8)" },
//                       { value: "GMT (UTC+0)", label: "GMT (UTC+0)" },
//                     ]}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Account Settings */}
//             {activeTab === "account" && (
//               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 rounded-xl p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-6">
//                   Account Settings
//                 </h2>

//                 <div className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <InputField
//                       label="Username"
//                       value={settings.account.username}
//                       onChange={(value) =>
//                         handleSettingChange("account", "username", value)
//                       }
//                       placeholder="Enter username"
//                     />
//                   </div>

//                   <div className="border-t border-gray-200 pt-6">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                       Security
//                     </h3>
//                     <div className="flex items-center justify-between py-3">
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           Two-Factor Authentication
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Add an extra layer of security to your account
//                         </p>
//                       </div>
//                       <Switch
//                         enabled={settings.account.twoFactorAuth}
//                         onChange={(value) =>
//                           handleSettingChange("account", "twoFactorAuth", value)
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Privacy & Security */}
//             {activeTab === "privacy" && (
//               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 rounded-xl p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-6">
//                   Privacy & Security
//                 </h2>

//                 <div className="space-y-6">
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between py-3">
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           Profile Visibility
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Who can see your profile and progress
//                         </p>
//                       </div>
//                       <SelectField
//                         value={settings.privacy.profileVisibility}
//                         onChange={(value) =>
//                           handleSettingChange(
//                             "privacy",
//                             "profileVisibility",
//                             value,
//                           )
//                         }
//                         options={[
//                           { value: "public", label: "Public" },
//                           { value: "private", label: "Private" },
//                           { value: "friends", label: "Friends Only" },
//                         ]}
//                       />
//                     </div>

//                     <div className="flex items-center justify-between py-3">
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           Show Learning Progress
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Display your course progress to others
//                         </p>
//                       </div>
//                       <Switch
//                         enabled={settings.privacy.showProgress}
//                         onChange={(value) =>
//                           handleSettingChange("privacy", "showProgress", value)
//                         }
//                       />
//                     </div>

//                     <div className="flex items-center justify-between py-3">
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           Show Achievements
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Display your badges and certificates
//                         </p>
//                       </div>
//                       <Switch
//                         enabled={settings.privacy.showAchievements}
//                         onChange={(value) =>
//                           handleSettingChange(
//                             "privacy",
//                             "showAchievements",
//                             value,
//                           )
//                         }
//                       />
//                     </div>

//                     <div className="flex items-center justify-between py-3">
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           Data Sharing for Research
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Help improve our platform anonymously
//                         </p>
//                       </div>
//                       <Switch
//                         enabled={settings.privacy.dataSharing}
//                         onChange={(value) =>
//                           handleSettingChange("privacy", "dataSharing", value)
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Learning Preferences */}
//             {activeTab === "learning" && (
//               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 rounded-xl p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-6">
//                   Learning Preferences
//                 </h2>

//                 <div className="space-y-6">
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between py-3">
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           Auto-play Videos
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Automatically play next video in course
//                         </p>
//                       </div>
//                       <Switch
//                         enabled={settings.learning.autoPlayVideos}
//                         onChange={(value) =>
//                           handleSettingChange(
//                             "learning",
//                             "autoPlayVideos",
//                             value,
//                           )
//                         }
//                       />
//                     </div>

//                     <div className="flex items-center justify-between py-3">
//                       <div>
//                         <p className="font-medium text-gray-900">Dark Mode</p>
//                         <p className="text-sm text-gray-600">
//                           Use dark theme across the platform
//                         </p>
//                       </div>
//                       <Switch
//                         enabled={settings.learning.darkMode}
//                         onChange={(value) =>
//                           handleSettingChange("learning", "darkMode", value)
//                         }
//                       />
//                     </div>

//                     <div className="flex items-center justify-between py-3">
//                       <div>
//                         <p className="font-medium text-gray-900">Focus Mode</p>
//                         <p className="text-sm text-gray-600">
//                           Minimize distractions during learning
//                         </p>
//                       </div>
//                       <Switch
//                         enabled={settings.learning.focusMode}
//                         onChange={(value) =>
//                           handleSettingChange("learning", "focusMode", value)
//                         }
//                       />
//                     </div>

//                     <div className="flex items-center justify-between py-3">
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           Weekly Learning Goals
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Set and track weekly learning targets
//                         </p>
//                       </div>
//                       <Switch
//                         enabled={settings.learning.weeklyGoals}
//                         onChange={(value) =>
//                           handleSettingChange("learning", "weeklyGoals", value)
//                         }
//                       />
//                     </div>

//                     {settings.learning.weeklyGoals && (
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <InputField
//                           label="Weekly Goal Hours"
//                           value={settings.learning.goalHours}
//                           onChange={(value) =>
//                             handleSettingChange("learning", "goalHours", value)
//                           }
//                           type="number"
//                           placeholder="Enter hours per week"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Payment & Billing */}
//             {activeTab === "payment" && (
//               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 rounded-xl p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-6">
//                   Payment & Billing
//                 </h2>

//                 <div className="space-y-6">
//                   <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-semibold text-blue-900">
//                           Current Plan: Pro
//                         </p>
//                         <p className="text-sm text-blue-700">
//                           $29/month • Unlimited access to all courses
//                         </p>
//                       </div>
//                       <button className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:shadow transition-all duration-300">
//                         Change Plan
//                       </button>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <InputField
//                       label="Card Number"
//                       value={settings.payment.cardNumber}
//                       onChange={(value) =>
//                         handleSettingChange("payment", "cardNumber", value)
//                       }
//                       placeholder="•••• •••• •••• ••••"
//                     />
//                     <InputField
//                       label="Expiry Date"
//                       value={settings.payment.expiryDate}
//                       onChange={(value) =>
//                         handleSettingChange("payment", "expiryDate", value)
//                       }
//                       placeholder="MM/YY"
//                     />
//                     <InputField
//                       label="Card Holder"
//                       value={settings.payment.cardHolder}
//                       onChange={(value) =>
//                         handleSettingChange("payment", "cardHolder", value)
//                       }
//                       placeholder="Full name on card"
//                     />
//                     <InputField
//                       label="Billing Address"
//                       value={settings.payment.billingAddress}
//                       onChange={(value) =>
//                         handleSettingChange("payment", "billingAddress", value)
//                       }
//                       placeholder="Enter billing address"
//                     />
//                   </div>

//                   <div className="flex items-center justify-between py-3">
//                     <div>
//                       <p className="font-medium text-gray-900">
//                         Auto-renew Subscription
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         Automatically renew your plan each month
//                       </p>
//                     </div>
//                     <Switch
//                       enabled={settings.payment.autoRenew}
//                       onChange={(value) =>
//                         handleSettingChange("payment", "autoRenew", value)
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Notifications */}
//             {activeTab === "notifications" && (
//               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 rounded-xl p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-6">
//                   Notification Preferences
//                 </h2>

//                 <div className="space-y-6">
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between py-3">
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           Email Notifications
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Receive updates via email
//                         </p>
//                       </div>
//                       <Switch
//                         enabled={settings.account.emailNotifications}
//                         onChange={(value) =>
//                           handleSettingChange(
//                             "account",
//                             "emailNotifications",
//                             value,
//                           )
//                         }
//                       />
//                     </div>

//                     <div className="flex items-center justify-between py-3">
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           Push Notifications
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Get browser push notifications
//                         </p>
//                       </div>
//                       <Switch
//                         enabled={settings.account.pushNotifications}
//                         onChange={(value) =>
//                           handleSettingChange(
//                             "account",
//                             "pushNotifications",
//                             value,
//                           )
//                         }
//                       />
//                     </div>

//                     <div className="flex items-center justify-between py-3">
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           SMS Notifications
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Receive text message alerts
//                         </p>
//                       </div>
//                       <Switch
//                         enabled={settings.account.smsNotifications}
//                         onChange={(value) =>
//                           handleSettingChange(
//                             "account",
//                             "smsNotifications",
//                             value,
//                           )
//                         }
//                       />
//                     </div>

//                     <div className="flex items-center justify-between py-3">
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           Course Updates
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Notifications about new course content
//                         </p>
//                       </div>
//                       <Switch
//                         enabled={settings.account.courseUpdates}
//                         onChange={(value) =>
//                           handleSettingChange("account", "courseUpdates", value)
//                         }
//                       />
//                     </div>

//                     <div className="flex items-center justify-between py-3">
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           Security Alerts
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Important security notifications
//                         </p>
//                       </div>
//                       <Switch
//                         enabled={settings.account.securityAlerts}
//                         onChange={(value) =>
//                           handleSettingChange(
//                             "account",
//                             "securityAlerts",
//                             value,
//                           )
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;
import { API_URL } from "../../config/api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Settings,
  Shield,
  GraduationCap,
  CreditCard,
  Bell,
  LogOut,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Globe,
  Clock,
  Mail,
  Phone,
  MapPin,
  Link2,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  Laptop,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  PlayCircle,
  Download,
  RefreshCw,
  Award,
  Zap,
  Heart,
  Star,
  TrendingUp,
  Calendar,
  Coins,
  Gift,
  Sparkles,
  Fingerprint,
  Key,
  Server,
  Database,
  MessageCircle,
  HelpCircle,
  FileText,
  ShieldCheck,
  BadgeCheck,
  Crown,
  Diamond,
  Rocket,
} from "lucide-react";

const Switch = ({ enabled, onChange, size = "md" }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
      size === "sm" ? "h-5 w-9" : "h-6 w-11"
    } ${enabled ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-md" : "bg-gray-200"}`}
  >
    <span
      className={`inline-block transform bg-white rounded-full transition-all duration-300 shadow-md ${
        size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
      } ${enabled ? (size === "sm" ? "translate-x-5" : "translate-x-6") : "translate-x-1"}`}
    />
  </button>
);

const TabButton = ({ tab, icon: Icon, label, color, gradient, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick(tab)}
    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 w-full text-left overflow-hidden ${
      isActive
        ? `text-white shadow-lg`
        : "text-gray-600 hover:bg-gray-50"
    }`}
  >
    {isActive && (
      <motion.div
        layoutId="activeTabBg"
        className={`absolute inset-0 bg-gradient-to-r ${gradient}`}
        initial={false}
        transition={{ type: "spring", duration: 0.5 }}
      />
    )}
    <Icon className={`relative z-10 ${isActive ? "text-white" : "text-gray-500"}`} size={18} />
    <span className={`relative z-10 text-sm md:text-base ${isActive ? "font-semibold" : ""}`}>
      {label}
    </span>
    {isActive && (
      <motion.div
        layoutId="activeTabIndicator"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"
      />
    )}
  </motion.button>
);

const InputField = ({ label, value, onChange, type = "text", placeholder, icon: Icon, required }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
      {Icon && <Icon size={14} className="text-gray-400" />}
      {label}
      {required && <span className="text-red-500 text-xs">*</span>}
    </label>
    <div className="relative group">
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-300"
      />
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, options, icon: Icon }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
      {Icon && <Icon size={14} className="text-gray-400" />}
      {label}
    </label>
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const SettingCard = ({ title, icon: Icon, children, gradient }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
  >
    <div className={`bg-gradient-to-r ${gradient} p-4`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
          <Icon size={18} className="text-white" />
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

const Divider = () => <div className="border-t border-gray-100 my-6" />;

  const SettingsPage = () => {
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState({ show: false, type: "", message: "" });
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
      timezone: "",
      avatarColor: "blue",
      avatar: null,
    },
    account: {
      username: "",
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: true,
      newsletter: false,
      courseUpdates: true,
      securityAlerts: true,
      twoFactorAuth: false,
    },
    privacy: {
      profileVisibility: "public",
      showProgress: true,
      showAchievements: true,
      showCourses: true,
      dataSharing: false,
      personalizedAds: false,
      searchVisibility: true,
    },
    learning: {
      autoPlayVideos: false,
      downloadQuality: "high",
      defaultPlaybackSpeed: "1.0x",
      subtitles: true,
      darkMode: false,
      focusMode: true,
      weeklyGoals: true,
      goalHours: 10,
    },
    payment: {
      plan: "pro",
      cardNumber: "",
      expiryDate: "",
      cardHolder: "",
      billingAddress: "",
      autoRenew: true,
    },
  });

  const handleSettingChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });

    const loadData = async () => {
      const storedUserJSON = localStorage.getItem("user");
      const storedUser = storedUserJSON ? JSON.parse(storedUserJSON) : null;

      if (!storedUser) {
        navigate("/login");
        return;
      }

      if (storedUser.role === "instructor") {
        window.location.replace("/instructor-dashboard");
        return;
      }

      try {
        if (storedUser) {
          const [first, ...rest] = (storedUser.fullName || "").split(" ");
          setSettings((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              firstName: first || prev.profile.firstName,
              lastName: rest.join(" ") || prev.profile.lastName,
              email: storedUser.email || prev.profile.email,
              avatar: storedUser.avatar || prev.profile.avatar,
            },
            account: {
              ...prev.account,
              username: storedUser.username || prev.account.username,
            },
          }));
        }

        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch(`${API_URL}/student/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setSettings((prev) => ({
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
                timezone: data.personal?.timezone || "",
                avatar: data.personal?.avatar || prev.profile.avatar,
              },
              account: { ...prev.account, ...(data.settings?.account || {}) },
              privacy: { ...prev.privacy, ...(data.settings?.privacy || {}) },
              learning: {
                ...prev.learning,
                ...(data.settings?.learning || {}),
              },
              payment: { ...prev.payment, ...(data.settings?.payment || {}) },
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

    setSaveStatus({ show: true, type: "loading", message: "Saving changes..." });

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
          name: `${settings.profile.firstName} ${settings.profile.lastName}`.trim(),
          avatar: settings.profile.avatar,
        },
        settings: {
          account: settings.account,
          privacy: settings.privacy,
          learning: settings.learning,
          payment: settings.payment,
        },
      };

      const response = await fetch(`${API_URL}/student/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSaveStatus({ show: true, type: "success", message: "Settings saved successfully!" });
        setTimeout(() => setSaveStatus({ show: false, type: "", message: "" }), 3000);
        
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser) {
          storedUser.firstName = settings.profile.firstName;
          storedUser.lastName = settings.profile.lastName;
          storedUser.fullName = `${settings.profile.firstName} ${settings.profile.lastName}`.trim();
          storedUser.avatar = settings.profile.avatar;
          localStorage.setItem("user", JSON.stringify(storedUser));
          window.dispatchEvent(new Event("storage"));
        }
      } else {
        setSaveStatus({ show: true, type: "error", message: "Failed to save settings." });
        setTimeout(() => setSaveStatus({ show: false, type: "", message: "" }), 3000);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus({ show: true, type: "error", message: "An error occurred while saving." });
      setTimeout(() => setSaveStatus({ show: false, type: "", message: "" }), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSettingChange("profile", "avatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("⚠️ ARE YOU SURE? This will permanently delete your account and all enrolled courses. This action cannot be undone.")) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/student/profile`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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

  const tabConfig = [
    { id: "profile", label: "Profile", icon: User, color: "blue", gradient: "from-blue-500 to-cyan-500" },
    { id: "account", label: "Account", icon: Settings, color: "purple", gradient: "from-purple-500 to-pink-500" },
    { id: "privacy", label: "Privacy", icon: Shield, color: "emerald", gradient: "from-emerald-500 to-teal-500" },
    { id: "learning", label: "Learning", icon: GraduationCap, color: "orange", gradient: "from-orange-500 to-amber-500" },
    { id: "payment", label: "Payment", icon: CreditCard, color: "indigo", gradient: "from-indigo-500 to-blue-500" },
    { id: "notifications", label: "Alerts", icon: Bell, color: "rose", gradient: "from-rose-500 to-red-500" },
  ];



  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Settings size={24} className="text-blue-500 animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading your settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      {/* Floating Save Notification */}
      <AnimatePresence>
        {saveStatus.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg ${
              saveStatus.type === "success" ? "bg-emerald-500" : 
              saveStatus.type === "error" ? "bg-red-500" : 
              "bg-gradient-to-r from-blue-500 to-purple-500"
            } text-white`}>
              {saveStatus.type === "success" && <CheckCircle size={18} />}
              {saveStatus.type === "error" && <AlertCircle size={18} />}
              {saveStatus.type === "loading" && <RefreshCw size={18} className="animate-spin" />}
              <span className="font-medium">{saveStatus.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-3xl shadow-xl mb-8"
        >
          <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10`} />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                    <Settings size={18} className="text-white" />
                  </div>
                  <span className="text-white/60 text-sm font-mono tracking-wider">SETTINGS</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Customize Your Experience
                </h1>
                <p className="text-white/60 mt-1 text-sm">
                  Manage your account preferences and personalize your learning journey
                </p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(-1)}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl text-white font-medium hover:bg-white/20 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2 justify-center"
                >
                  <Save size={16} />
                  Save Changes
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-4"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 space-y-1">
              {tabConfig.map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab.id}
                  icon={tab.icon}
                  label={tab.label}
                  color={tab.color}
                  gradient={tab.gradient}
                  isActive={activeTab === tab.id}
                  onClick={setActiveTab}
                />
              ))}
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-5 border border-red-100">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Zap size={16} className="text-orange-500" />
                Danger Zone
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors w-full text-left p-2 rounded-xl hover:bg-red-50"
                >
                  <LogOut size={16} />
                  <span className="text-sm font-medium">Sign Out All Devices</span>
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors w-full text-left p-2 rounded-xl hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  <span className="text-sm font-medium">Delete Account</span>
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-blue-500" />
                Need Help?
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Our support team is here to assist you 24/7
              </p>
              <button className="w-full py-2 bg-white rounded-xl text-blue-600 font-medium text-sm hover:shadow-md transition-all">
                Contact Support
              </button>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            <AnimatePresence mode="wait">
              {/* Profile Settings */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SettingCard title="Profile Information" icon={User} gradient="from-blue-500 to-cyan-500">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden border-4 border-white">
                          {settings.profile.avatar ? (
                            <img src={settings.profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <>
                              {settings.profile.firstName?.[0] || "U"}
                              {settings.profile.lastName?.[0] || "S"}
                            </>
                          )}
                        </div>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                        >
                          <Camera size={14} className="text-gray-600" />
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl font-bold text-gray-800">
                          {settings.profile.firstName} {settings.profile.lastName}
                        </h3>
                        <p className="text-gray-500 text-sm">{settings.profile.email}</p>
                        <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-lg text-xs text-blue-600">
                            <BadgeCheck size={10} /> Verified
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-lg text-xs text-emerald-600">
                            <Crown size={10} /> Pro Member
                          </span>
                        </div>
                      </div>
                    </div>

                    <Divider />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputField
                        label="First Name"
                        value={settings.profile.firstName}
                        onChange={(v) => handleSettingChange("profile", "firstName", v)}
                        placeholder="Enter first name"
                        icon={User}
                      />
                      <InputField
                        label="Last Name"
                        value={settings.profile.lastName}
                        onChange={(v) => handleSettingChange("profile", "lastName", v)}
                        placeholder="Enter last name"
                        icon={User}
                      />
                      <InputField
                        label="Email Address"
                        value={settings.profile.email}
                        onChange={(v) => handleSettingChange("profile", "email", v)}
                        type="email"
                        placeholder="your@email.com"
                        icon={Mail}
                      />
                      <InputField
                        label="Phone Number"
                        value={settings.profile.phone}
                        onChange={(v) => handleSettingChange("profile", "phone", v)}
                        placeholder="+1 234 567 8900"
                        icon={Phone}
                      />
                      <div className="md:col-span-2">
                        <InputField
                          label="Bio"
                          value={settings.profile.bio}
                          onChange={(v) => handleSettingChange("profile", "bio", v)}
                          placeholder="Tell us a bit about yourself..."
                          icon={MessageCircle}
                        />
                      </div>
                      <InputField
                        label="Location"
                        value={settings.profile.location}
                        onChange={(v) => handleSettingChange("profile", "location", v)}
                        placeholder="City, Country"
                        icon={MapPin}
                      />
                      <InputField
                        label="Website"
                        value={settings.profile.website}
                        onChange={(v) => handleSettingChange("profile", "website", v)}
                        placeholder="https://your-website.com"
                        icon={Link2}
                      />
                      <SelectField
                        label="Language"
                        value={settings.profile.language}
                        onChange={(v) => handleSettingChange("profile", "language", v)}
                        icon={Globe}
                        options={[
                          { value: "English", label: "🇺🇸 English" },
                          { value: "Spanish", label: "🇪🇸 Spanish" },
                          { value: "French", label: "🇫🇷 French" },
                          { value: "German", label: "🇩🇪 German" },
                          { value: "Japanese", label: "🇯🇵 Japanese" },
                        ]}
                      />
                      <SelectField
                        label="Timezone"
                        value={settings.profile.timezone}
                        onChange={(v) => handleSettingChange("profile", "timezone", v)}
                        icon={Clock}
                        options={[
                          { value: "UTC-8", label: "Pacific Time (UTC-8)" },
                          { value: "UTC-5", label: "Eastern Time (UTC-5)" },
                          { value: "UTC+0", label: "GMT (UTC+0)" },
                          { value: "UTC+1", label: "Central European (UTC+1)" },
                          { value: "UTC+5:30", label: "Indian Standard (UTC+5:30)" },
                          { value: "UTC+9", label: "Japan Standard (UTC+9)" },
                        ]}
                      />
                    </div>
                  </SettingCard>
                </motion.div>
              )}

              {/* Account Settings */}
              {activeTab === "account" && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SettingCard title="Account & Security" icon={Settings} gradient="from-purple-500 to-pink-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputField
                        label="Username"
                        value={settings.account.username}
                        onChange={(v) => handleSettingChange("account", "username", v)}
                        placeholder="Choose a username"
                        icon={User}
                      />
                    </div>

                    <Divider />

                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Lock size={16} className="text-purple-500" />
                      Security Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <Switch
                          enabled={settings.account.twoFactorAuth}
                          onChange={(v) => handleSettingChange("account", "twoFactorAuth", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-gray-800">Login Alerts</p>
                          <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
                        </div>
                        <Switch enabled={true} onChange={() => {}} />
                      </div>
                    </div>

                    <Divider />

                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Fingerprint size={20} className="text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-blue-800">Security Recommendation</p>
                          <p className="text-xs text-blue-600 mt-1">
                            Enable two-factor authentication to protect your account from unauthorized access.
                          </p>
                        </div>
                      </div>
                    </div>
                  </SettingCard>
                </motion.div>
              )}

              {/* Privacy Settings */}
              {activeTab === "privacy" && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SettingCard title="Privacy Controls" icon={Shield} gradient="from-emerald-500 to-teal-500">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">Profile Visibility</p>
                          <p className="text-sm text-gray-500">Control who can see your profile</p>
                        </div>
                        <SelectField
                          value={settings.privacy.profileVisibility}
                          onChange={(v) => handleSettingChange("privacy", "profileVisibility", v)}
                          options={[
                            { value: "public", label: "🌍 Public" },
                            { value: "private", label: "🔒 Private" },
                            { value: "friends", label: "👥 Friends Only" },
                          ]}
                        />
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">Show Learning Progress</p>
                          <p className="text-sm text-gray-500">Display your course progress to others</p>
                        </div>
                        <Switch
                          enabled={settings.privacy.showProgress}
                          onChange={(v) => handleSettingChange("privacy", "showProgress", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">Show Achievements</p>
                          <p className="text-sm text-gray-500">Display your badges and certificates</p>
                        </div>
                        <Switch
                          enabled={settings.privacy.showAchievements}
                          onChange={(v) => handleSettingChange("privacy", "showAchievements", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">Data Sharing for Research</p>
                          <p className="text-sm text-gray-500">Help improve our platform anonymously</p>
                        </div>
                        <Switch
                          enabled={settings.privacy.dataSharing}
                          onChange={(v) => handleSettingChange("privacy", "dataSharing", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-gray-800">Personalized Ads</p>
                          <p className="text-sm text-gray-500">Receive personalized advertising</p>
                        </div>
                        <Switch
                          enabled={settings.privacy.personalizedAds}
                          onChange={(v) => handleSettingChange("privacy", "personalizedAds", v)}
                        />
                      </div>
                    </div>

                    <Divider />

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Database size={18} className="text-gray-500" />
                        <p className="text-xs text-gray-500">
                          Your data is encrypted and stored securely. We never share your personal information without consent.
                        </p>
                      </div>
                    </div>
                  </SettingCard>
                </motion.div>
              )}

              {/* Learning Preferences */}
              {activeTab === "learning" && (
                <motion.div
                  key="learning"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SettingCard title="Learning Environment" icon={GraduationCap} gradient="from-orange-500 to-amber-500">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">Auto-play Videos</p>
                          <p className="text-sm text-gray-500">Automatically play next video in course</p>
                        </div>
                        <Switch
                          enabled={settings.learning.autoPlayVideos}
                          onChange={(v) => handleSettingChange("learning", "autoPlayVideos", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">Dark Mode</p>
                          <p className="text-sm text-gray-500">Use dark theme across the platform</p>
                        </div>
                        <Switch
                          enabled={settings.learning.darkMode}
                          onChange={(v) => handleSettingChange("learning", "darkMode", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">Focus Mode</p>
                          <p className="text-sm text-gray-500">Minimize distractions during learning</p>
                        </div>
                        <Switch
                          enabled={settings.learning.focusMode}
                          onChange={(v) => handleSettingChange("learning", "focusMode", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">Subtitles / Closed Captions</p>
                          <p className="text-sm text-gray-500">Display subtitles for all videos</p>
                        </div>
                        <Switch
                          enabled={settings.learning.subtitles}
                          onChange={(v) => handleSettingChange("learning", "subtitles", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">Weekly Learning Goals</p>
                          <p className="text-sm text-gray-500">Set and track weekly learning targets</p>
                        </div>
                        <Switch
                          enabled={settings.learning.weeklyGoals}
                          onChange={(v) => handleSettingChange("learning", "weeklyGoals", v)}
                        />
                      </div>
                    </div>

                    {settings.learning.weeklyGoals && (
                      <>
                        <Divider />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <InputField
                            label="Weekly Goal Hours"
                            value={settings.learning.goalHours}
                            onChange={(v) => handleSettingChange("learning", "goalHours", v)}
                            type="number"
                            placeholder="10"
                            icon={Clock}
                          />
                          <SelectField
                            label="Default Playback Speed"
                            value={settings.learning.defaultPlaybackSpeed}
                            onChange={(v) => handleSettingChange("learning", "defaultPlaybackSpeed", v)}
                            options={[
                              { value: "0.75x", label: "0.75x" },
                              { value: "1.0x", label: "1.0x (Normal)" },
                              { value: "1.25x", label: "1.25x" },
                              { value: "1.5x", label: "1.5x" },
                              { value: "2.0x", label: "2.0x" },
                            ]}
                          />
                          <SelectField
                            label="Download Quality"
                            value={settings.learning.downloadQuality}
                            onChange={(v) => handleSettingChange("learning", "downloadQuality", v)}
                            options={[
                              { value: "high", label: "High (1080p)" },
                              { value: "medium", label: "Medium (720p)" },
                              { value: "low", label: "Low (480p)" },
                            ]}
                          />
                        </div>
                      </>
                    )}
                  </SettingCard>
                </motion.div>
              )}

              {/* Payment Settings */}
              {activeTab === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SettingCard title="Billing & Subscription" icon={CreditCard} gradient="from-indigo-500 to-blue-500">
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-5 mb-6 border border-indigo-100">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Crown size={18} className="text-indigo-600" />
                            <span className="font-bold text-indigo-900">Pro Plan</span>
                            <span className="px-2 py-0.5 bg-indigo-200 text-indigo-700 text-xs rounded-full">Active</span>
                          </div>
                          <p className="text-sm text-indigo-700">$29/month • Unlimited access to all courses</p>
                          <p className="text-xs text-indigo-500 mt-1">Next billing date: April 15, 2026</p>
                        </div>
                        <button className="px-4 py-2 bg-white border border-indigo-300 text-indigo-600 rounded-xl hover:shadow-md transition-all text-sm font-medium">
                          Change Plan
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputField
                        label="Card Number"
                        value={settings.payment.cardNumber}
                        onChange={(v) => handleSettingChange("payment", "cardNumber", v)}
                        placeholder="•••• •••• •••• ••••"
                        icon={CreditCard}
                      />
                      <InputField
                        label="Expiry Date"
                        value={settings.payment.expiryDate}
                        onChange={(v) => handleSettingChange("payment", "expiryDate", v)}
                        placeholder="MM/YY"
                      />
                      <InputField
                        label="Card Holder Name"
                        value={settings.payment.cardHolder}
                        onChange={(v) => handleSettingChange("payment", "cardHolder", v)}
                        placeholder="Full name on card"
                      />
                      <InputField
                        label="Billing Address"
                        value={settings.payment.billingAddress}
                        onChange={(v) => handleSettingChange("payment", "billingAddress", v)}
                        placeholder="Enter billing address"
                      />
                    </div>

                    <Divider />

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-800">Auto-renew Subscription</p>
                        <p className="text-sm text-gray-500">Automatically renew your plan each month</p>
                      </div>
                      <Switch
                        enabled={settings.payment.autoRenew}
                        onChange={(v) => handleSettingChange("payment", "autoRenew", v)}
                      />
                    </div>

                    <div className="mt-4 bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <ShieldCheck size={16} />
                        <span>Your payment information is encrypted and secure. We never store full card details.</span>
                      </div>
                    </div>
                  </SettingCard>
                </motion.div>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SettingCard title="Notification Center" icon={Bell} gradient="from-rose-500 to-red-500">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive updates and announcements via email</p>
                        </div>
                        <Switch
                          enabled={settings.account.emailNotifications}
                          onChange={(v) => handleSettingChange("account", "emailNotifications", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">Push Notifications</p>
                          <p className="text-sm text-gray-500">Get browser push notifications</p>
                        </div>
                        <Switch
                          enabled={settings.account.pushNotifications}
                          onChange={(v) => handleSettingChange("account", "pushNotifications", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">SMS Notifications</p>
                          <p className="text-sm text-gray-500">Receive text message alerts</p>
                        </div>
                        <Switch
                          enabled={settings.account.smsNotifications}
                          onChange={(v) => handleSettingChange("account", "smsNotifications", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">Course Updates</p>
                          <p className="text-sm text-gray-500">New content and course announcements</p>
                        </div>
                        <Switch
                          enabled={settings.account.courseUpdates}
                          onChange={(v) => handleSettingChange("account", "courseUpdates", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-gray-800">Security Alerts</p>
                          <p className="text-sm text-gray-500">Important security notifications</p>
                        </div>
                        <Switch
                          enabled={settings.account.securityAlerts}
                          onChange={(v) => handleSettingChange("account", "securityAlerts", v)}
                        />
                      </div>
                    </div>

                    <Divider />

                    <div className="bg-amber-50 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Bell size={18} className="text-amber-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-800">Stay Updated</p>
                          <p className="text-xs text-amber-600 mt-1">
                            We'll only send you important updates about your courses and account activity.
                          </p>
                        </div>
                      </div>
                    </div>
                  </SettingCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Camera icon component
const Camera = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

export default SettingsPage;