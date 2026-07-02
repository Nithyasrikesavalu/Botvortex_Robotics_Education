import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Save, LogOut } from 'lucide-react';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('account');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });
  
  const sections = [
    { id: 'account', label: 'Account Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <SettingsIcon size={32} className="text-[#00E5FF]" /> 
            Account Settings
          </h2>
          <p className="text-slate-400 mt-2">Manage your personal information, preferences, and security.</p>
        </div>
        <button className="px-6 py-2 bg-gradient-to-r from-[#00E5FF] to-[#00BFFF] hover:from-[#00BFFF] hover:to-[#00E5FF] text-[#0A192F] font-bold rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                activeSection === section.id 
                  ? 'bg-gradient-to-r from-[#00E5FF]/20 to-transparent text-[#00E5FF] border-l-2 border-[#00E5FF]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
              }`}
            >
              <section.icon size={18} />
              {section.label}
            </button>
          ))}
          
          <div className="pt-8 mt-4 border-t border-white/10">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-medium">
              <LogOut size={18} />
              Sign Out Everywhere
            </button>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0A192F]/60 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden"
          >
            {/* Dynamic decorative blur based on section */}
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20 ${
              activeSection === 'account' ? 'bg-[#00E5FF]' :
              activeSection === 'notifications' ? 'bg-[#7C3AED]' :
              activeSection === 'privacy' ? 'bg-emerald-500' : 'bg-pink-500'
            }`}></div>

            {activeSection === 'account' && (
              <div className="relative z-10 space-y-6">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Personal Information</h3>
                
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-[#00E5FF] flex items-center justify-center text-3xl font-bold text-white overflow-hidden shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                    JD
                  </div>
                  <div className="space-y-3">
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors border border-white/5">
                      Change Avatar
                    </button>
                    <p className="text-xs text-slate-400">Recommended size: 500x500px (JPG, PNG)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input type="text" defaultValue="John Doe" className="w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF]/50 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Username</label>
                    <input type="text" defaultValue="johndoe_99" className="w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF]/50 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input type="email" defaultValue="john@botvortex.com" className="w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-slate-400 focus:outline-none cursor-not-allowed" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF]/50 transition-colors" />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="relative z-10 space-y-6">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Communication Preferences</h3>
                
                <div className="space-y-4">
                  {[
                    { id: 'email', title: 'Email Notifications', desc: 'Receive updates about your courses and assignments via email.' },
                    { id: 'push', title: 'Push Notifications', desc: 'Get real-time alerts in your browser for messages and events.' },
                    { id: 'sms', title: 'SMS Alerts', desc: 'Receive text messages for critical account security events.' },
                    { id: 'marketing', title: 'Marketing & Promos', desc: 'Hear about new courses, discounts, and exclusive offers.' }
                  ].map(pref => (
                    <div key={pref.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <h4 className="text-white font-medium mb-1">{pref.title}</h4>
                        <p className="text-xs text-slate-400">{pref.desc}</p>
                      </div>
                      <button 
                        onClick={() => setNotifications({...notifications, [pref.id]: !notifications[pref.id]})}
                        className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${notifications[pref.id] ? 'bg-[#00E5FF]' : 'bg-slate-700'}`}
                      >
                        <motion.div 
                          className="w-4 h-4 bg-white rounded-full shadow-md"
                          animate={{ x: notifications[pref.id] ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="relative z-10 space-y-6">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Security & Privacy</h3>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Change Password</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="password" placeholder="Current Password" className="w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7C3AED]/50 transition-colors" />
                      <input type="password" placeholder="New Password" className="w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7C3AED]/50 transition-colors" />
                    </div>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors border border-white/5">
                      Update Password
                    </button>
                  </div>

                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <h4 className="text-white font-medium">Profile Visibility</h4>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" name="visibility" className="w-4 h-4 accent-[#7C3AED] bg-slate-800 border-white/10" defaultChecked />
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Public (Visible to all students)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" name="visibility" className="w-4 h-4 accent-[#7C3AED] bg-slate-800 border-white/10" />
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Private (Visible only to instructors)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="relative z-10 space-y-6">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Theme Preferences</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'dark', name: 'Dark Mode', preview: 'bg-[#060D1A] border-[#00E5FF]' },
                    { id: 'light', name: 'Light Mode', preview: 'bg-slate-100 border-white/10' },
                    { id: 'system', name: 'System Default', preview: 'bg-gradient-to-r from-[#060D1A] to-slate-100 border-white/10' }
                  ].map(theme => (
                    <button key={theme.id} className="group text-left">
                      <div className={`w-full h-24 rounded-xl border-2 mb-3 shadow-lg relative overflow-hidden transition-all ${theme.preview} ${theme.id === 'dark' ? 'shadow-[0_0_15px_rgba(0,229,255,0.2)]' : 'group-hover:border-white/30'}`}>
                        {theme.id === 'dark' && (
                          <div className="absolute inset-2 border border-white/10 rounded-lg bg-white/5"></div>
                        )}
                      </div>
                      <p className={`text-sm font-medium text-center ${theme.id === 'dark' ? 'text-[#00E5FF]' : 'text-slate-400'}`}>
                        {theme.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
