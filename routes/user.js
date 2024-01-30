const express = require('express');
const { fetchAllUsers, registerUser } = require('../controller/userController.js');
const router = express.Router();


router.get('/users',fetchAllUsers);
router.post('/registerUser',registerUser);


module.exports = router;