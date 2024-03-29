const express = require("express");
const {
  fetchAllUsers,
  registerUser,
  getUser,
  test,
  updateUser,
} = require("../controller/userController.js");
const {
  verifyOTP,
  resendOTP,
  signIn,
  sendPasswordOTPMail,
  verifyOTPpasswordReset,
  resetPassword,
} = require("../controller/signInController.js");
const router = express.Router();

router.get("/", test);
router.get("/users", fetchAllUsers);
router.post("/signUp", registerUser);
router.post("/verifyOTP", verifyOTP);
router.post("/resendOTP", resendOTP);
router.post("/login", signIn);
router.post("/forgotpassreq", sendPasswordOTPMail);
router.post("/forgotpassverify", verifyOTPpasswordReset);
router.post("/updatepass", resetPassword);
router.post("/getUser", getUser);
router.put("/updateUser", updateUser);

module.exports = router;
