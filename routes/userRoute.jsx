const express = require("express");
const router = express.Router();
const { register } = require("../controllers/register.jsx");
const { login } = require("../controllers/login.jsx");
const { forgetPassword } = require("../controllers/forgetPassword.jsx");
const { verifyOtp } = require("../controllers/verifyOtp.jsx");
const { getOtpTime } = require("../controllers/getOtpTime.jsx");
const { passwordUpdate } = require("../controllers/passwordUpdate.jsx");

// Route for user registration
router.post("/register", register);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyOtp", verifyOtp);
router.post("/getOtpTime", getOtpTime);
router.post("/passwordUpdate", passwordUpdate);

module.exports = router;
