import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("📧 Email Config - User:", process.env.EMAIL_USER ? "Present" : "MISSING");
console.log("📧 Email Config - Pass:", process.env.EMAIL_PASS ? "Present" : "MISSING");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email Transporter Error:", error.message);
  } else {
    console.log("✅ Email Server is ready to send messages");
  }
});
export default transporter;
