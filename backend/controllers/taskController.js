import Task from '../models/Task.js';
import TaskSubmission from '../models/TaskSubmission.js';
import User from '../models/User.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Instructor
export const createTask = async (req, res) => {
  try {
    const { title, course, dueDate, description } = req.body;

    const task = new Task({
      title,
      course,
      dueDate,
      description,
      instructorId: req.user.id
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// @desc    Get all tasks (optionally filtered by course, returns submission status for student)
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    
    // Check if user is a student, we map tasks with their submission status
    if (req.user.role === 'student') {
      const submissions = await TaskSubmission.find({ studentId: req.user.id });
      const submittedTaskIds = submissions.map(s => s.taskId.toString());
      
      const tasksWithStatus = tasks.map(t => {
        const submission = submissions.find(s => s.taskId.toString() === t._id.toString());
        return {
          ...t._doc,
          status: submission ? submission.status : 'Pending',
          progress: submission ? 100 : 0,
          grade: submission?.grade || null,
          review: submission?.review || null,
          coinsAwarded: submission?.coinsAwarded || 0,
          coinsClaimed: submission?.coinsClaimed || false,
          fileUrl: submission?.fileUrl || null
        };
      });
      return res.json(tasksWithStatus);
    }
    
    // For instructors, return normally
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// @desc    Submit a task
// @route   POST /api/tasks/:id/submit
// @access  Private/Student
export const submitTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { notes } = req.body;
    let fileUrl = '';

    // If file was uploaded via multer
    if (req.file) {
      // In Windows backslashes are used, we normalize to forward slash
      fileUrl = req.file.path.replace(/\\/g, "/"); 
    }

    // Check if already submitted
    const existingSubmission = await TaskSubmission.findOne({ taskId, studentId: req.user.id });
    if (existingSubmission) {
      return res.status(400).json({ message: 'Task already submitted' });
    }

    const submission = new TaskSubmission({
      taskId,
      studentId: req.user.id,
      notes: notes || '',
      fileUrl
    });

    await submission.save();

    // Increment submitted count on Task
    await Task.findByIdAndUpdate(taskId, { $inc: { submitted: 1 } });

    res.status(201).json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error submitting task' });
  }
};

// @desc    Get all submissions (for debugging)
// @route   GET /api/tasks/all/submissions
// @access  Public
export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await TaskSubmission.find({})
      .populate('taskId', 'title course dueDate')
      .populate('studentId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching submissions' });
  }
};

// @desc    Grade a task submission
// @route   PUT /api/tasks/submissions/:id/grade
// @access  Instructor
export const gradeSubmission = async (req, res) => {
  try {
    const { grade, review, coins } = req.body;
    const submission = await TaskSubmission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.status = 'Graded';
    submission.grade = grade;
    submission.review = review;
    submission.coinsAwarded = coins || 0;

    await submission.save();

    res.json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error grading submission' });
  }
};

// @desc    Claim coins awarded for a task
// @route   POST /api/tasks/:id/claim-coins
// @access  Private
export const claimTaskCoins = async (req, res) => {
  try {
    const submission = await TaskSubmission.findOne({ taskId: req.params.id, studentId: req.user.id });
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.coinsAwarded <= 0) {
      return res.status(400).json({ message: 'No coins awarded for this task' });
    }

    if (submission.coinsClaimed) {
      return res.status(400).json({ message: 'Coins already claimed' });
    }

    submission.coinsClaimed = true;
    await submission.save();

    const student = await User.findById(req.user.id);
    if (student) {
      student.coins = (student.coins || 0) + Number(submission.coinsAwarded);
      await student.save();
      return res.json({ message: 'Coins claimed successfully', coins: student.coins, submission });
    }

    res.status(404).json({ message: 'Student not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error claiming coins' });
  }
};
