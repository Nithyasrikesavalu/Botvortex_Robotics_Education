import Attendance from '../models/Attendance.js';
import EnrolledCourse from '../models/EnrolledCourse.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Check-in student
// @route   POST /api/attendance/checkin
// @access  Private
export const checkIn = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    let record = await Attendance.findOne({ studentId: req.user.id, date: today });
    if (record && record.checkIn) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    if (!record) {
      record = new Attendance({
        studentId: req.user.id,
        date: today,
        checkIn: new Date()
      });
    } else {
      record.checkIn = new Date();
    }

    const savedRecord = await record.save();

    // Find the instructor to notify
    const instructor = await User.findOne({ userType: 'instructor' });
    const student = await User.findById(req.user.id);
    if (instructor && student) {
      await Notification.create({
        userId: instructor._id,
        title: "Student Check-In",
        message: `${student.fullName} has submitted their attendance check-in for today.`,
        type: "info",
        icon: "Clock",
        action: "view"
      });
    }

    res.status(200).json(savedRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during check-in' });
  }
};

// @desc    Check-out student
// @route   POST /api/attendance/checkout
// @access  Private
export const checkOut = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const record = await Attendance.findOne({ studentId: req.user.id, date: today });
    if (!record || !record.checkIn) {
      return res.status(400).json({ message: 'You need to check in first' });
    }
    
    if (record.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    record.checkOut = new Date();
    
    // Calculate total hours
    const diffMs = record.checkOut - record.checkIn;
    const diffHrs = (diffMs / (1000 * 60 * 60)).toFixed(2);
    record.totalHours = parseFloat(diffHrs);
    
    // Check if minimum 3 hours met
    record.metRequirement = record.totalHours >= 3;

    const savedRecord = await record.save();
    res.status(200).json(savedRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during check-out' });
  }
};

// @desc    Get all attendance records (for Instructor)
// @route   GET /api/attendance
// @access  Private/Instructor
export const getAttendanceRecords = async (req, res) => {
  try {
    // Populate student info (e.g. name)
    const records = await Attendance.find({}).populate('studentId', 'fullName username email').sort({ date: -1 }).lean();
    
    // Replace "Overall" with the student's actual enrolled course if available
    for (let record of records) {
      if (record.course === 'Overall' && record.studentId) {
        const enrolled = await EnrolledCourse.findOne({ userId: record.studentId._id }).select('title');
        if (enrolled) {
          record.course = enrolled.title;
        }
      }
    }

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching attendance records' });
  }
};
