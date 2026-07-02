import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';

const run = async () => {
  await connectDB();
  const allUsers = await User.find({});
  console.log('Users:');
  allUsers.forEach(u => console.log(u.email, '->', u.userType));
  process.exit(0);
};

run();
