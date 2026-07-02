import { API_URL } from "../../config/api";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bot, Eye, EyeOff, Mail, Lock, LogIn, User, Users, X, KeyRound, CheckCircle } from "lucide-react";
import { useGoogleLogin } from '@react-oauth/google';

const SignIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("student");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    otp: ["", "", "", "", "", ""],
    newPassword: "",
    confirmPassword: ""
  });
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  });

  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/auth/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token, role })
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Google Login failed");
          setLoading(false);
          return;
        }
        if (data.user.role === "student") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate('/index', { state: { email: data.user.email, role: "student" } });
        } else {
          localStorage.setItem("instructorToken", data.token);
          localStorage.setItem("instructorUser", JSON.stringify(data.user));
          navigate('/instructor-dashboard', { state: { email: data.user.email, role: "instructor" } });
        }
        setLoading(false);
      } catch (err) {
        setError("Server error during Google Login.");
        setLoading(false);
      }
    },
    onError: () => {
      setError("Google Login Failed");
    }
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          alert("Account not found. Redirecting to registration...");
          navigate('/signup'); // Redirect to Register page
          return;
        }

        // Handle 401 and other errors
        setError(data.message || "Invalid username or password");
        setLoading(false);
        return;
      }

      // Login Successful

      // Check if user role matches selected tab
      if (data.user.role !== role) {
        setError(`Access denied. This account is registered as a ${data.user.role}. Please switch to the ${data.user.role} login tab.`);
        setLoading(false);
        return;
      }

      // Navigate based on role and store tokens separately
      if (data.user.role === "student") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate('/index', {
          state: { email: formData.email, role: "student" }
        });
      } else {
        localStorage.setItem("instructorToken", data.token);
        localStorage.setItem("instructorUser", JSON.stringify(data.user));
        navigate('/instructor-dashboard', {
          state: { email: formData.email, role: "instructor" }
        });
      }
      setLoading(false);

    } catch (err) {
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  // Forgot Password Handlers
  const handleForgotPasswordEmail = async () => {
    if (!forgotPasswordData.email) {
      alert("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    setForgotPasswordLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/send-forgot-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordData.email })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send OTP");
        setForgotPasswordLoading(false);
        return;
      }

      setForgotPasswordLoading(false);
      setOtpSent(true);
      setForgotPasswordStep(2);
      // Removed alert as per user request, or show a subtle success message if needed.
      // For now, moving to step 2 IS the indication.

    } catch (err) {
      alert("Server error");
      setForgotPasswordLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    const otpValue = forgotPasswordData.otp.join('');

    if (otpValue.length !== 6) {
      alert("Please enter 6-digit OTP");
      return;
    }

    setForgotPasswordLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/verify-forgot-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotPasswordData.email,
          otp: otpValue
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid OTP");
        setForgotPasswordLoading(false);
        return;
      }

      // Store reset token temporarily
      setForgotPasswordData(prev => ({
        ...prev,
        resetToken: data.resetToken
      }));

      setForgotPasswordLoading(false);
      setOtpVerified(true);
      setForgotPasswordStep(3);

    } catch (err) {
      alert("Server error");
      setForgotPasswordLoading(false);
    }
  };

  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!forgotPasswordData.newPassword) {
      alert("Please enter new password");
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (forgotPasswordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setForgotPasswordLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetToken: forgotPasswordData.resetToken,
          newPassword: forgotPasswordData.newPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Password reset failed");
        setForgotPasswordLoading(false);
        return;
      }

      setForgotPasswordLoading(false);
      setResetSuccess(true);
      // alert("Password reset successful! You can now login with your new password.");
      // closeForgotPassword();

    } catch (err) {
      alert("Server error");
      setForgotPasswordLoading(false);
    }
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOTPChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...forgotPasswordData.otp];
    newOtp[index] = value;
    setForgotPasswordData(prev => ({
      ...prev,
      otp: newOtp
    }));

    // Auto move
    if (value && index < 5) {
      document.getElementById(`forgot-otp-${index + 1}`).focus();
    }
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep(1);
    setForgotPasswordData({
      email: "",
      otp: ["", "", "", "", "", ""],
      newPassword: "",
      confirmPassword: ""
    });
    setOtpSent(false);
    setOtpVerified(false);
    setResetSuccess(false);
  };

  return (
    <>
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {forgotPasswordStep === 1 ? "Reset Password" :
                  forgotPasswordStep === 2 ? "Verify OTP" :
                    "Set New Password"}
              </h2>
              <button
                onClick={closeForgotPassword}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Step 1: Enter Email */}
              {forgotPasswordStep === 1 && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Enter your email address to receive a password reset OTP.
                  </p>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={forgotPasswordData.email}
                        onChange={handleForgotPasswordChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleForgotPasswordEmail}
                    disabled={forgotPasswordLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {forgotPasswordLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Send Reset OTP"
                    )}
                  </button>
                </div>
              )}

              {/* Step 2: Enter OTP */}
              {forgotPasswordStep === 2 && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Enter the 6-digit OTP sent to <span className="font-semibold">{forgotPasswordData.email}</span>
                  </p>
                  <div className="flex justify-center gap-2">
                    {forgotPasswordData.otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`forgot-otp-${i}`}
                        value={digit}
                        maxLength={1}
                        onChange={(e) => handleOTPChange(e.target.value, i)}
                        className="w-12 h-12 text-center text-xl border-2 border-blue-300 rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">
                      Please enter the code sent to your email.
                    </p>
                  </div>
                  <button
                    onClick={handleOTPVerification}
                    disabled={forgotPasswordLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {forgotPasswordLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" /> Verify OTP
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Step 3: New Password */}
              {/* Step 3: New Password */}
              {forgotPasswordStep === 3 && (
                <div className="space-y-4">
                  {resetSuccess ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Password Updated!</h3>
                      <p className="text-gray-600 mb-6">You can now use your new password to login.</p>
                      <button
                        onClick={closeForgotPassword}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                      >
                        Back to Login
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">Email verified successfully</span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Create your new password
                      </p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <input
                            type="password"
                            name="newPassword"
                            value={forgotPasswordData.newPassword}
                            onChange={handleForgotPasswordChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter new password"
                          />
                          <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={forgotPasswordData.confirmPassword}
                            onChange={handleForgotPasswordChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleResetPassword}
                        disabled={forgotPasswordLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {forgotPasswordLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          "Reset Password"
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Login Page */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">

        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-[length:40px_40px] bg-[linear-gradient(to_right,rgba(67,97,238,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(67,97,238,0.05)_1px,transparent_1px)]"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100/50 overflow-hidden">

            {/* Top Logo */}
            <div className="p-8 text-center border-b border-blue-100">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 font-['Orbitron'] tracking-wide mb-1">
                {role === "student" ? "Student Login" : "Instructor Login"}
              </h1>

              <p className="text-gray-600 text-sm">
                {role === "student"
                  ? "Access your student learning portal"
                  : "Access the instructor dashboard"}
              </p>

              {/* Role Switch */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all duration-200 ${role === "student"
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                >
                  <User className="w-4 h-4" /> Student
                </button>

                <button
                  type="button"
                  onClick={() => setRole("instructor")}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all duration-200 ${role === "instructor"
                    ? "bg-purple-600 text-white shadow-md scale-105"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    }`}
                >
                  <Users className="w-4 h-4" /> Instructor
                </button>
              </div>
            </div>

            {/* FORM */}
            <div className="p-8">
              {error && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
                  <X className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}
              <form onSubmit={handleLoginSubmit} className="space-y-6">

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-blue-50/50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-12 py-3 bg-blue-50/50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                    />

                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                    >
                      {passwordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${role === "student"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-purple-600 hover:bg-purple-700"
                    }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" /> Login as {role === "student" ? "Student" : "Instructor"}
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">or sign in with</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="flex justify-center space-x-4">
                  <button type="button" onClick={() => googleLogin()} className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:border-red-500 hover:bg-red-500 transition-all duration-200">
                    <i className="fab fa-google text-sm"></i>
                  </button>
                </div>

                {/* Create Account Link */}
                <p className="text-center text-sm text-gray-600 pt-4">
                  New user?{" "}
                  <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Create account
                  </Link>
                </p>
              </form>
            </div>
          </div>

          <p className="text-center mt-6 text-gray-500 text-xs">
            Secure authentication powered by BotVortex AI
          </p>

          {/* Add Font Awesome for social icons */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          />
        </div>
      </div>
    </>
  );
};

export default SignIn;
