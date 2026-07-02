import LiveSession from '../models/LiveSession.js';

// @desc    Create a new live session
// @route   POST /api/livesessions
// @access  Private/Instructor
export const createLiveSession = async (req, res) => {
  try {
    const { title, description, link } = req.body;

    const session = new LiveSession({
      title,
      description,
      link,
      instructorId: req.user.id
    });

    const createdSession = await session.save();
    res.status(201).json(createdSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating live session' });
  }
};

// @desc    Get all live sessions
// @route   GET /api/livesessions
// @access  Private
export const getLiveSessions = async (req, res) => {
  try {
    const sessions = await LiveSession.find({}).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching live sessions' });
  }
};
