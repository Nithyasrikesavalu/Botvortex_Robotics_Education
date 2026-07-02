import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Course from './models/Course.js';
import EnrolledCourse from './models/EnrolledCourse.js';

const run = async () => {
  await connectDB();
  const nithya = await User.findOne({ $or: [{ username: /nithyasri/i }, { fullName: /nithyasri/i }, { studentId: 'ST2024001' }] });
  console.log('User:', nithya ? nithya.fullName : 'Not found');
  
  if (nithya) {
    const enrollments = await EnrolledCourse.find({ userId: nithya._id });
    console.log('Enrollments:', enrollments.map(e => e.title));
    console.log('Enrollment objects:', JSON.stringify(enrollments, null, 2));
    
    for (let e of enrollments) {
        const course = await Course.findOne({ courseId: e.courseId });
        console.log('Course for', e.courseId, ':', course ? course.title + ' (Instructor: ' + course.instructor + ')' : 'Not found');
    }
  }
  
  process.exit(0);
};

run();
