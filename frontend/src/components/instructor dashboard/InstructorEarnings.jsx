import React from "react";
import { useLocation } from "react-router-dom";

const InstructorEarnings = () => {
  const location = useLocation();
  const { email } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Earnings Analytics</h1>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p>Earnings analytics content for {email}</p>
        </div>
      </div>
    </div>
  );
};

export default InstructorEarnings;