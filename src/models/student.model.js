import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required while registering a student"],
      maxLength: [
        100,
        "Student name is too long! Maximum characters allowed is 100",
      ],
    },
    profilePhoto: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required while registering a student"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required while registering a student"],
      enum: ["male", "female", "other"],
    },
    dob: {
      type: Date,
      required: [true, "Date of Birth is required"],
    },
    studentPan: {
      type: String,
      // unique: [true, "student PAN must be unique"],
    },
    aadharId: {
      type: String,
      // unique: [true, "Student Aadhar ID must be unique"],
    },
    motherName: {
      type: String,
    },
    motherAadhar: {
      type: String,
    },
    fatherName: {
      type: String,
    },
    fatherAadhar: {
      type: String,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
      // unique: [true, "Phone number must be unique"],
    },
    whatsappNumber: {
      type: String,
      // unique: [true, "WhatsApp number must be unique"],
    },
    studentClass: {
      type: Schema.Types.ObjectId,
      ref: "StudentAcademicClass",
      required: [true, "Class Id is required while registering a student"],
    },
    rollNumber: { type: String },
    grade: { type: String },
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    parentContact: {
      type: String,
    },
    parentName: {
      type: String,
    },
    role: {
      type: String,
      default: "student",
    },
  },
  { timestamps: true }
);

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;

  next();
});

// Method to compare passwords
studentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

studentSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

studentSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Student = mongoose.model("Student", studentSchema);
