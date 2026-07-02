import mongoose from 'mongoose';

const liveSessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'live', 'completed'], default: 'live' },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const LiveSession = mongoose.model('LiveSession', liveSessionSchema);
export default LiveSession;
