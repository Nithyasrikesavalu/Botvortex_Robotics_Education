import ProgramLead from "../models/ProgramLead.js";
import transporter from "../config/mail.js";

export const requestProgramDetails = async (req, res) => {
  try {
    const { email, countryCode, mobile } = req.body;
    console.log("-----------------------------------------");
    console.log("📨 NEW PROGRAM INQUIRY RECEIVED");
    console.log("📧 Email:", email);
    console.log("📱 Mobile:", countryCode, mobile);
    console.log("-----------------------------------------");

    if (!email || !mobile) {
      return res.status(400).json({ message: "Email and mobile number are required" });
    }

    // Save lead to database
    let newLead;
    try {
      newLead = await ProgramLead.create({
        email,
        countryCode,
        mobile
      });
      console.log("✅ Lead successfully saved to database");
    } catch (dbErr) {
      console.error("❌ DB Storage Error:", dbErr.message);
      // We continue even if DB fails, but typically we want to know
    }

    // Send Program Details email to the user
    let mailSent = false;
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("⚠️ Warning: EMAIL_USER or EMAIL_PASS not set in .env");
        throw new Error("Email configuration missing");
      }

      await transporter.sendMail({
        from: `"BotVortex Academy" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "BotVortex - Robotics Program Details",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #2563eb; margin: 0;">BotVortex</h1>
              <p style="color: #64748b; margin: 5px 0 0 0;">Future of Robotics Education</p>
            </div>
            
            <h2 style="color: #1e293b;">Hello,</h2>
            <p>Thank you for your interest in the <b>BotVortex Robotics Programs</b>. We're excited to help you start your journey into the world of autonomous systems and AI.</p>
            
            <h3 style="color: #2563eb;">Our Core Programs:</h3>
            <ul style="color: #475569; line-height: 1.6;">
              <li><b>Foundations of Robotics (12 Weeks):</b> Electronics, Mechanics, and Arduino.</li>
              <li><b>AI & Machine Learning (16 Weeks):</b> Neural Networks and Computer Vision.</li>
              <li><b>Advanced Autonomous Systems (20 Weeks):</b> SLAM, ROS 2, and Drones.</li>
            </ul>

            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px dashed #cbd5e1;">
              <p style="margin: 0; font-weight: bold; color: #1e293b;">Next Batch Starts Soon!</p>
              <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #64748b;">Enroll before this weekend to get 20% Early Bird discount.</p>
            </div>

            <p>If you have any questions, feel free to reply to this email or call our learning advisor at <b>+91 1234567890</b>.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:5173/programs" style="background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">Explore Full Syllabus</a>
            </div>

            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="text-align: center; font-size: 0.8rem; color: #94a3b8;">
              &copy; 2025 BotVortex Robotics Academy. All rights reserved.
            </p>
          </div>
        `
      });
      console.log("📧 Program details email sent to user:", email);
      mailSent = true;

      // SMS Delivery (Optional)
      if (process.env.SMS_API_KEY) {
        try {
          const smsMessage = `Hello! Thanks for your interest in BotVortex. Check your email ${email} for the full syllabus. - BotVortex Team`;
          const smsResponse = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.SMS_API_KEY}&route=q&message=${encodeURIComponent(smsMessage)}&flash=0&numbers=${mobile.replace(/\D/g, '')}`);
          console.log("📱 SMS Response logged to internal logs.");
        } catch (smsErr) {
          console.error("❌ SMS Delivery Error:", smsErr.message);
        }
      }

    } catch (mailError) {
      console.error("❌ Email Sending Failed:", mailError.message);
    }

    // Notify Admin (optional, only if user mail succeeded or we want broad awareness)
    try {
      if (process.env.EMAIL_USER) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `New Lead: Program Details Inquiry`,
          html: `<p><b>Email:</b> ${email}</p><p><b>Mobile:</b> ${countryCode} ${mobile}</p><p><b>Time:</b> ${new Date().toLocaleString()}</p>`
        });
      }
    } catch (adminMailErr) {
      console.error("❌ Admin Notification Failed:", adminMailErr.message);
    }

    res.status(201).json({
      message: mailSent ? "Details sent successfully to your email!" : "Request received! Our team will contact you shortly.",
      mailSent: mailSent,
      data: newLead
    });

  } catch (error) {
    console.error("❌ CRITICAL PROGRAM DETAIL ERROR:", error);
    res.status(500).json({ message: "Server error while processing request" });
  }
};
