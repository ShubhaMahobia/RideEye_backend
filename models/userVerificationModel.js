const mongoos = require('mongoose');


const UserOTPVerificationSchema = mongoos.Schema({
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

const UserOTPVerification = mongoos.model("UserOTPVerfication",UserOTPVerificationSchema);

module.exports = UserOTPVerification;