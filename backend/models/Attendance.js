import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: String, default: 'Overall' }, // Optional, can be used if attendance is per course
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  checkIn: { type: Date },
  checkOut: { type: Date },
  totalHours: { type: Number, default: 0 },
  metRequirement: { type: Boolean, default: false } // Minimum 3 hours
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
