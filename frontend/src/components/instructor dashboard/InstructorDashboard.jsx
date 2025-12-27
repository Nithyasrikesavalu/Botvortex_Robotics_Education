// // import React, { useState } from "react";
// // import { useLocation, Link } from "react-router-dom";
// // import { 
// //   Bot, Users, BarChart3, BookOpen, DollarSign, MessageSquare, 
// //   Coins, TrendingUp, FileText, Settings, Bell, Plus, Star, Award
// // } from "lucide-react";


// // // Import all content components

// // import InstructorMyCourses from "./InstructorMyCourses";
// // import ContentContent from "./ContentContent";
// // import SettingsContent from "./SettingsContent";
// // import ReviewsContent from "./ReviewsContent";
// // import EarningsContent from "./EarningsContent";
// // import StudentsContent from "./StudentsContent";
// // import OverviewContent from "./OverviewContent";

// // const InstructorDashboard = () => {
// //   const location = useLocation();
// //   const { email } = location.state || {};
  
// //   const [activeTab, setActiveTab] = useState("overview");
// //   const [sidebarOpen, setSidebarOpen] = useState(true);

// //   // Mock data - you can pass this to components as props
// //   const dashboardData = {
// //     stats: {
// //       totalStudents: 1247,
// //       totalCourses: 8,
// //       totalEarnings: 4580,
// //       averageRating: 4.8,
// //       activeStudents: 892,
// //       completionRate: 78
// //     },
// //     courses: [
// //       {
// //         id: 1,
// //         title: "Advanced React Development",
// //         students: 324,
// //         revenue: 1240,
// //         rating: 4.9,
// //         progress: 85,
// //         status: "active",
// //         price: 149,
// //         thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
// //         modules: 12,
// //         category: "Web Development"
// //       },
// //       // ... more courses
// //     ],
// //     students: [
// //       {
// //         id: 1,
// //         name: "Sarah Johnson",
// //         email: "sarah@email.com",
// //         course: "Advanced React",
// //         joinDate: "2024-01-15",
// //         progress: 92,
// //         avatar: "https://randomuser.me/api/portraits/women/32.jpg"
// //       },
// //       // ... more students
// //     ],
// //     earnings: [
// //       { month: "Jan", earnings: 3200 },
// //       { month: "Feb", earnings: 2800 },
// //       { month: "Mar", earnings: 4000 },
// //       { month: "Apr", earnings: 3780 },
// //       { month: "May", earnings: 5900 },
// //       { month: "Jun", earnings: 4580 }
// //     ],
// //     reviews: [
// //       {
// //         id: 1,
// //         student: "Sarah Johnson",
// //         rating: 5,
// //         comment: "Amazing course!",
// //         date: "2024-01-20",
// //         avatar: "https://randomuser.me/api/portraits/women/32.jpg",
// //         course: "Advanced React Development"
// //       }
// //     ]
// //   };
// // ``
// //   // Navigation items
// //   const navItems = [
// //     { icon: BarChart3, label: "Overview", id: "overview" },
// //     { icon: BookOpen, label: "My Courses", id: "courses" },
// //     { icon: Users, label: "Students", id: "students" },
// //     { icon: DollarSign, label: "Earnings", id: "earnings" },
// //     { icon: MessageSquare, label: "Reviews", id: "reviews" },
// //     { icon: FileText, label: "Content", id: "content" },
// //     { icon: Settings, label: "Settings", id: "settings" }
// //   ];

// //   // Render different content based on active tab
// //   const renderContent = () => {
// //     switch (activeTab) {
// //       case "overview":
// //         return <OverviewContent data={dashboardData} />;
// //       case "courses":
// //         return <InstructorMyCourses data={dashboardData} />;
// //       case "students":
// //         return <StudentsContent data={dashboardData} />;
// //       case "earnings":
// //         return <EarningsContent data={dashboardData} />;
// //       case "reviews":
// //         return <ReviewsContent data={dashboardData} />;
// //       case "content":
// //         return <ContentContent />;
// //       case "settings":
// //         return <SettingsContent email={email} />;
// //       default:
// //         return <OverviewContent data={dashboardData} />;
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 flex">
// //       {/* Sidebar */}
// //       <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
// //         <div className="p-6 border-b border-gray-200">
// //           <div className="flex items-center gap-3">
// //             <Bot className="text-purple-600 w-8 h-8" />
// //             {sidebarOpen && (
// //               <div>
// //                 <span className="text-xl font-bold text-gray-900">BotVortex</span>
// //                 <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mt-1">
// //                   Instructor
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         <nav className="p-4 space-y-2">
// //           {navItems.map((item) => (
// //             <button
// //               key={item.id}
// //               onClick={() => setActiveTab(item.id)}
// //               className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
// //                 activeTab === item.id
// //                   ? "bg-purple-50 text-purple-700 border-r-2 border-purple-600"
// //                   : "text-gray-600 hover:bg-gray-100"
// //               }`}
// //             >
// //               <item.icon className="w-5 h-5" />
// //               {sidebarOpen && <span className="font-medium">{item.label}</span>}
// //             </button>
// //           ))}
// //         </nav>
// //       </div>

// //       {/* Main Content */}
// //       <div className="flex-1 overflow-auto">
// //         {/* Header */}
// //         <header className="bg-white shadow-sm border-b border-gray-200">
// //           <div className="px-6 py-4">
// //             <div className="flex items-center justify-between">
// //               <div className="flex items-center gap-4">
// //                 <button
// //                   onClick={() => setSidebarOpen(!sidebarOpen)}
// //                   className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
// //                 >
// //                   <div className="w-5 h-5">
// //                     <div className="w-full h-0.5 bg-gray-600 mb-1"></div>
// //                     <div className="w-full h-0.5 bg-gray-600 mb-1"></div>
// //                     <div className="w-full h-0.5 bg-gray-600"></div>
// //                   </div>
// //                 </button>
// //                 <h1 className="text-2xl font-bold text-gray-900">
// //                   {navItems.find(item => item.id === activeTab)?.label || "Instructor Dashboard"}
// //                 </h1>
// //               </div>

// //               <div className="flex items-center gap-4">
// //                 {/* Rewards Coins */}
// //                 <Link 
// //                   to="/buy-coins"
// //                   className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 px-4 py-2 rounded-full hover:border-yellow-300 transition-all duration-300 cursor-pointer group"
// //                 >
// //                   <Coins className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
// //                   <span className="font-bold text-gray-900">5,420</span>
// //                 </Link>

// //                 {/* Notifications */}
// //                 <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
// //                   <Bell className="w-5 h-5 text-gray-600" />
// //                   <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
// //                 </button>

// //                 {/* User Profile */}
// //                 <div className="flex items-center gap-3">
// //                   <img
// //                     src="https://randomuser.me/api/portraits/men/32.jpg"
// //                     alt="Instructor"
// //                     className="w-10 h-10 rounded-full border-2 border-purple-200"
// //                   />
// //                   <div className="text-right">
// //                     <div className="font-semibold text-gray-900">John D.</div>
// //                     <div className="text-sm text-gray-500">{email}</div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </header>

// //         {/* Main Content Area - Changes based on active tab */}
// //         <main className="p-6">
// //           {renderContent()}
// //         </main>
// //       </div>
// //     </div>
// //   );
// // };

// // export default InstructorDashboard;

// import React, { useState } from "react";
// import { useLocation, Link } from "react-router-dom";
// import { 
//   Bot, Users, BarChart3, BookOpen, DollarSign, MessageSquare, 
//   Coins, TrendingUp, FileText, Settings, Bell, Plus, Star, Award
// } from "lucide-react";


// // Import all content components

// import InstructorMyCourses from "./InstructorMyCourses";
// import ContentContent from "./ContentContent";
// import SettingsContent from "./SettingsContent";
// import ReviewsContent from "./ReviewsContent";
// import EarningsContent from "./EarningsContent";
// import StudentsContent from "./StudentsContent";
// import OverviewContent from "./OverviewContent";

// const InstructorDashboard = () => {
//   const location = useLocation();
//   const { email } = location.state || {};
  
//   const [activeTab, setActiveTab] = useState("overview");
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   // Mock data - you can pass this to components as props
//   const dashboardData = {
//     stats: {
//       totalStudents: 1247,
//       totalCourses: 8,
//       totalEarnings: 4580,
//       averageRating: 4.8,
//       activeStudents: 892,
//       completionRate: 78
//     },
//     courses: [
//       {
//         id: 1,
//         title: "Advanced React Development",
//         students: 324,
//         revenue: 1240,
//         rating: 4.9,
//         progress: 85,
//         status: "active",
//         price: 149,
//         thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
//         modules: 12,
//         category: "Web Development"
//       },
//       // ... more courses
//     ],
//     students: [
//       {
//         id: 1,
//         name: "Sarah Johnson",
//         email: "sarah@email.com",
//         course: "Advanced React",
//         joinDate: "2024-01-15",
//         progress: 92,
//         avatar: "https://randomuser.me/api/portraits/women/32.jpg"
//       },
//       // ... more students
//     ],
//     earnings: [
//       { month: "Jan", earnings: 3200 },
//       { month: "Feb", earnings: 2800 },
//       { month: "Mar", earnings: 4000 },
//       { month: "Apr", earnings: 3780 },
//       { month: "May", earnings: 5900 },
//       { month: "Jun", earnings: 4580 }
//     ],
//     reviews: [
//       {
//         id: 1,
//         student: "Sarah Johnson",
//         rating: 5,
//         comment: "Amazing course!",
//         date: "2024-01-20",
//         avatar: "https://randomuser.me/api/portraits/women/32.jpg",
//         course: "Advanced React Development"
//       }
//     ]
//   };
// ``
//   // Navigation items
//   const navItems = [
//     { icon: BarChart3, label: "Overview", id: "overview" },
//     { icon: BookOpen, label: "My Courses", id: "courses" },
//     { icon: Users, label: "Students", id: "students" },
//     { icon: DollarSign, label: "Earnings", id: "earnings" },
//     { icon: MessageSquare, label: "Reviews", id: "reviews" },
//     { icon: FileText, label: "Content", id: "content" },
//     { icon: Settings, label: "Settings", id: "settings" }
//   ];

//   // Render different content based on active tab
//   const renderContent = () => {
//     switch (activeTab) {
//       case "overview":
//         return <OverviewContent data={dashboardData} />;
//       case "courses":
//         return <InstructorMyCourses data={dashboardData} />;
//       case "students":
//         return <StudentsContent data={dashboardData} />;
//       case "earnings":
//         return <EarningsContent data={dashboardData} />;
//       case "reviews":
//         return <ReviewsContent data={dashboardData} />;
//       case "content":
//         return <ContentContent />;
//       case "settings":
//         return <SettingsContent email={email} />;
//       default:
//         return <OverviewContent data={dashboardData} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center gap-3">
//             <Bot className="text-purple-600 w-8 h-8" />
//             {sidebarOpen && (
//               <div>
//                 <span className="text-xl font-bold text-gray-900">BotVortex</span>
//                 <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mt-1">
//                   Instructor
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <nav className="p-4 space-y-2">
//           {navItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => setActiveTab(item.id)}
//               className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
//                 activeTab === item.id
//                   ? "bg-purple-50 text-purple-700 border-r-2 border-purple-600"
//                   : "text-gray-600 hover:bg-gray-100"
//               }`}
//             >
//               <item.icon className="w-5 h-5" />
//               {sidebarOpen && <span className="font-medium">{item.label}</span>}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         {/* Header */}
//         <header className="bg-white shadow-sm border-b border-gray-200">
//           <div className="px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => setSidebarOpen(!sidebarOpen)}
//                   className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="w-5 h-5">
//                     <div className="w-full h-0.5 bg-gray-600 mb-1"></div>
//                     <div className="w-full h-0.5 bg-gray-600 mb-1"></div>
//                     <div className="w-full h-0.5 bg-gray-600"></div>
//                   </div>
//                 </button>
//                 <h1 className="text-2xl font-bold text-gray-900">
//                   {navItems.find(item => item.id === activeTab)?.label || "Instructor Dashboard"}
//                 </h1>
//               </div>

//               <div className="flex items-center gap-4">
//                 {/* Rewards Coins */}
//                 <Link 
//                   to="/buy-coins"
//                   className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 px-4 py-2 rounded-full hover:border-yellow-300 transition-all duration-300 cursor-pointer group"
//                 >
//                   <Coins className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
//                   <span className="font-bold text-gray-900">5,420</span>
//                 </Link>

//                 {/* Notifications */}
//                 <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
//                   <Bell className="w-5 h-5 text-gray-600" />
//                   <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
//                 </button>

//                 {/* User Profile */}
//                 <div className="flex items-center gap-3">
//                   <img
//                     src="https://randomuser.me/api/portraits/men/32.jpg"
//                     alt="Instructor"
//                     className="w-10 h-10 rounded-full border-2 border-purple-200"
//                   />
//                   <div className="text-right">
//                     <div className="font-semibold text-gray-900">John D.</div>
//                     <div className="text-sm text-gray-500">{email}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main Content Area - Changes based on active tab */}
//         <main className="p-6">
//           {renderContent()}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default InstructorDashboard;

import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  Bot, Users, BarChart3, BookOpen, DollarSign, MessageSquare, 
  Coins, TrendingUp, FileText, Settings, Bell, Plus, Star, Award,
  X, CheckCircle, AlertCircle, Info, UserPlus, StarIcon
} from "lucide-react";

// Import all content components
import InstructorMyCourses from "./InstructorMyCourses";
import ContentContent from "./ContentContent";
import SettingsContent from "./SettingsContent";
import ReviewsContent from "./ReviewsContent";
import EarningsContent from "./EarningsContent";
import StudentsContent from "./StudentsContent";
import OverviewContent from "./OverviewContent";

const InstructorDashboard = () => {
  const location = useLocation();
  const { email } = location.state || {};
  
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "New Student Enrollment",
      message: "Sarah Johnson enrolled in your Advanced React Development course",
      time: "5 minutes ago",
      read: false,
      icon: UserPlus,
      action: "view"
    },
    {
      id: 2,
      type: "info",
      title: "Course Review",
      message: "You have a new 5-star review for your JavaScript Fundamentals course",
      time: "1 hour ago",
      read: false,
      icon: StarIcon,
      action: "view"
    },
    {
      id: 3,
      type: "warning",
      title: "Earnings Update",
      message: "Your monthly earnings have increased by 15% compared to last month",
      time: "2 hours ago",
      read: true,
      icon: TrendingUp,
      action: "view"
    },
    {
      id: 4,
      type: "info",
      title: "New Message",
      message: "You have a new student message waiting for your response",
      time: "1 day ago",
      read: true,
      icon: MessageSquare,
      action: "reply"
    },
    {
      id: 5,
      type: "success",
      title: "Course Published",
      message: "Your new course 'React Advanced Patterns' has been successfully published",
      time: "2 days ago",
      read: true,
      icon: CheckCircle,
      action: "view"
    }
  ]);

  // Add new notification function
  const addNewNotification = () => {
    const newNotification = {
      id: Date.now(),
      type: "info",
      title: "New Notification",
      message: "This is a test notification added just now!",
      time: "Just now",
      read: false,
      icon: Bell,
      action: "view"
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Auto-add notification every 30 seconds for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const types = ["success", "info", "warning"];
      const icons = [UserPlus, StarIcon, MessageSquare, TrendingUp];
      const titles = [
        "New Student Joined",
        "Course Rating Updated",
        "New Message Received",
        "Revenue Increased",
        "Course Completed"
      ];
      const messages = [
        "A new student enrolled in your Web Development course",
        "Your course received a new 5-star rating",
        "You have a new message from a student",
        "Your earnings increased by 20% this week",
        "A student completed your React course successfully"
      ];

      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      const newNotification = {
        id: Date.now(),
        type: randomType,
        title: randomTitle,
        message: randomMessage,
        time: "Just now",
        read: false,
        icon: randomIcon,
        action: "view"
      };

      setNotifications(prev => [newNotification, ...prev]);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Mock data - you can pass this to components as props
  const dashboardData = {
    stats: {
      totalStudents: 1247,
      totalCourses: 8,
      totalEarnings: 4580,
      averageRating: 4.8,
      activeStudents: 892,
      completionRate: 78
    },
    courses: [
      {
        id: 1,
        title: "Advanced React Development",
        students: 324,
        revenue: 1240,
        rating: 4.9,
        progress: 85,
        status: "active",
        price: 149,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
        modules: 12,
        category: "Web Development"
      },
    ],
    students: [
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah@email.com",
        course: "Advanced React",
        joinDate: "2024-01-15",
        progress: 92,
        avatar: "https://randomuser.me/api/portraits/women/32.jpg"
      },
    ],
    earnings: [
      { month: "Jan", earnings: 3200 },
      { month: "Feb", earnings: 2800 },
      { month: "Mar", earnings: 4000 },
      { month: "Apr", earnings: 3780 },
      { month: "May", earnings: 5900 },
      { month: "Jun", earnings: 4580 }
    ],
    reviews: [
      {
        id: 1,
        student: "Sarah Johnson",
        rating: 5,
        comment: "Amazing course!",
        date: "2024-01-20",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        course: "Advanced React Development"
      }
    ]
  };

  // Navigation items
  const navItems = [
    { icon: BarChart3, label: "Overview", id: "overview" },
    { icon: BookOpen, label: "My Courses", id: "courses" },
    { icon: Users, label: "Students", id: "students" },
    { icon: DollarSign, label: "Earnings", id: "earnings" },
    { icon: MessageSquare, label: "Reviews", id: "reviews" },
    { icon: FileText, label: "Content", id: "content" },
    { icon: Settings, label: "Settings", id: "settings" }
  ];

  // Toggle notification panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    // Mark all notifications as read when opening
    if (!showNotifications) {
      markAllAsRead();
    }
  };

  // Mark a single notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  // Delete a notification
  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Get unread notifications count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Get notification icon color based on type
  const getNotificationIconColor = (type) => {
    switch (type) {
      case "success": return "text-green-500";
      case "warning": return "text-yellow-500";
      case "error": return "text-red-500";
      case "info": 
      default: return "text-blue-500";
    }
  };

  // Get notification background color based on type
  const getNotificationBgColor = (type) => {
    switch (type) {
      case "success": return "bg-green-50 border-green-200";
      case "warning": return "bg-yellow-50 border-yellow-200";
      case "error": return "bg-red-50 border-red-200";
      case "info": 
      default: return "bg-blue-50 border-blue-200";
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    // Here you can add navigation logic based on notification action
    console.log("Notification clicked:", notification);
    setShowNotifications(false);
  };

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent data={dashboardData} />;
      case "courses":
        return <InstructorMyCourses data={dashboardData} />;
      case "students":
        return <StudentsContent data={dashboardData} />;
      case "earnings":
        return <EarningsContent data={dashboardData} />;
      case "reviews":
        return <ReviewsContent data={dashboardData} />;
      case "content":
        return <ContentContent />;
      case "settings":
        return <SettingsContent email={email} />;
      default:
        return <OverviewContent data={dashboardData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Bot className="text-purple-600 w-8 h-8" />
            {sidebarOpen && (
              <div>
                <span className="text-xl font-bold text-gray-900">BotVortex</span>
                <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mt-1">
                  Instructor
                </div>
              </div>
            )}
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-purple-50 text-purple-700 border-r-2 border-purple-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-5 h-5">
                    <div className="w-full h-0.5 bg-gray-600 mb-1"></div>
                    <div className="w-full h-0.5 bg-gray-600 mb-1"></div>
                    <div className="w-full h-0.5 bg-gray-600"></div>
                  </div>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {navItems.find(item => item.id === activeTab)?.label || "Instructor Dashboard"}
                </h1>
              </div>

              <div className="flex items-center gap-4">

                {/* Rewards Coins */}
                <Link 
                  to="/buy-coins"
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 px-4 py-2 rounded-full hover:border-yellow-300 transition-all duration-300 cursor-pointer group"
                >
                  <Coins className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-gray-900">5,420</span>
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={toggleNotifications}
                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white text-xs text-white flex items-center justify-center font-medium">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <div className="flex gap-2">
                          {notifications.length > 0 && (
                            <>
                              <button
                                onClick={markAllAsRead}
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                              >
                                Mark all read
                              </button>
                              <button
                                onClick={clearAllNotifications}
                                className="text-sm text-gray-500 hover:text-gray-700"
                              >
                                Clear all
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No notifications</p>
                            <p className="text-gray-400 text-xs mt-1">New notifications will appear here</p>
                          </div>
                        ) : (
                          notifications.map((notification) => {
                            const IconComponent = notification.icon;
                            return (
                              <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                                  !notification.read ? 'bg-blue-50' : ''
                                }`}
                              >
                                <div className="flex gap-3">
                                  <div className="flex-shrink-0">
                                    <IconComponent className={`w-5 h-5 ${getNotificationIconColor(notification.type)}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                      <p className="font-medium text-gray-900 text-sm">
                                        {notification.title}
                                      </p>
                                      <button
                                        onClick={(e) => deleteNotification(notification.id, e)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                    <p className="text-gray-600 text-sm mt-1">
                                      {notification.message}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-xs text-gray-500">
                                        {notification.time}
                                      </span>
                                      {!notification.read && (
                                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                          <button className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium">
                            View All Notifications
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Instructor"
                    className="w-10 h-10 rounded-full border-2 border-purple-200"
                  />
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">John D.</div>
                    <div className="text-sm text-gray-500">{email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area - Changes based on active tab */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Overlay for closing notifications when clicking outside */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default InstructorDashboard;