const mongoose = require('mongoose');
var express = require('express');
var app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Server Running on PORT 3000');
});

app.use(express.json());
const router = require('../RideEye_backend/routes/user');
app.use('/api',router);

//Connection
mongoose.connect('mongodb://127.0.0.1:27017/ride_eye_dev').then(() => console.log("Database connected")).catch(err => console.log("Mongo Connection Error "+ err));
