const mongoose = require('mongoose');

var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(3000, function () {
  console.log('Server Running on PORT 3000');
});

//Connection
mongoose.connect('mongodb://127.0.0.1:27017/ride_eye_dev').then(() => console.log("Database connected")).catch(err => console.log("Mongo Connection Error "+ err));
