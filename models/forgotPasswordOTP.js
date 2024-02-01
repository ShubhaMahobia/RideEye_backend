const mongoos = require('mongoose');


const forgotPasswordOTP = mongoos.Schema({
    userId:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
    },
    expiresAt:{
        type:Date,
        required:true,
    },
});

const forgotPasswordOTPModel = mongoos.model("forgotPasswordOTP",forgotPasswordOTP);

module.exports = forgotPasswordOTPModel;