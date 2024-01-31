const express = require('express');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const UserOTPVerification = require('../models/userVerificationModel');
const hbs = require('nodemailer-express-handlebars');

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
           this.sendOtpVerificationEmail(result,res);
        }); //SAVE COMMAND
      
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//NODEMAILER 
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth : {
        user: "mahobiashubham4@gmail.com",
        pass: "hutufymgqfwvnzdh",
    },
});

transporter.use('compile',hbs({
    viewEngine: 'express-handlebars',
    viewPath: './views/'
}));



exports.sendOtpVerificationEmail = async ({_id,email,fullName},res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOption = {
            from: "mahobiashubham4@gmail.com",
            to: email,
            subject: "Verify Your Email",
            template:'verifyOTP',
            context:{
                fullName:fullName,
                otp: otp,
            }
        };
        transporter.close();

        //Hashing the OTP - 
       const hashOTP = await bcrypt.hash(otp,12); 
       const newOtpVerification = await new UserOTPVerification({
        userId : _id,
        otp : hashOTP,
        createdAt: Date.now(),
        expiresAt : Date.now() + 3600000,
       });

       await newOtpVerification.save();
       transporter.sendMail(mailOption);
        return res.json({
        message: "Verification otp Mail sent",
        data:{
            userId : _id,
            email,
        },
       });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}