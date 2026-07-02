import Event from '../models/Event.js';

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Instructor
export const createEvent = async (req, res) => {
  try {
    const { title, type, date, time, format, link, instructorUpdate } = req.body;

    const event = new Event({
      title,
      type,
      date,
      time,
      format,
      link,
      instructorUpdate,
      instructorId: req.user.id
    });

    const createdEvent = await event.save();
    // Add instructor name dynamically if populated, but we just save it now
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating event' });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Private
export const getEvents = async (req, res) => {
  try {
    let events;
    if (req.user.role === 'instructor') {
      events = await Event.find({ instructorId: req.user.id }).sort({ date: 1, time: 1 });
    } else {
      // Students fetch all events for now (can be filtered by enrolled courses later)
      // Populate instructor name for students to see
      events = await Event.find({}).populate('instructorId', 'fullName').sort({ date: 1, time: 1 });
    }
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Instructor
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Ensure instructor owns the event
    if (event.instructorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
};
