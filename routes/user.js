const express = require('express');
const { fetchAllUsers, registerUser  } = require('../controller/userController.js');
const { verifyOTP, resendOTP, signIn, sendPasswordOTPMail, verifyOTPpasswordReset, resendOTPforPassword, resetPassword } = require('../controller/signInController.js');
const router = express.Router();


router.get('/users',fetchAllUsers);
router.post('/signUp',registerUser);
router.post('/verifyOTP',verifyOTP);
router.post('/resendOTP',resendOTP);
router.post('/login',signIn);
router.post('/forgotpassreq',sendPasswordOTPMail);
router.post('/forgotpassverify',verifyOTPpasswordReset);
router.post('/updatepass',resetPassword);


module.exports = router;