const express = require('express');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const UserOTPVerification = require('../models/userVerificationModel');
const hbs = require('nodemailer-express-handlebars');


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