import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import liveSessionRoutes from "./routes/liveSessionRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    const bodyCopy = { ...req.body };
    if (bodyCopy.password) bodyCopy.password = "********";
    console.log("📦 Body:", bodyCopy);
  }
  next();
});
app.use("/uploads", express.static("uploads"));

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/livesessions", liveSessionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});