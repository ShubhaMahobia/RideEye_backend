const express = require('express');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const UserOTPVerification = require('../models/userVerificationModel');
const hbs = require('nodemailer-express-handlebars');
const { sendOtpVerificationEmail } = require('./signInController');

//Fetch All User Function
exports.fetchAllUsers = async(req,res) =>{
    try {
        const results = await User.find();
        res.json(results);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//Create User Function
exports.registerUser = async(req,res) => {
    const user = new User({
        fullName : req.body.fullName,
        email : req.body.email,
        password : req.body.password,
        enrollmentNumber : req.body.enrollmentNumber,
        phoneNumber : req.body.phoneNumber,
        address : req.body.address,
        busNumber : req.body.busNumber,
        scholarNumber : req.body.scholarNumber,  
        verified:false, 
    });
    try {
        const userExistEmail = await User.findOne({email:req.body.email});
        const userExistENo = await User.findOne({enrollmentNumber:req.body.enrollmentNumber});

        if(userExistEmail){
           return res.json( 'Email Already Exist'); 
        }
        if(userExistENo){
           return res.json( 'Enrollment Number Already Exist'); 
        }
        await user.save().then((result) =>{
           sendOtpVerificationEmail(result,res);
        }); //SAVE COMMAND
      
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}





