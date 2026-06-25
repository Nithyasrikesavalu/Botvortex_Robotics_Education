import React from 'react';

// Dashboard page – premium look with glassmorphism and gradient background
const Dashboard = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] p-4">
      <div className="bg-[#1a2333] bg-opacity-60 backdrop-blur-md rounded-xl shadow-xl p-8 max-w-3xl w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-6">
          My Dashboard
        </h1>
        <p className="text-lg text-gray-200 text-center mb-4">
          Welcome to your personalized dashboard. Here you can quickly access your stats, recent activity, and shortcuts.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-4 bg-[#0b1426] bg-opacity-80 rounded-lg hover:bg-[#0c1b3a] transition-colors">
            <h2 className="text-xl font-semibold text-[#00C3FF] mb-2">Coins</h2>
            <p className="text-gray-300">Your reward balance: <span className="font-bold text-white">0</span></p>
          </div>
          <div className="p-4 bg-[#0b1426] bg-opacity-80 rounded-lg hover:bg-[#0c1b3a] transition-colors">
            <h2 className="text-xl font-semibold text-[#00C3FF] mb-2">Progress</h2>
            <p className="text-gray-300">Courses completed: <span className="font-bold text-white">0</span></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
