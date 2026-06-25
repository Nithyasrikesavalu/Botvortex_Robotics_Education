import { API_URL } from "../../config/api";
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  User,
  Award,
  Settings as SettingsIcon,
  LogOut,
  Search,
  Shield,
  Lock,
  CreditCard,
  ChevronRight,
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  Menu,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Edit,
  Upload,
  BookOpenCheck,
  Bell,
  Play
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Sub-components & Helpers
   ───────────────────────────────────────────────────────────── */

const Switch = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${enabled ? "bg-blue-600" : "bg-slate-200"
      }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-1"
        }`}
    />
  </button>
);

const InputField = ({ label, value, onChange, type = "text", placeholder, icon: Icon, disabled = false }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="relative">
      {Icon && (
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      )}
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full border border-slate-200 rounded-xl py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all ${Icon ? "pl-10 pr-4" : "px-4"
          } ${disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`}
      />
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, options, disabled = false }) => (
  <div className="space-y-1.5 w-full">
    {label && (
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    )}
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 bg-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer ${disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""
        }`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, disabled = false }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      rows={3}
      className={`w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all ${disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""
        }`}
    />
  </div>
);

const SectionDivider = ({ title }) => (
  <div className="flex items-center gap-3 pt-4 pb-2">
    <span className="text-xs font-bold uppercase tracking-widest text-blue-600">{title}</span>
    <div className="flex-1 h-px bg-slate-100" />
  </div>
);

const ToggleRow = ({ label, description, enabled, onChange }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0">
    <div className="pr-4">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
    <Switch enabled={enabled} onChange={onChange} />
  </div>
);

const InfoRow = ({ section, field, label, value, editMode, handleChange }) => (
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 py-3 border-b border-slate-100 hover:bg-slate-50/50 transition-all duration-150 rounded-lg px-2">
    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[180px] flex items-center">
      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2.5 shrink-0"></span>
      {label}
    </span>
    {editMode ? (
      <input
        className="flex-1 text-sm border border-slate-200 bg-white px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
        value={value || ""}
        onChange={(e) => handleChange(section, field, e.target.value)}
      />
    ) : (
      <span className="flex-1 text-sm text-slate-800 font-medium bg-slate-50/50 px-3 py-1.5 rounded-lg border border-transparent">
        {value || "N/A"}
      </span>
    )}
  </div>
);

const ProgressBar = ({ value = 0 }) => (
  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
    <div
      className="h-2 rounded-full bg-blue-600 transition-all duration-500"
      style={{ width: `${value}%` }}
    />
  </div>
);

/* ─────────────────────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────────────────────── */

const BotVortexMyCourses = ({ defaultTab = "courses" }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data States — all from API
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  // Profile
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [profileTab, setProfileTab] = useState("personal");

  // Toast
  const [saveStatus, setSaveStatus] = useState({ show: false, type: "", message: "" });

  // Settings (loaded from API)
  const [settings, setSettings] = useState({
    profile: { firstName: "", lastName: "", email: "", phone: "", bio: "", location: "", website: "", language: "English", timezone: "IST (UTC+5:30)" },
    account: { username: "", twoFactorAuth: false },
    privacy: { profileVisibility: "public", showProgress: true, showAchievements: true, showCourses: true, dataSharing: false, searchVisibility: true },
    notifications: { emailNotifications: true, pushNotifications: false, smsNotifications: true, courseUpdates: true, securityAlerts: true },
    learning: { autoPlayVideos: false, subtitles: true, darkMode: false, focusMode: true, weeklyGoals: true, goalHours: 10, defaultPlaybackSpeed: "1.0x" },
    payment: { plan: "pro", cardNumber: "", expiryDate: "", cardHolder: "", billingAddress: "", autoRenew: true }
  });

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  /* ── Load all data from API ── */
  const loadDashboardData = async () => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!token || !storedUser) { navigate("/login"); return; }
    if (storedUser.role === "instructor") { window.location.replace("/instructor-dashboard"); return; }

    try {
      const profileRes = await fetch(`${API_URL}/student/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfileData(data);

        const [first, ...rest] = (data.fullName || storedUser.fullName || "").split(" ");
        setSettings({
          profile: {
            firstName: data.personal?.firstName || first || "",
            lastName: data.personal?.lastName || rest.join(" ") || "",
            email: data.personal?.email || storedUser.email || "",
            phone: data.personal?.phone || storedUser.phone || "",
            bio: data.personal?.bio || "",
            location: data.personal?.location || "",
            website: data.personal?.website || "",
            language: data.personal?.language || "English",
            timezone: data.personal?.timezone || "IST (UTC+5:30)"
          },
          account: { username: data.personal?.studentAccount || storedUser.username || "", twoFactorAuth: data.settings?.account?.twoFactorAuth || false },
          privacy: {
            profileVisibility: data.settings?.privacy?.profileVisibility || "public",
            showProgress: data.settings?.privacy?.showProgress !== false,
            showAchievements: data.settings?.privacy?.showAchievements !== false,
            showCourses: data.settings?.privacy?.showCourses !== false,
            dataSharing: data.settings?.privacy?.dataSharing || false,
            searchVisibility: data.settings?.privacy?.searchVisibility !== false
          },
          notifications: {
            emailNotifications: data.settings?.notifications?.emailNotifications !== false,
            pushNotifications: data.settings?.notifications?.pushNotifications || false,
            smsNotifications: data.settings?.notifications?.smsNotifications || false,
            courseUpdates: data.settings?.notifications?.courseUpdates !== false,
            securityAlerts: data.settings?.notifications?.securityAlerts !== false
          },
          learning: {
            autoPlayVideos: data.settings?.learning?.autoPlayVideos || false,
            subtitles: data.settings?.learning?.subtitles !== false,
            darkMode: data.settings?.learning?.darkMode || false,
            focusMode: data.settings?.learning?.focusMode || false,
            weeklyGoals: data.settings?.learning?.weeklyGoals !== false,
            goalHours: data.settings?.learning?.goalHours || 10,
            defaultPlaybackSpeed: data.settings?.learning?.defaultPlaybackSpeed || "1.0x"
          },
          payment: {
            plan: data.settings?.payment?.plan || "pro",
            cardNumber: data.settings?.payment?.cardNumber || "",
            expiryDate: data.settings?.payment?.expiryDate || "",
            cardHolder: data.settings?.payment?.cardHolder || "",
            billingAddress: data.settings?.payment?.billingAddress || "",
            autoRenew: data.settings?.payment?.autoRenew !== false
          }
        });
      }

      const courseRes = await fetch(`${API_URL}/student/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (courseRes.ok) {
        const data = await courseRes.json();
        setEnrolled(data);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboardData(); }, []);

  /* ── Derived stats ── */
  const totals = useMemo(() => {
    const total = enrolled.length;
    const completed = enrolled.filter((c) => c.progress >= 100).length;
    const certs = enrolled.filter((c) => c.certificate).length;
    return { total, completed, certs };
  }, [enrolled]);

  /* ── Filtered courses ── */
  const filteredCourses = useMemo(() => {
    return enrolled.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.courseId?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (courseFilter === "inprogress") return c.progress < 100;
      if (courseFilter === "completed") return c.progress >= 100;
      return true;
    });
  }, [enrolled, searchQuery, courseFilter]);

  /* ── Profile handlers ── */
  const handleProfileChange = (section, field, value) => {
    setProfileData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setSaveStatus({ show: true, type: "loading", message: "Saving changes…" });
    const names = (profileData.personal?.name || "").trim().split(" ");
    const payload = { ...profileData, personal: { ...profileData.personal, firstName: names[0] || "", lastName: names.slice(1).join(" ") || "" } };
    try {
      const res = await fetch(`${API_URL}/student/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        stored.fullName = profileData.personal?.name;
        localStorage.setItem("user", JSON.stringify(stored));
        window.dispatchEvent(new Event("storage"));
        setSaveStatus({ show: true, type: "success", message: "Profile updated successfully!" });
        setProfileEditMode(false);
      } else {
        setSaveStatus({ show: true, type: "error", message: "Failed to update profile." });
      }
    } catch {
      setSaveStatus({ show: true, type: "error", message: "Error updating profile." });
    }
    setTimeout(() => setSaveStatus({ show: false, type: "", message: "" }), 3000);
  };

  /* ── Settings handler ── */
  const handleSettingChange = (section, field, value) => {
    setSettings((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleSaveSettings = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setSaveStatus({ show: true, type: "loading", message: "Saving settings…" });
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
        notifications: settings.notifications,
        learning: settings.learning,
        payment: settings.payment
      }
    };
    try {
      const res = await fetch(`${API_URL}/student/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        stored.fullName = payload.personal.name;
        localStorage.setItem("user", JSON.stringify(stored));
        window.dispatchEvent(new Event("storage"));
        setSaveStatus({ show: true, type: "success", message: "Settings saved successfully." });
        loadDashboardData();
      } else {
        setSaveStatus({ show: true, type: "error", message: "Failed to save settings." });
      }
    } catch {
      setSaveStatus({ show: true, type: "error", message: "Network error. Please try again." });
    }
    setTimeout(() => setSaveStatus({ show: false, type: "", message: "" }), 3000);
  };

  /* ── Certificate download ── */
  const handleDownloadCertificate = (course) => {
    const name = profileData?.fullName || profileData?.personal?.name || JSON.parse(localStorage.getItem("user"))?.fullName || "Student";
    const html = `
      <html><head><title>Certificate - ${course.title}</title>
      <style>
        body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f8fafc; font-family: 'Inter', sans-serif; }
        .cert { width: 800px; padding: 60px; background: white; border: 20px solid #f1f5f9; text-align: center; box-shadow: 0 10px 30px -5px rgb(0 0 0 / 0.08); border-radius: 12px; position: relative; }
        .cert-inner { border: 2px solid #e2e8f0; padding: 40px; }
        .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 20px; letter-spacing: -1px; }
        .logo span { color: #2563eb; }
        h1 { color: #0f172a; font-size: 38px; margin-bottom: 10px; font-weight: 700; }
        h2 { color: #64748b; font-size: 16px; margin-bottom: 30px; font-weight: 400; text-transform: uppercase; letter-spacing: 2px; }
        .name { font-size: 32px; font-weight: 700; color: #0f172a; margin: 20px 0; border-bottom: 2px solid #2563eb; display: inline-block; padding: 0 50px 10px; }
        .desc { font-size: 15px; color: #64748b; margin-bottom: 30px; line-height: 1.6; }
        .footer { display: flex; justify-content: space-between; margin-top: 50px; }
        .sig { border-top: 1px solid #e2e8f0; width: 180px; padding-top: 10px; font-size: 13px; color: #64748b; font-weight: 500; }
        .badge-cert { width: 80px; height: 80px; background: #eff6ff; border-radius: 50%; border: 4px solid #dbeafe; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
      </style></head>
      <body>
        <div class="cert"><div class="cert-inner">
          <div class="logo">Bot<span>Vortex</span></div>
          <div class="badge-cert"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
          <h1>Certificate of Achievement</h1>
          <h2>This is proudly presented to</h2>
          <div class="name">${name}</div>
          <p class="desc">for successfully completing all requirements associated with<br>
          <strong style="color: #0f172a; font-size: 18px;">${course.title}</strong></p>
          <div class="footer">
            <div class="sig">Program Director</div>
            <div class="sig">BotVortex Academy<br/>${new Date().toLocaleDateString()}</div>
          </div>
        </div></div>
      </body></html>`;
    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); }
    else alert("Popup blocked — allow popups to view certificate.");
  };

  /* ── Demo init ── */
  const handleInitDemo = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/student/courses/init-demo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) loadDashboardData();
    } catch (err) { console.error(err); }
  };

  /* ── Delete account ── */
  const handleDeleteAccount = async () => {
    if (!window.confirm("This will permanently delete your account and all enrolled courses. This action cannot be undone.")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/student/profile`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) { localStorage.clear(); navigate("/"); window.location.reload(); }
      else alert("Failed to delete account.");
    } catch { alert("Error connecting to server."); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const studentName = profileData?.fullName || profileData?.personal?.name || "Student";
  const studentInitials = studentName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "ST";

  /* ── Sidebar menu — only real data tabs ── */
  const menuItems = [
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "dashboard", label: "My Dashboard", icon: User },
    { id: "settings", label: "Settings", icon: SettingsIcon }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    if (tabId === "courses" || tabId === "certificates") navigate("/my-courses");
    else if (tabId === "dashboard") navigate("/dashboard");
    else if (tabId === "settings") navigate("/settings");
  };

  /* ════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800">

      {/* ── Save Toast ── */}
      {saveStatus.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold transition-all duration-200 ${saveStatus.type === "success" ? "bg-white border-emerald-100 text-emerald-700" :
            saveStatus.type === "error" ? "bg-white border-red-100 text-red-600" :
              "bg-white border-blue-100 text-blue-600"
          }`}>
          {saveStatus.type === "success" && <CheckCircle size={16} className="text-emerald-500" />}
          {saveStatus.type === "error" && <AlertCircle size={16} className="text-red-500" />}
          {saveStatus.type === "loading" && <RefreshCw size={16} className="animate-spin text-blue-500" />}
          {saveStatus.message}
        </div>
      )}

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 sticky top-0 h-screen z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">B</div>
          <span className="font-extrabold text-xl text-[#0F172A] tracking-tight">BotVortex</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? "bg-[#EFF6FF] text-[#0F172A] border-l-4 border-[#2563EB]" : "text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]"
                  }`}
              >
                <Icon size={18} className={isActive ? "text-[#2563EB]" : "text-[#64748B]"} />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative flex flex-col w-72 max-w-xs bg-white h-full shadow-2xl z-50">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">B</div>
                <span className="font-extrabold text-xl text-[#0F172A] tracking-tight">BotVortex</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? "bg-[#EFF6FF] text-[#0F172A] border-l-4 border-[#2563EB]" : "text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]"
                      }`}
                  >
                    <Icon size={18} className={isActive ? "text-[#2563EB]" : "text-[#64748B]"} />
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-100">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
                <LogOut size={18} /><span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full overflow-x-hidden">

        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-[#0F172A]">
              <Menu size={22} />
            </button>
            {/* Search bar — filters courses when on courses tab */}
            <div className="relative w-48 sm:w-64 md:w-80 max-w-md hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-1.5 outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all text-xs font-medium text-slate-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <div
              onClick={() => handleTabClick("profile")}
              className="flex items-center gap-3 pl-3 border-l border-slate-200 cursor-pointer"
            >
              <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md shadow-blue-100 overflow-hidden shrink-0 border border-blue-100">
                {profileData?.avatar ? (
                  <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : studentInitials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">{studentName}</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">Student</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6 md:space-y-8">

          {/* ══════════════ 1. MY COURSES ══════════════ */}
          {activeTab === "courses" && (
            <div className="space-y-6 md:space-y-8">

              {/* Summary Strip */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Enrolled", value: totals.total, color: "bg-blue-50 text-blue-700" },
                  { label: "Completed", value: totals.completed, color: "bg-emerald-50 text-emerald-700" },
                  { label: "Certificates", value: totals.certs, color: "bg-amber-50 text-amber-700" }
                ].map((stat) => (
                  <div key={stat.label} className={`rounded-2xl px-5 py-4 ${stat.color} flex flex-col gap-1`}>
                    <span className="text-2xl font-extrabold">{stat.value}</span>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Header + Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">My Courses</h2>
                  <p className="text-sm text-[#64748B] mt-1 font-medium">Your enrolled courses from BotVortex</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none text-xs font-semibold text-slate-700 focus:border-blue-600 cursor-pointer shadow-sm"
                  >
                    <option value="all">All Courses</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <Link
                    to="/Courses"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    Explore Catalog <ChevronRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Course Grid */}
              {filteredCourses.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <BookOpenCheck size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
                  <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm font-medium">
                    {enrolled.length === 0
                      ? "You haven't enrolled in any courses yet. Browse the catalog to get started!"
                      : "No courses match your current filter."}
                  </p>
                  {enrolled.length === 0 && (
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link
                        to="/Courses"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-2"
                      >
                        Browse Courses <ChevronRight size={14} />
                      </Link>
                      <button
                        onClick={handleInitDemo}
                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-all inline-flex items-center gap-2 text-xs shadow-sm"
                      >
                        Load Demo Courses <Play size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.courseId}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col h-full"
                    >
                      {/* Thumbnail */}
                      <div className="h-36 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl shadow-sm border border-blue-100">
                          {course.thumbnailEmoji || "🎓"}
                        </div>
                        <span className="absolute top-4 left-4 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {course.courseId}
                        </span>
                        {course.progress >= 100 && (
                          <span className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                            Completed
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="font-bold text-slate-900 text-base line-clamp-1" title={course.title}>
                            {course.title}
                          </h3>
                          <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                            <User size={13} className="text-slate-400" />
                            {course.instructor || "BotVortex Instructor"}
                          </p>

                          {/* Progress */}
                          <div className="pt-2">
                            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                              <span className="text-slate-700">{course.progress}% Completed</span>
                              <span className="text-slate-400">
                                {course.completedLessons || 0}/{course.totalLessons || 10} Lessons
                              </span>
                            </div>
                            <ProgressBar value={course.progress} />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
                          <Link
                            to="/CoursesModule"
                            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-bold transition-all"
                          >
                            {course.progress > 0 ? "Continue Learning" : "Start Course"}
                          </Link>
                          {course.certificate && (
                            <button
                              onClick={() => handleDownloadCertificate(course)}
                              className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 p-2 rounded-xl transition-all"
                              title="Download Certificate"
                            >
                              <Download size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ 2. CERTIFICATES ══════════════ */}
          {activeTab === "certificates" && (
            <div className="space-y-6 md:space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">Certificates</h2>
                <p className="text-sm text-[#64748B] mt-1 font-medium">Your earned certificates from completed courses</p>
              </div>

              {enrolled.filter(c => c.certificate).length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Award size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No certificates yet</h3>
                  <p className="text-slate-500 mb-6 max-w-sm mx-auto text-sm font-medium">
                    Complete a course (reach 100% progress) to earn your certificate.
                  </p>
                  <button
                    onClick={() => handleTabClick("courses")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    View My Courses
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolled.filter(c => c.certificate).map((course) => (
                    <div
                      key={course.courseId}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
                    >
                      <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-100 relative">
                        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xl shadow-sm">
                          🏆
                        </div>
                        <span className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Certified
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-base line-clamp-1">{course.title}</h3>
                          <p className="text-xs text-slate-400 font-medium mt-1">
                            Issued by BotVortex Academy · {new Date().toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDownloadCertificate(course)}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                        >
                          <Download size={14} /> Download Certificate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ 3. MY PROFILE ══════════════ */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">My Dashboard</h2>
                  <p className="text-sm text-[#64748B] mt-1 font-medium">Overview of your dashboard and quick actions</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Card */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl font-extrabold shadow-inner border border-slate-200 overflow-hidden">
                        {profileData?.avatar ? (
                          <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : studentInitials}
                      </div>
                      {profileEditMode && (
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white transition-all" title="Change Avatar">
                          <Upload size={14} />
                        </button>
                      )}
                    </div>
                    <h3 className="font-extrabold text-lg text-slate-900 leading-tight">{studentName}</h3>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
                      {profileData?.personal?.role || "Student"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      {profileData?.personal?.email || JSON.parse(localStorage.getItem("user"))?.email}
                    </p>

                    <div className="w-full h-px bg-slate-100 my-6" />

                    {/* Stats */}
                    <div className="w-full grid grid-cols-3 gap-3 text-center">
                      <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-lg font-extrabold text-blue-700">{totals.total}</p>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mt-0.5">Courses</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-3">
                        <p className="text-lg font-extrabold text-emerald-700">{totals.completed}</p>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-0.5">Done</p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-3">
                        <p className="text-lg font-extrabold text-amber-700">{totals.certs}</p>
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mt-0.5">Certs</p>
                      </div>
                    </div>

                    <div className="w-full mt-6">
                      {!profileEditMode ? (
                        <button
                          onClick={() => setProfileEditMode(true)}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Edit size={14} /> Edit Profile
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => setProfileEditMode(false)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-all">
                            Cancel
                          </button>
                          <button onClick={handleSaveProfile} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all">
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Card */}
                <div className="lg:col-span-8">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col h-full">
                    <div className="flex border-b border-slate-100 pb-3 gap-2 overflow-x-auto shrink-0">
                      {[
                        { id: "personal", label: "Personal Info" },
                        { id: "education", label: "Education" },
                        { id: "academic", label: "Academic" }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setProfileTab(tab.id)}
                          className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all whitespace-nowrap ${profileTab === tab.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 py-6 space-y-2">
                      {profileTab === "personal" && profileData?.personal && (
                        <div className="space-y-1">
                          {Object.keys(profileData.personal).map((key) => {
                            if (["firstName", "lastName"].includes(key)) return null;
                            return (
                              <InfoRow
                                key={key}
                                section="personal"
                                field={key}
                                label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                                value={profileData.personal[key]}
                                editMode={profileEditMode}
                                handleChange={handleProfileChange}
                              />
                            );
                          })}
                        </div>
                      )}
                      {profileTab === "education" && profileData?.education && (
                        <div className="space-y-1">
                          {Object.keys(profileData.education).map((key) => (
                            <InfoRow
                              key={key}
                              section="education"
                              field={key}
                              label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                              value={profileData.education[key]}
                              editMode={profileEditMode}
                              handleChange={handleProfileChange}
                            />
                          ))}
                        </div>
                      )}
                      {profileTab === "academic" && profileData?.academic && (
                        <div className="space-y-1">
                          {Object.keys(profileData.academic).map((key) => (
                            <InfoRow
                              key={key}
                              section="academic"
                              field={key}
                              label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                              value={profileData.academic[key]}
                              editMode={profileEditMode}
                              handleChange={handleProfileChange}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ 4. SETTINGS ══════════════ */}
          {activeTab === "settings" && (
            <div className="space-y-6 md:space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">Settings</h2>
                <p className="text-sm text-[#64748B] mt-1 font-medium">Manage your account preferences and security</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left nav */}
                <div className="lg:col-span-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-1.5 sticky top-24">
                    {[
                      { id: "profile", label: "Personal Info", icon: User },
                      { id: "account", label: "Security & Account", icon: Lock },
                      { id: "privacy", label: "Privacy & Data", icon: Shield },
                      { id: "notifications", label: "Notification Settings", icon: Bell },
                      { id: "learning", label: "Preferences & Playback", icon: BookOpen },
                      { id: "payment", label: "Billing & Plans", icon: CreditCard }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = profileTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setProfileTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                        >
                          <Icon size={14} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right form */}
                <div className="lg:col-span-8">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 flex flex-col h-full">
                    <div className="space-y-6">

                      {profileTab === "profile" && (
                        <div className="space-y-4">
                          <h3 className="font-bold text-slate-800 text-base">Personal Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField label="First Name" value={settings.profile.firstName} onChange={(v) => handleSettingChange("profile", "firstName", v)} placeholder="First Name" />
                            <InputField label="Last Name" value={settings.profile.lastName} onChange={(v) => handleSettingChange("profile", "lastName", v)} placeholder="Last Name" />
                          </div>
                          <InputField label="Email Address" value={settings.profile.email} onChange={(v) => handleSettingChange("profile", "email", v)} placeholder="email@example.com" icon={Mail} />
                          <InputField label="Phone Number" value={settings.profile.phone} onChange={(v) => handleSettingChange("profile", "phone", v)} placeholder="Phone Number" icon={Phone} />
                          <TextAreaField label="Biography" value={settings.profile.bio} onChange={(v) => handleSettingChange("profile", "bio", v)} placeholder="Write a short summary about yourself..." />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField label="Location" value={settings.profile.location} onChange={(v) => handleSettingChange("profile", "location", v)} placeholder="City, Country" icon={MapPin} />
                            <InputField label="Personal Website" value={settings.profile.website} onChange={(v) => handleSettingChange("profile", "website", v)} placeholder="https://example.com" icon={Globe} />
                          </div>
                        </div>
                      )}

                      {profileTab === "account" && (
                        <div className="space-y-4">
                          <h3 className="font-bold text-slate-800 text-base">Account Security</h3>
                          <InputField label="Username" value={settings.account.username} onChange={() => { }} placeholder="Username" disabled />
                          <SectionDivider title="Authentication" />
                          <ToggleRow
                            label="Two-Factor Authentication"
                            description="Add an extra layer of security using SMS or authenticator app."
                            enabled={settings.account.twoFactorAuth}
                            onChange={(v) => handleSettingChange("account", "twoFactorAuth", v)}
                          />
                          <SectionDivider title="Danger Zone" />
                          <div className="p-4 rounded-xl border border-red-100 bg-red-50/30 space-y-4">
                            <div>
                              <h4 className="text-xs font-bold text-red-700 uppercase tracking-widest">Delete Account</h4>
                              <p className="text-xs text-slate-500 mt-1 font-medium">
                                Once deleted, your enrollment data, coins and certificates will be permanently wiped.
                              </p>
                            </div>
                            <button
                              onClick={handleDeleteAccount}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                            >
                              Delete Permanently
                            </button>
                          </div>
                        </div>
                      )}

                      {profileTab === "privacy" && (
                        <div className="space-y-4">
                          <h3 className="font-bold text-slate-800 text-base">Privacy Settings</h3>
                          <SelectField
                            label="Profile Visibility"
                            value={settings.privacy.profileVisibility}
                            onChange={(v) => handleSettingChange("privacy", "profileVisibility", v)}
                            options={[
                              { value: "public", label: "Public — Accessible by instructors & students" },
                              { value: "private", label: "Private — Visible only to yourself" }
                            ]}
                          />
                          <SectionDivider title="Data Sharing" />
                          <ToggleRow label="Share progress with instructors" description="Let course coordinators review your module progress." enabled={settings.privacy.showProgress} onChange={(v) => handleSettingChange("privacy", "showProgress", v)} />
                          <ToggleRow label="Show achievements in leaderboard" description="Showcase earned trophies to challenge other learners." enabled={settings.privacy.showAchievements} onChange={(v) => handleSettingChange("privacy", "showAchievements", v)} />
                          <ToggleRow label="Visible in search" description="Allow indexing of your developer achievements." enabled={settings.privacy.searchVisibility} onChange={(v) => handleSettingChange("privacy", "searchVisibility", v)} />
                        </div>
                      )}

                      {profileTab === "notifications" && (
                        <div className="space-y-4">
                          <h3 className="font-bold text-slate-800 text-base">Notification Preferences</h3>
                          <ToggleRow label="Email Notifications" description="Receive system communications and course news." enabled={settings.notifications.emailNotifications} onChange={(v) => handleSettingChange("notifications", "emailNotifications", v)} />
                          <ToggleRow label="Push Notifications" description="Instant updates inside the dashboard." enabled={settings.notifications.pushNotifications} onChange={(v) => handleSettingChange("notifications", "pushNotifications", v)} />
                          <ToggleRow label="SMS Security Alerts" description="Alerts for critical security events." enabled={settings.notifications.smsNotifications} onChange={(v) => handleSettingChange("notifications", "smsNotifications", v)} />
                          <ToggleRow label="Course Updates" description="Notifications when instructors update course content." enabled={settings.notifications.courseUpdates} onChange={(v) => handleSettingChange("notifications", "courseUpdates", v)} />
                        </div>
                      )}

                      {profileTab === "learning" && (
                        <div className="space-y-4">
                          <h3 className="font-bold text-slate-800 text-base">Learning Preferences</h3>
                          <SelectField
                            label="Default Playback Speed"
                            value={settings.learning.defaultPlaybackSpeed}
                            onChange={(v) => handleSettingChange("learning", "defaultPlaybackSpeed", v)}
                            options={[
                              { value: "0.75x", label: "0.75x (Slower)" },
                              { value: "1.0x", label: "1.0x (Normal)" },
                              { value: "1.25x", label: "1.25x (Fast)" },
                              { value: "1.5x", label: "1.5x (Faster)" },
                              { value: "2.0x", label: "2.0x (Very Fast)" }
                            ]}
                          />
                          <ToggleRow label="Autoplay videos" description="Automatically load next module video." enabled={settings.learning.autoPlayVideos} onChange={(v) => handleSettingChange("learning", "autoPlayVideos", v)} />
                          <ToggleRow label="Subtitles & Closed Captions" description="Show transcripts below video files." enabled={settings.learning.subtitles} onChange={(v) => handleSettingChange("learning", "subtitles", v)} />
                          <ToggleRow label="Focus Mode" description="Collapse navigation sidebars during video sessions." enabled={settings.learning.focusMode} onChange={(v) => handleSettingChange("learning", "focusMode", v)} />
                        </div>
                      )}

                      {profileTab === "payment" && (
                        <div className="space-y-4">
                          <h3 className="font-bold text-slate-800 text-base">Billing Details</h3>
                          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Plan</p>
                              <p className="text-sm font-bold text-slate-800 mt-1">BotVortex Pro Subscription</p>
                            </div>
                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-lg">Pro Member</span>
                          </div>
                          <InputField label="Card Holder Name" value={settings.payment.cardHolder} onChange={(v) => handleSettingChange("payment", "cardHolder", v)} placeholder="Name on card" />
                          <InputField label="Card Number" value={settings.payment.cardNumber} onChange={(v) => handleSettingChange("payment", "cardNumber", v)} placeholder="xxxx xxxx xxxx xxxx" icon={CreditCard} />
                          <div className="grid grid-cols-2 gap-4">
                            <InputField label="Expiry Date" value={settings.payment.expiryDate} onChange={(v) => handleSettingChange("payment", "expiryDate", v)} placeholder="MM/YY" />
                            <InputField label="Billing Address" value={settings.payment.billingAddress} onChange={(v) => handleSettingChange("payment", "billingAddress", v)} placeholder="Postal Code / Address" />
                          </div>
                        </div>
                      )}

                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end shrink-0">
                      <button
                        onClick={handleSaveSettings}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default BotVortexMyCourses;