import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: String, required: true },
  dueDate: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: Number, default: 0 },
  submitted: { type: Number, default: 0 },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;
