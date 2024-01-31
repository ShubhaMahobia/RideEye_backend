const express = require('express');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const UserOTPVerification = require('../models/userVerificationModel');
const hbs = require('nodemailer-express-handlebars');
const jwt = require('jsonwebtoken');


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

//Send OTP Function
exports.sendOtpVerificationEmail = async ({_id,email,fullName},res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`; //generating OTP
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

        //Securing  the OTP - 
       const hashOTP = await bcrypt.hash(otp,12); 
       const newOtpVerification = await new UserOTPVerification({
        userId : _id,
        otp : hashOTP,
        createdAt: Date.now(),
        expiresAt : Date.now() + 600000,
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


//VerifyOTP Fucntion
exports.verifyOTP = async(req,res) => {
    try {
        let{userId,otp} = req.body;
        if(!userId || !otp){
            throw Error("Empty otp details are not allowed");
        }else{
             const UserOTPVerificationRecord = await UserOTPVerification.find({
                userId,
            });
            if(UserOTPVerificationRecord.length <= 0){
                //NO RECORD FOUND;
                throw new Error("Account record doesn't exist or has been verified already. Please sign up or login");
            }else{
                const { expiresAt } = UserOTPVerificationRecord[0];
                const hashedOTP = UserOTPVerificationRecord[0].otp;

                if(expiresAt< Date.now()){
                    //Otp has expired 
                    await UserOTPVerification.deleteMany({userId});
                    throw new Error("OTP EXPIRED");
                }else{
                    const vaildOTP = await bcrypt.compare(otp,hashedOTP);

                    if(!vaildOTP){
                        //supplied OTP is wrong
                        throw new Error("OTP IS WRONG");
                    }else{
                        await User.updateOne({_id:userId},{verified:true});
                        await UserOTPVerification.deleteMany({userId});
                        return res.json({
                            message:"Email Verified Successfully",
                        })
                    }
                }
            }
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//Resend OTP function
exports.resendOTP = async(req,res) =>{
    try {
        let{userId,email} = req.body;
        if(!userId || !email){
            throw Error("Empty otp details are not allowed");
        }else{
            await UserOTPVerification.deleteMany({userId});
            this.sendOtpVerificationEmail({_id:userId,email},res);
        }
    } catch (e) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//Removing Unverified users - 
exports.removingUnverifiedEMails = async(res) => {
    try {
        await User.deleteMany({verified: false}); 
        console.log("Unverified Account Deleted");
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//SignIn function - 
exports.signIn = async (req,res) => {
  try {
    userExists = await User.find({email:req.body.email}).exec().then(user=>{
        if(user.length<=0){
            return res.status(401).json({message:"User not Found"});
        }else{
            bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(!result){
            return res.status(401).json({message:"Password not correct"});
            }else{
                const token = jwt.sign({email:user[0].email,userId:user[0]._id},'81012BB9A64888F4A27786E63DF9B5A65DBD04398402026F67D3B2525DFEDB2E',{expiresIn:"24h"});
                res.status(200).json({
                    email:user[0].email,
                    userId:user[0]._id,
                    token:token,
                });
            }

            });
        }
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
    

    
}