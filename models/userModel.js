const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Schema For the User
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    busNumber: {
      type: String,
      required: true,
    },
    scholarNumber: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

//This PRE function will act as a middleWare before hitting the save command
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    //Calling when password is changed or modified by the User
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
