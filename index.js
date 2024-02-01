const mongoose = require("mongoose");
var express = require("express");
const schedule = require("node-schedule");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const santize = require("express-mongo-sanitize");
require("dotenv").config();
const router = require("../RideEye_backend/routes/user");
const { removingUnverifiedEMails } = require("./controller/signInController");
//CODE DEPLOYMENT TESTING
var app = express();
const PORT = 8080;

app.listen(8000, function () {
  console.log("Server Running on PORT 8080");
});

app.use(express.json({ limit: "100kb" }));

//This will add the additional headers
app.use(helmet());

//This will remove any query function coming from the client
app.use(santize);

//This will limit the system to perform too many request from the same system {Saving from any bot}
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: " Too many request from this IP, Try again after 15 minutes",
});
app.use("/api", limiter);
app.use("/api", router);

//Connection
mongoose
  .connect(process.env.Database_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Mongo Connection Error " + err));

//Cron Job to remove unverified Emails -
schedule.scheduleJob("0 */12 * * *", () => {
  removingUnverifiedEMails();
});
