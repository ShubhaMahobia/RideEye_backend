const express = require("express");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const UserOTPVerification = require("../models/userVerificationModel");
const hbs = require("nodemailer-express-handlebars");
const { sendOtpVerificationEmail } = require("./signInController");

exports.test = (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "Server is running" });
  } catch (error) {
    return res.status(400).json({ message: "Server is not running" });
  }
};

//Fetch All User Function
exports.fetchAllUsers = async (req, res) => {
  try {
    const results = await User.find();
    res.json(results);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    console.log(error);
  }
};

//Create User Function
exports.registerUser = async (req, res) => {
  const user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    enrollmentNumber: req.body.enrollmentNumber,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    busNumber: req.body.busNumber,
    scholarNumber: req.body.scholarNumber,
    verified: false,
  });
  try {
    const userExistEmail = await User.findOne({ email: req.body.email });
    const userExistENo = await User.findOne({
      enrollmentNumber: req.body.enrollmentNumber,
    });

    if (userExistEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email Already exist" });
    }
    if (userExistENo) {
      return res
        .status(400)
        .json({ success: false, message: "Enrollment Number Already exist" });
    }
    await user.save().then((result) => {
      sendOtpVerificationEmail(result, res);
    }); //SAVE COMMAND
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Get user API -
//Fetching User Details Using email
exports.getUser = async (req, res) => {
  let { email } = req.body;
  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "User email cannot be null" });
    }
    const user = await User.find({ email: email });
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  let { fullNameNew, phoneNumberNew, scholarNumberNew, enrollmentNumberNew, userId } = req.body;
  
  if (fullNameNew == null || phoneNumberNew == null || scholarNumberNew == null || enrollmentNumberNew == null) {
    return res.status(400).json({ success: false, message: 'Fields cannot be null' });
  }
  
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          fullName: fullNameNew,
          phoneNumber: phoneNumberNew,
          scholarNumber: scholarNumberNew,
          enrollmentNumber: enrollmentNumberNew
        }
      },
      { new: true } // This ensures you get the updated user document back
    );
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User Updated Successfully', updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

