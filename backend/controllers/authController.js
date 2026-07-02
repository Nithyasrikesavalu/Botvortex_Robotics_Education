import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/mail.js";

/* ===================== SEND OTP ===================== */
export const sendOtp = async (req, res) => {
  try {
    const { email, mobile } = req.body;
    const identifier = email || mobile;

    if (!identifier) {
      return res.status(400).json({ message: "Email or Mobile number is required" });
    }

    console.log("📩 Send OTP request for:", identifier);

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: identifier }, { "studentDetails.mobileNumber": identifier }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Account already registered",
        role: existingUser.userType
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ identifier });
    console.log("🗑 Old OTPs cleared");

    await Otp.create({
      identifier,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });
    console.log("💾 OTP saved in DB");

    // Send Email or Mock SMS
    if (identifier.includes("@")) {
      try {
        await transporter.sendMail({
          from: `"BotVortex" <${process.env.EMAIL_USER}>`,
          to: identifier,
          subject: "BotVortex - Email Verification OTP",
          html: `
            <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
              <h2 style="color:#6c3ce1;">🤖 BotVortex Email Verification</h2>
              <p>Thank you for registering! Your OTP to verify your email is:</p>
              <h1 style="letter-spacing:8px;color:#333;background:#f3f0ff;padding:16px;border-radius:6px;text-align:center;">${otp}</h1>
              <p style="color:#888;font-size:13px;">This code expires in <b>5 minutes</b>. Do not share it with anyone.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
              <p style="color:#aaa;font-size:11px;">If you didn't request this, please ignore this email.</p>
            </div>
          `
        });
        console.log("📧 Mail sent successfully to:", identifier);
      } catch (mailError) {
        console.error("❌ Mail sending failed:", mailError);
        return res.status(500).json({ message: "Failed to send OTP email. Please try again." });
      }
    } else {
      // Mock SMS
      console.log(`📱 [MOCK SMS] Sending OTP ${otp} to mobile ${identifier}`);
    }

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ OTP ERROR:", error);
    res.status(500).json({ message: "OTP send failed", error: error.message });
  }
};

/* ===================== VERIFY OTP ===================== */
export const verifyOtp = async (req, res) => {
  try {
    const { email, mobile, otp } = req.body;
    const identifier = email || mobile;

    const record = await Otp.findOne({ identifier, otp });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await Otp.deleteMany({ identifier });

    // Generate verification token (valid for 15 mins)
    const verificationToken = jwt.sign(
      { identifier, scope: "registration_verification" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      message: "OTP verified successfully",
      verificationToken
    });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/* ===================== REGISTER ===================== */
export const register = async (req, res) => {
  try {
    const data = req.body;
    const { verificationToken } = data;

    if (!verificationToken) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);
      if (decoded.scope !== "registration_verification") {
        return res.status(400).json({ message: "Invalid verification token scope" });
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    const authorizedIdentifier = decoded.identifier;

    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Ensure the verified identifier matches one of the inputs
    if (authorizedIdentifier !== data.email && authorizedIdentifier !== data.studentDetails?.mobileNumber) {
      // If verifying mobile, mismatch might be fine if email is provided new.
      // But we should at least check if the token belongs to the request.
      // For now, let's strictly require that if email was verified, it matches data.email.
      if (authorizedIdentifier.includes("@") && authorizedIdentifier !== data.email) {
        return res.status(400).json({ message: "Verified email does not match provided email" });
      }
      // If mobile was verified, we just ensure it matches the mobile provided? 
      // Or we trust the token. But we need to save the verified status.
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      userType: data.userType,
      emailVerified: true,
      isApproved: data.userType === "instructor" ? false : true,
      studentDetails: data.userType === "student" ? data.studentDetails : {},
      instructorDetails: data.userType === "instructor" ? data.instructorDetails : {}
    });

    // JWT
    const token = jwt.sign(
      { id: user._id, role: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.userType,
        fullName: user.fullName,
        avatar: ""
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

/* ===================== FORGOT PASSWORD SEND OTP ===================== */
export const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists (Opposite of specific registration check)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ identifier: email });

    await Otp.create({
      identifier: email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    // Send Email
    try {
      await transporter.sendMail({
        from: `"BotVortex" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "BotVortex Password Reset OTP",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
            <h2 style="color:#6c3ce1;">🔐 BotVortex Password Reset</h2>
            <p>Your OTP to reset your password is:</p>
            <h1 style="letter-spacing:8px;color:#333;background:#f3f0ff;padding:16px;border-radius:6px;text-align:center;">${otp}</h1>
            <p style="color:#888;font-size:13px;">This code expires in <b>5 minutes</b>. Do not share it with anyone.</p>
          </div>
        `
      });
      console.log("📧 Reset Mail sent successfully");
    } catch (mailError) {
      console.error("❌ Mail sending failed:", mailError);
      return res.status(500).json({ message: "Failed to send OTP email. Please try again later." });
    }

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/* ===================== FORGOT PASSWORD VERIFY OTP ===================== */
export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ identifier: email, otp });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await Otp.deleteMany({ identifier: email });

    // Generate password reset token
    const resetToken = jwt.sign(
      { email, scope: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      message: "OTP verified",
      resetToken
    });
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};

/* ===================== RESET PASSWORD ===================== */
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "Missing token or password" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
      if (decoded.scope !== "password_reset") {
        return res.status(400).json({ message: "Invalid token scope" });
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const email = decoded.email;

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Password reset failed", error: error.message });
  }
};

/* ===================== LOGIN ===================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    console.log("🔑 Login attempt for email:", email);
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("❌ User not found in DB for email:", email);
      return res.status(404).json({ message: "Account not found" });
    }

    // Check password
    console.log("💡 Found user, comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Password mismatch for email:", email);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const profile = await StudentProfile.findOne({ userId: user._id });
    const avatar = profile?.personal?.avatar || "";

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.userType,
        fullName: user.fullName,
        avatar: avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
