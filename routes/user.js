const express = require('express');
const { fetchAllUsers, registerUser  } = require('../controller/userController.js');
const { verifyOTP } = require('../controller/signInController.js');
const router = express.Router();


router.get('/users',fetchAllUsers);
router.post('/signUp',registerUser);
router.post('/verifyOTP',verifyOTP);


module.exports = router;