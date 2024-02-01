const mongoose = require("mongoose");
var express = require("express");
const schedule = require("node-schedule");
require("dotenv").config();
const router = require("../RideEye_backend/routes/user");
const { removingUnverifiedEMails } = require("./controller/signInController");
var app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`Server Running on PORT ${PORT}`);
});

app.use(express.json());

app.use("/api", router);
//Connection
mongoose
  .connect(
    "mongodb+srv://mahobiashubham4:w1lR2f44DxgJmPsV@rideeye.10znvnk.mongodb.net/RideEye"
  )
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Mongo Connection Error " + err));

//Cron Job to remove unverified Emails -
schedule.scheduleJob("0 */12 * * *", () => {
  removingUnverifiedEMails();
});
