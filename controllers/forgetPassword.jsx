const User = require("../models/user.jsx");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP was recently sent and if it's still valid
    if (
      user.otp.otp &&
      new Date(user.otp.sendTime).getTime() > new Date().getTime() - 60000 // OTP valid for 1 minute
    ) {
      const errorMessage = `Please wait until ${new Date(
        user.otp.sendTime
      ).toLocaleTimeString()} to request a new OTP.`;
      return res.status(400).json({ message: errorMessage });
    }

    // Generate a new OTP and token
    const otp = Math.floor(100000 + Math.random() * 900000); // Random 6-digit OTP
    const token = crypto.randomBytes(32).toString("hex"); // Unique reset token

    // Store OTP, send time, and token in the user model
    user.otp.otp = otp;
    user.otp.sendTime = new Date().getTime(); // Set current time as sendTime
    user.otp.token = token;

    await user.save();

    // Send OTP to the user's email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ak228308@gmail.com", // Replace with your email
        pass: "rhot yepg xmhi zpbg", // Replace with your email password or app-specific password
      },
    });

    const mailOptions = {
      from: "ak228308@gmail.com",
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. Use this OTP to reset your password. If you did not request this, please ignore this email.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      }
      // Respond with success message and token
      res.status(200).json({
        message: "Please check your email for the OTP",
        status: true,
        token,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
