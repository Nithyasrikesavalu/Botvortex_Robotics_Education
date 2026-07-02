const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb+srv://Nithyasrikesavalu:L1Fm43pM7Qj51D0P@cluster0.lbc3rdq.mongodb.net/botvortex');
  console.log("Connected to MongoDB.");

  const TaskSubmission = mongoose.connection.collection('tasksubmissions');
  const submissions = await TaskSubmission.find({}).toArray();
  console.log("Total Submissions:", submissions.length);
  if (submissions.length > 0) {
    console.log("Sample submission:", submissions[submissions.length - 1]);
  }

  const Tasks = mongoose.connection.collection('tasks');
  const tasks = await Tasks.find({}).toArray();
  console.log("Total Tasks:", tasks.length);
  if (tasks.length > 0) {
    console.log("Sample task:", tasks[tasks.length - 1]);
  }

  mongoose.disconnect();
}
run().catch(console.error);
