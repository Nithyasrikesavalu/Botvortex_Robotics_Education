import { API_URL } from "../../config/api";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bot, Eye, EyeOff, User, Mail, Lock, ArrowRight, GraduationCap, Users, BookOpen, Briefcase, Calendar, MapPin, Phone, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Shield, AtSign } from "lucide-react";

const Register = () => {
  // Step management
  const [step, setStep] = useState(1); // 1: Email & OTP, 2: Username & Password, 3: Profile

  // Form data states
  const [formData, setFormData] = useState({
    // Step 1 data (Email)
    email: "",
    verificationToken: "",

    // Step 2 data (Login)
    username: "",
    password: "",
    confirmPassword: "",

    // Step 3 data (Profile)
    userType: "student",
    fullName: "",
    terms: false,
    // Student specific
    mobileNumber: "",
    gradeLevel: "",
    school: "",
    interests: "",
    // Instructor specific
    expertise: "",
    experience: "",
    qualification: "",
    specialization: "",
    company: "",
    website: ""
  });

  // UI states
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);

  // OTP states
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [verifiedIdentifier, setVerifiedIdentifier] = useState("");
  const [identifierError, setIdentifierError] = useState(""); // Error message below email box

  // Refs for OTP inputs
  const otpRefs = useRef([]);

  const navigate = useNavigate();

  // Resend OTP timer effect
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // OTP input handlers
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input
    if (element.value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    const pasteArray = pasteData.split('');
    const newOtp = [...otp];

    pasteArray.forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });

    setOtp(newOtp);

    // Focus last input
    if (otpRefs.current[5]) {
      otpRefs.current[5].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // Send OTP function
  const sendOTP = async () => {
    if (!formData.email) {
      alert("Please enter email or mobile number");
      return;
    }

    const isEmail = formData.email.includes("@");
    const payload = isEmail ? { email: formData.email } : { mobile: formData.email };

    try {
      setLoading(true);
      setOtpError("");

      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("OTP Error:", data);

        // Handle "Already Registered" specific error
        if (data.role || (data.message && data.message.includes("registered"))) {
          const roleMsg = data.role ? ` as ${data.role}` : "";
          setIdentifierError(`User already registered${roleMsg}. Please login.`);
          setOtpError("");
        } else {
          setOtpError(data.message + (data.error ? `: ${data.error}` : "") || "Failed to send OTP");
        }

        setLoading(false);
        return;
      }

      setOtpSent(true);
      setResendTimer(60);
      setLoading(false);

    } catch (err) {
      setLoading(false);
      setOtpError("Server error. Try again.");
    }
  };

  // Verify OTP function - Accepts any 6-digit number
  const verifyOTP = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setOtpError("Please enter 6-digit OTP");
      return;
    }

    const isEmail = formData.email.includes("@");
    const payload = isEmail ? { email: formData.email, otp: otpValue } : { mobile: formData.email, otp: otpValue };

    try {
      setLoading(true);
      setOtpError("");

      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      // ✅ OTP VERIFIED
      setVerifiedIdentifier(formData.email); // Save what was verified
      setFormData(prev => ({
        ...prev,
        verificationToken: data.verificationToken,
        // If verified by Mobile, move it to mobileNumber and CLEAR email so user is forced to enter it in Step 3
        mobileNumber: !isEmail ? formData.email : prev.mobileNumber,
        email: isEmail ? formData.email : "",
      }));
      setOtpVerified(true);
      setStep(2);
      setLoading(false);

    } catch (err) {
      setLoading(false);
      setOtpError("Server error. Try again.");
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    if (resendTimer > 0) return;

    const isEmail = formData.email.includes("@");
    const payload = isEmail ? { email: formData.email } : { mobile: formData.email };

    try {
      setLoading(true);
      setOtpError("");

      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.message || "Failed to resend OTP");
        setLoading(false);
        return;
      }

      setResendTimer(60);
      setLoading(false);

    } catch (err) {
      setLoading(false);
      setOtpError("Server error");
    }
  };

  // Validate Step 2 (Login Details) and proceed to Step 3
  const proceedToStep3 = (e) => {
    e.preventDefault();

    // Validate Step 2
    if (!formData.username) {
      alert("Please enter a username");
      return;
    }

    if (formData.username.length < 3) {
      alert("Username must be at least 3 characters");
      return;
    }

    if (!formData.password) {
      alert("Please enter password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (strength < 50) {
      alert("Please use a stronger password");
      return;
    }

    // Proceed to Step 3
    setStep(3);
  };

  // Go back to Step 1 from Step 2
  const goBackToStep1 = () => {
    setStep(1);
  };

  // Go back to Step 2 from Step 3
  const goBackToStep2 = () => {
    setStep(2);
  };

  const handleUserTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      userType: type,
      // Reset specific fields
      mobileNumber: "",
      gradeLevel: "",
      school: "",
      interests: "",
      expertise: "",
      experience: "",
      qualification: "",
      specialization: "",
      company: "",
      website: ""
    }));
  };

  // Final submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      alert("Please verify email first");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        verificationToken: formData.verificationToken, // Send token to backend
        fullName: formData.fullName,
        userType: formData.userType,

        studentDetails: formData.userType === "student" ? {
          mobileNumber: formData.mobileNumber,
          gradeLevel: formData.gradeLevel,
          school: formData.school,
          interests: formData.interests
        } : undefined,

        instructorDetails: formData.userType === "instructor" ? {
          expertise: formData.expertise,
          experience: formData.experience,
          qualification: formData.qualification,
          specialization: formData.specialization,
          company: formData.company,
          website: formData.website
        } : undefined
      };

      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      setLoading(false);

      if (formData.userType === "student") {
        localStorage.setItem("token", data.token);
        navigate("/index");
      } else {
        localStorage.setItem("instructor_token", data.token);
        navigate("/instructor-dashboard");
      }

    } catch (err) {
      setLoading(false);
      alert("Server error");
    }
  };

  // Helper function
  const getStrengthColor = () => {
    if (strength < 50) return "#ef4444";
    if (strength < 75) return "#f59e0b";
    return "#10b981";
  };

  const getStrengthText = () => {
    if (strength < 50) return "Weak";
    if (strength < 75) return "Medium";
    return "Strong";
  };

  // Data arrays
  const gradeLevels = ["High School", "Undergraduate", "Graduate", "PhD", "Other"];
  const experienceLevels = ["0-2 years", "3-5 years", "6-10 years", "10+ years"];
  const expertiseAreas = [
    "Robotics Engineering", "AI & Machine Learning", "Computer Vision",
    "Embedded Systems", "Control Systems", "Mechanical Design",
    "Electrical Engineering", "Software Development"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 bg-blue-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-purple-200/20 rounded-full blur-2xl"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Progress Steps */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                1
              </div>
              <span className={`text-sm font-medium ${step === 1 ? "text-blue-600" : "text-gray-600"
                }`}>
                Email Verify
              </span>
            </div>

            <div className="flex-1 mx-4">
              <div className="h-1 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{
                    width: step === 1 ? "0%" :
                      step === 2 ? "50%" : "100%"
                  }}
                ></div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 2 ? "bg-blue-600 text-white" :
                step === 3 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                2
              </div>
              <span className={`text-sm font-medium ${step >= 2 ? "text-blue-600" : "text-gray-600"
                }`}>
                Login Details
              </span>
            </div>

            <div className="flex-1 mx-4">
              <div className="h-1 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: step === 3 ? "100%" : "0%" }}
                ></div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 3 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                3
              </div>
              <span className={`text-sm font-medium ${step === 3 ? "text-blue-600" : "text-gray-600"
                }`}>
                Profile
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Brand Section */}
            <div className="lg:w-2/5 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">
                    <span className="text-cyan-400">Bot</span>
                    <span className="text-white">Vortex</span>
                  </h1>
                </div>
              </div>

              <h2 className="text-lg font-bold mb-3">
                {step === 1 ? "Verify Email" :
                  step === 2 ? "Create Account" :
                    "Complete Profile"}
              </h2>

              <p className="text-blue-200 text-xs mb-4">
                {step === 1 ? "Secure your account with email verification" :
                  step === 2 ? "Set up your login credentials" :
                    formData.userType === "student"
                      ? "Tell us about your robotics journey"
                      : "Share your expertise and qualifications"}
              </p>

              {/* Key Benefits */}
              <div className="space-y-2">
                {step === 2 ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-cyan-500/20 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      </div>
                      <span className="text-blue-100 text-xs">Secure Login</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500/20 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      </div>
                      <span className="text-blue-100 text-xs">Strong Password</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500/20 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      </div>
                      <span className="text-blue-100 text-xs">Quick Setup</span>
                    </div>
                  </>
                ) : step === 1 ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500/20 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      </div>
                      <span className="text-blue-100 text-xs">Email Verification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-cyan-500/20 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      </div>
                      <span className="text-blue-100 text-xs">Account Security</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500/20 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      </div>
                      <span className="text-blue-100 text-xs">Spam Protection</span>
                    </div>
                  </>
                ) : formData.userType === "student" ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-cyan-500/20 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      </div>
                      <span className="text-blue-100 text-xs">Personalized Learning</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500/20 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      </div>
                      <span className="text-blue-100 text-xs">Expert Mentorship</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500/20 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      </div>
                      <span className="text-blue-100 text-xs">Project Guidance</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-cyan-500/20 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      </div>
                      <span className="text-blue-100 text-xs">Global Reach</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500/20 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      </div>
                      <span className="text-blue-100 text-xs">Teaching Tools</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500/20 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      </div>
                      <span className="text-blue-100 text-xs">Revenue Sharing</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="lg:w-3/5 p-6 max-h-[600px] overflow-y-auto">
              {step === 2 ? (
                /* STEP 2: Username & Password */
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      Step 2: Create Login Credentials
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Set up your username and secure password
                    </p>
                  </div>

                  <form onSubmit={proceedToStep3} className="space-y-4">
                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={goBackToStep1}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm mb-2"
                    >
                      <ChevronLeft className="w-3 h-3 mr-1" />
                      Back to Email Verification
                    </button>

                    {/* Username */}
                    <div className="space-y-1">
                      <label htmlFor="username" className="block text-xs font-medium text-gray-700">
                        Username *
                      </label>
                      <div className="relative">
                        <User className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            setFormData(prev => ({ ...prev, [name]: value }));
                          }}
                          className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                          placeholder="Choose a username"
                          required
                          minLength="3"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Must be at least 3 characters. Letters, numbers, and underscores only.
                      </p>
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Password */}
                      <div className="space-y-1">
                        <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                          Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => {
                              const { name, value } = e.target;
                              setFormData(prev => ({ ...prev, [name]: value }));

                              // Calculate strength
                              let s = 0;
                              if (value.length >= 8) s += 25;
                              if (/[A-Z]/.test(value)) s += 25;
                              if (/[0-9]/.test(value)) s += 25;
                              if (/[^A-Za-z0-9]/.test(value)) s += 25;
                              setStrength(s);
                            }}
                            className="w-full pl-8 pr-10 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                            placeholder="Create password"
                            required
                            minLength="8"
                          />
                          <button
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          >
                            {passwordVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>

                        {/* Password Strength */}
                        {formData.password && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">Strength</span>
                              <span className="font-medium" style={{ color: getStrengthColor() }}>
                                {getStrengthText()}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{ width: `${strength}%`, background: getStrengthColor() }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500">
                              • At least 8 characters<br />
                              • Include uppercase letter<br />
                              • Include number<br />
                              • Include special character
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1">
                        <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type={confirmPasswordVisible ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => {
                              const { name, value } = e.target;
                              setFormData(prev => ({ ...prev, [name]: value }));
                            }}
                            className="w-full pl-8 pr-10 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                            placeholder="Confirm password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          >
                            {confirmPasswordVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Next Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <span>Next: Profile</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </form>

                  {/* Social Login and Sign In Link */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white text-gray-500">or sign up with</span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="flex justify-center space-x-3">
                    <button className="w-8 h-8 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:border-red-500 hover:bg-red-500 transition-all duration-200">
                      <i className="fab fa-google text-xs"></i>
                    </button>
                    <button className="w-8 h-8 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:border-gray-800 hover:bg-gray-800 transition-all duration-200">
                      <i className="fab fa-github text-xs"></i>
                    </button>
                    <button className="w-8 h-8 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:border-blue-600 hover:bg-blue-600 transition-all duration-200">
                      <i className="fab fa-microsoft text-xs"></i>
                    </button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center mt-4">
                    <p className="text-gray-600 text-xs">
                      Already have an account?{" "}
                      <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              ) : step === 1 ? (
                /* STEP 1: Email & OTP Verification */
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      Step 1: Account Verification
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Secure your account with email or mobile verification
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-1">
                      <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                        Email Address or Mobile Number *
                      </label>
                      <div className="relative">
                        <Mail className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            setFormData(prev => ({ ...prev, [name]: value }));
                            setIdentifierError(""); // Clear error on type
                          }}
                          className={`w-full pl-8 pr-24 py-2 text-sm bg-gray-50 border ${identifierError ? "border-red-500" : "border-gray-300"} rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200`}
                          placeholder="email@example.com or mobile"
                          required
                          disabled={otpSent}
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          {!otpSent ? (
                            <button
                              type="button"
                              onClick={sendOTP}
                              disabled={loading || !formData.email}
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loading ? "Sending..." : "Send OTP"}
                            </button>
                          ) : (
                            <div className="flex items-center text-green-600 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Sent
                            </div>
                          )}
                        </div>
                      </div>
                      {identifierError && (
                        <p className="text-xs text-red-600 mt-1 flex items-center">
                          <XCircle className="w-3 h-3 mr-1" />
                          {identifierError}
                        </p>
                      )}
                    </div>

                    {/* OTP Verification Section - Only show after OTP is sent */}
                    {otpSent && (
                      <div className="space-y-3">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">
                            Enter the 6-digit code sent to
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {formData.email}
                          </p>
                        </div>

                        {/* OTP Input Fields */}
                        <div className="flex justify-between space-x-2">
                          {otp.map((data, index) => (
                            <input
                              key={index}
                              ref={el => otpRefs.current[index] = el}
                              type="text"
                              maxLength="1"
                              value={data}
                              onChange={e => handleOtpChange(e.target, index)}
                              onKeyDown={e => handleOtpKeyDown(e, index)}
                              onPaste={handleOtpPaste}
                              onFocus={e => e.target.select()}
                              className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white shadow-sm"
                              disabled={otpVerified}
                            />
                          ))}
                        </div>

                        {/* OTP Error Message */}
                        {otpError && (
                          <div className="text-xs text-red-600 text-center flex items-center justify-center">
                            <XCircle className="w-3 h-3 mr-1" />
                            {otpError}
                          </div>
                        )}

                        {/* Resend OTP */}
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={resendOTP}
                            disabled={resendTimer > 0 || loading}
                            className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            {resendTimer > 0 ? (
                              <span className="flex items-center justify-center">
                                <Clock className="w-2 h-2 mr-1" />
                                Resend code in {resendTimer}s
                              </span>
                            ) : (
                              "Resend verification code"
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Verify Button */}
                    <button
                      type="button"
                      onClick={verifyOTP}
                      disabled={loading || !otpSent}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Verifying...
                        </span>
                      ) : (
                        "Verify & Continue"
                      )}
                    </button>

                    {/* Login Link */}
                    <div className="text-center mt-4">
                      <p className="text-gray-600 text-xs">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200">
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* STEP 3: Profile Details */
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      Step 3: Complete Your Profile
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {formData.userType === "student"
                        ? "Tell us about your robotics journey"
                        : "Share your expertise and qualifications"}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={goBackToStep2}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm mb-2"
                    >
                      <ChevronLeft className="w-3 h-3 mr-1" />
                      Back to Login Details
                    </button>

                    {/* Verification Status */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <div className="text-left">
                            <span className="text-sm font-medium block">Verified Contact</span>
                            <span className="text-xs text-green-600 block">{verifiedIdentifier}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-medium text-green-600">Step 2/3 Complete</span>
                        </div>
                      </div>
                    </div>

                    {/* Email Address (Required) */}
                    <div className="space-y-1">
                      <label htmlFor="finalEmail" className="block text-xs font-medium text-gray-700">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="email"
                          id="finalEmail"
                          name="email"
                          value={formData.email}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            setFormData(prev => ({ ...prev, [name]: value }));
                          }}
                          className={`w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 ${verifiedIdentifier.includes("@") ? "bg-gray-100 cursor-not-allowed" : ""}`}
                          placeholder="Enter your email address"
                          required
                          disabled={verifiedIdentifier.includes("@")}
                        />
                      </div>
                      {verifiedIdentifier.includes("@") && (
                        <p className="text-xs text-green-600 mt-1 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" /> Verified via Email
                        </p>
                      )}
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1">
                      <label htmlFor="fullName" className="block text-xs font-medium text-gray-700">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            setFormData(prev => ({ ...prev, [name]: value }));
                          }}
                          className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>

                    {/* User Type Selection */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => handleUserTypeChange("student")}
                        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${formData.userType === "student"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        <GraduationCap className="w-3 h-3" />
                        <span>Student</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUserTypeChange("instructor")}
                        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${formData.userType === "instructor"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        <Users className="w-3 h-3" />
                        <span>Instructor</span>
                      </button>
                    </div>

                    {/* Student Specific Fields */}
                    {formData.userType === "student" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Mobile Number */}
                        <div className="space-y-1">
                          <label htmlFor="mobileNumber" className="block text-xs font-medium text-gray-700">
                            Mobile Number *
                          </label>
                          <div className="relative">
                            <Phone className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                              type="tel"
                              id="mobileNumber"
                              name="mobileNumber"
                              value={formData.mobileNumber}
                              onChange={(e) => {
                                const { name, value } = e.target;
                                setFormData(prev => ({ ...prev, [name]: value }));
                              }}
                              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                              placeholder="Enter mobile number"
                              required
                            />
                          </div>
                        </div>

                        {/* Grade Level */}
                        <div className="space-y-1">
                          <label htmlFor="gradeLevel" className="block text-xs font-medium text-gray-700">
                            Grade Level *
                          </label>
                          <div className="relative">
                            <GraduationCap className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <select
                              id="gradeLevel"
                              name="gradeLevel"
                              value={formData.gradeLevel}
                              onChange={(e) => {
                                const { name, value } = e.target;
                                setFormData(prev => ({ ...prev, [name]: value }));
                              }}
                              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                              required
                            >
                              <option value="">Select grade level</option>
                              {gradeLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* School */}
                        <div className="space-y-1 md:col-span-2">
                          <label htmlFor="school" className="block text-xs font-medium text-gray-700">
                            School/University *
                          </label>
                          <div className="relative">
                            <MapPin className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                              type="text"
                              id="school"
                              name="school"
                              value={formData.school}
                              onChange={(e) => {
                                const { name, value } = e.target;
                                setFormData(prev => ({ ...prev, [name]: value }));
                              }}
                              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                              placeholder="Enter your school/university name"
                              required
                            />
                          </div>
                        </div>

                        {/* Interests */}
                        <div className="space-y-1 md:col-span-2">
                          <label htmlFor="interests" className="block text-xs font-medium text-gray-700">
                            Robotics Interests
                          </label>
                          <textarea
                            id="interests"
                            name="interests"
                            value={formData.interests}
                            onChange={(e) => {
                              const { name, value } = e.target;
                              setFormData(prev => ({ ...prev, [name]: value }));
                            }}
                            rows="2"
                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                            placeholder="What areas of robotics interest you? (e.g., AI, drones, robotics arms, etc.)"
                          />
                        </div>
                      </div>
                    )}

                    {/* Instructor Specific Fields */}
                    {formData.userType === "instructor" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Expertise */}
                        <div className="space-y-1">
                          <label htmlFor="expertise" className="block text-xs font-medium text-gray-700">
                            Primary Expertise *
                          </label>
                          <div className="relative">
                            <BookOpen className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <select
                              id="expertise"
                              name="expertise"
                              value={formData.expertise}
                              onChange={(e) => {
                                const { name, value } = e.target;
                                setFormData(prev => ({ ...prev, [name]: value }));
                              }}
                              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                              required
                            >
                              <option value="">Select expertise area</option>
                              {expertiseAreas.map(area => (
                                <option key={area} value={area}>{area}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Experience */}
                        <div className="space-y-1">
                          <label htmlFor="experience" className="block text-xs font-medium text-gray-700">
                            Years of Experience *
                          </label>
                          <div className="relative">
                            <Calendar className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <select
                              id="experience"
                              name="experience"
                              value={formData.experience}
                              onChange={(e) => {
                                const { name, value } = e.target;
                                setFormData(prev => ({ ...prev, [name]: value }));
                              }}
                              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                              required
                            >
                              <option value="">Select experience</option>
                              {experienceLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Qualification */}
                        <div className="space-y-1">
                          <label htmlFor="qualification" className="block text-xs font-medium text-gray-700">
                            Highest Qualification *
                          </label>
                          <div className="relative">
                            <GraduationCap className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                              type="text"
                              id="qualification"
                              name="qualification"
                              value={formData.qualification}
                              onChange={(e) => {
                                const { name, value } = e.target;
                                setFormData(prev => ({ ...prev, [name]: value }));
                              }}
                              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                              placeholder="e.g., M.Tech, PhD, B.E."
                              required
                            />
                          </div>
                        </div>

                        {/* Specialization */}
                        <div className="space-y-1">
                          <label htmlFor="specialization" className="block text-xs font-medium text-gray-700">
                            Specialization
                          </label>
                          <input
                            type="text"
                            id="specialization"
                            name="specialization"
                            value={formData.specialization}
                            onChange={(e) => {
                              const { name, value } = e.target;
                              setFormData(prev => ({ ...prev, [name]: value }));
                            }}
                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                            placeholder="e.g., AI Robotics, Mechatronics"
                          />
                        </div>

                        {/* Company */}
                        <div className="space-y-1">
                          <label htmlFor="company" className="block text-xs font-medium text-gray-700">
                            Current Company/Institution
                          </label>
                          <div className="relative">
                            <Briefcase className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                              type="text"
                              id="company"
                              name="company"
                              value={formData.company}
                              onChange={(e) => {
                                const { name, value } = e.target;
                                setFormData(prev => ({ ...prev, [name]: value }));
                              }}
                              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                              placeholder="Where do you work?"
                            />
                          </div>
                        </div>

                        {/* Website */}
                        <div className="space-y-1">
                          <label htmlFor="website" className="block text-xs font-medium text-gray-700">
                            Website/Portfolio
                          </label>
                          <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={(e) => {
                              const { name, value } = e.target;
                              setFormData(prev => ({ ...prev, [name]: value }));
                            }}
                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                            placeholder="https://your-portfolio.com"
                          />
                        </div>
                      </div>
                    )}

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        checked={formData.terms}
                        onChange={(e) => {
                          const { name, checked } = e.target;
                          setFormData(prev => ({ ...prev, [name]: checked }));
                        }}
                        className="mt-0.5 w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                        required
                      />
                      <label htmlFor="terms" className="text-xs text-gray-600">
                        I agree to the{" "}
                        <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium">
                          Terms
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3" />
                          <span>
                            {formData.userType === "student"
                              ? "COMPLETE STUDENT REGISTRATION"
                              : "COMPLETE INSTRUCTOR REGISTRATION"}
                          </span>
                        </>
                      )}
                    </button>

                    {/* Login Link */}
                    <div className="text-center mt-4">
                      <p className="text-gray-600 text-xs">
                        Already have an account?{" "}
                        <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200">
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Font Awesome for social icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
    </div>
  );
};

export default Register;
