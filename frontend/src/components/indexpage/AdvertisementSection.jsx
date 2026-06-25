import { API_URL } from "../../config/api";
import React, { useState } from 'react';

const AdvertisementSection = () => {
  const [formData, setFormData] = useState({
    email: '',
    countryCode: '+1',
    mobile: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleExploreProgram = () => {
    // Redirect to dedicated programs page
    window.location.href = '/programs';
  };

  const handleGetDetails = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.email || !formData.mobile) {
      alert('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    // Validate mobile number (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      alert('Please enter a valid 10-digit mobile number');
      setIsSubmitting(false);
      return;
    }

    // Actual API call to Backend
    try {
      const response = await fetch(`${API_URL}/programs/request-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("📨 Backend Response Data:", data);

      if (response.ok) {
        // Show success message
        setSuccessMessage(`Thank you! Program details sent to ${formData.email} and ${formData.countryCode}${formData.mobile}`);
        setShowSuccess(true);
        console.log("✅ Success! Form reset.");

        // Reset form
        setFormData({
          email: '',
          countryCode: '+1',
          mobile: ''
        });

        // Auto hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setSuccessMessage('');
        }, 5000);
      } else {
        alert(data.message || 'Something went wrong. Please try again.');
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Server connection error. Please ensure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessMessage = () => {
    setShowSuccess(false);
    setSuccessMessage('');
  };

  const countryCodes = [
    { code: '+91', country: 'IN', name: 'India' },
    { code: '+1', country: 'US', name: 'USA' },
    { code: '+44', country: 'GB', name: 'UK' },
    { code: '+61', country: 'AU', name: 'Australia' },
    { code: '+65', country: 'SG', name: 'Singapore' },
    { code: '+971', country: 'AE', name: 'UAE' }
  ];

  return (
    <section className="py-6 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-fade-in">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 shadow-2xl border border-green-400">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-green-500 text-sm">✓</span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-white font-semibold text-lg">
                  Success!
                </h3>
                <p className="mt-1 text-green-100 text-sm">
                  {successMessage}
                </p>
              </div>
              <button
                onClick={closeSuccessMessage}
                className="flex-shrink-0 ml-4 text-green-200 hover:text-white transition-colors"
              >
                <span className="text-lg">×</span>
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-3 w-full bg-green-400/50 rounded-full h-1.5">
              <div
                className="bg-white h-1.5 rounded-full transition-all duration-5000 ease-linear"
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Background Image with Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("./images/add1.jpg")'
        }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">

            {/* Left Content - Program Information */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-3 text-center">START YOUR ROBOTICS JOURNEY</h2>

              {/* Benefits Section */}
              <div className="text-center mb-3">
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg py-1 px-2 mb-2">
                  <p className="text-green-400 font-semibold text-xs">
                    Limited Time Exclusive Benefits
                  </p>
                </div>
              </div>

              {/* Program Features */}
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-2 mb-3">
                <p className="text-white text-center mb-1 text-xs font-semibold">
                  Complete Learning Package:
                </p>
                <div className="space-y-0.5">
                  <p className="text-gray-200 text-center text-xs">✓ AI-Powered Learning Platform</p>
                  <p className="text-gray-200 text-center text-xs">✓ Virtual Robotics Lab Access</p>
                  <p className="text-gray-200 text-center text-xs">✓ Expert Mentor Support</p>
                  <p className="text-gray-200 text-center text-xs">✓ Hands-on Projects</p>
                </div>
              </div>

              {/* EXPLORE Button */}
              <button
                onClick={handleExploreProgram}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-3 text-xs"
              >
                EXPLORE PROGRAM
              </button>

              {/* Additional Options */}
              <div className="flex items-center justify-center gap-1 mb-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">💳</span>
                </div>
                <span className="text-white font-medium text-xs">Flexible payment options</span>
              </div>

              {/* Advisor Section */}
              <div className="text-center">
                <p className="text-gray-300 text-xs">Talk to our learning advisors</p>
                <p className="text-gray-200 text-xs mt-0.5 font-semibold">Call: +91 1234567890</p>
              </div>
            </div>

            {/* Right Content - Contact Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-3 text-center">GET PROGRAM DETAILS</h2>

              <form onSubmit={handleGetDetails}>
                {/* Email */}
                <div className="mb-3">
                  <label className="block text-white font-semibold mb-1 text-xs">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors text-xs"
                  />
                </div>

                {/* Mobile Number */}
                <div className="mb-4">
                  <label className="block text-white font-semibold mb-1 text-xs">Mobile Number *</label>
                  <div className="flex gap-1">
                    {/* Country Code Dropdown */}
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="bg-gray-800 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors text-xs min-w-16 cursor-pointer"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code} className="bg-gray-800 text-white">
                          {country.country} {country.code}
                        </option>
                      ))}
                    </select>

                    {/* Mobile Input */}
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                      placeholder="9876543210"
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors text-xs"
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                      maxLength="10"
                    />
                  </div>
                  <p className="text-gray-300 text-xs mt-0.5">Enter 10-digit mobile number</p>
                </div>

                {/* GET DETAILS Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-101 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                      SENDING...
                    </>
                  ) : (
                    'GET DETAILS'
                  )}
                </button>
              </form>

              {/* Additional Info */}
              <div className="mt-3 text-center">
                <p className="text-gray-300 text-xs">
                  Get program information via email & SMS
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  * Required fields
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default AdvertisementSection;