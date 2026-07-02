import mongoose from 'mongoose';

const taskSubmissionSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notes: { type: String, required: true },
  fileUrl: { type: String }, // Path to the uploaded PDF
  status: { type: String, enum: ['Submitted', 'Graded'], default: 'Submitted' },
  grade: { type: String },
  review: { type: String },
  coinsAwarded: { type: Number, default: 0 },
  coinsClaimed: { type: Boolean, default: false }
}, { timestamps: true });

const TaskSubmission = mongoose.model('TaskSubmission', taskSubmissionSchema);
export default TaskSubmission;
