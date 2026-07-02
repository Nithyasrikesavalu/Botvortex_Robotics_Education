import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Webinar', 'Workshop', 'Competition'], default: 'Webinar' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  format: { type: String, enum: ['Online', 'Hybrid', 'In-Person'], default: 'Online' },
  link: { type: String },
  instructorUpdate: { type: String },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
