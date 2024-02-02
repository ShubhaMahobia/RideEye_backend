const mongoose = require("mongoose");
var express = require("express");
const schedule = require("node-schedule");
require("dotenv").config();
const router = require("./routes/user");
const { removingUnverifiedEMails } = require("./controller/signInController");
var app = express();
const port = process.env.port || 8080;

app.listen(port, function () {
  console.log(`Server Running on PORT ${port}`);
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
