import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, required: true },

    password: {
      type: String,
      required: true,
      select: false // hide password by default
    },

    fullName: { type: String, required: true },

    userType: {
      type: String,
      enum: ["student", "instructor"],
      default: "student"
    },

    emailVerified: { type: Boolean, default: false },

    isApproved: {
      type: Boolean,
      default: false // instructor only
    },

    studentDetails: {
      mobileNumber: String,
      gradeLevel: String,
      school: String,
      interests: String
    },

    instructorDetails: {
      expertise: String,
      experience: String,
      qualification: String,
      specialization: String,
      company: String,
      website: String
    },
    coins: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
