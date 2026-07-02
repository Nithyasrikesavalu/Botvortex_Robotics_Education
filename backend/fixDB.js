import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Course from './models/Course.js';
import EnrolledCourse from './models/EnrolledCourse.js';

const run = async () => {
  await connectDB();
  
  // Update Nithyasri's user to have the studentId
  await User.updateOne({ fullName: /Nithyasri/i }, { $set: { studentId: 'ST2024001' } });
  
  // Find the valid Introduction to Robotics course
  const validCourse = await Course.findOne({ courseId: 'introduction-to-robotics' });
  
  if (validCourse) {
      // Update the enrollment
      await EnrolledCourse.updateOne(
          { courseId: 'C-1' },
          { $set: { courseId: validCourse.courseId, courseRef: validCourse._id } }
      );
      console.log('Successfully updated enrollment to link to the valid course!');
  } else {
      console.log('Could not find the valid course.');
  }
  
  process.exit(0);
};

run();
