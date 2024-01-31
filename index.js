const mongoose = require('mongoose');
var express = require('express');
const schedule = require('node-schedule');
require('dotenv').config();
const { removingUnverifiedEMails } = require('./controller/signInController');
var app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Server Running on PORT 3000');
});

app.use(express.json());
const router = require('../RideEye_backend/routes/user');
app.use('/api',router);

//Connection
mongoose.connect(process.env.Database_URL).then(() => console.log("Database connected")).catch(err => console.log("Mongo Connection Error "+ err));

//Cron Job to remove unverified Emails -
schedule.scheduleJob('0 */12 * * *', () => {
    removingUnverifiedEMails();
});