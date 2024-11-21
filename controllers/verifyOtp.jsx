const User = require("../models/user.jsx");

exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    // Ensure the OTP is provided
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const user = await User.findOne({ "otp.otp": otp });
    if (!user) {
      return res.status(404).json({ message: "Invalid OTP" });
    }

    // Check if the OTP has expired (e.g., 5 minutes expiration time)
    const otpExpirationTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    const otpSentTime = new Date(user.otp.sendTime).getTime();
    const currentTime = new Date().getTime();

    if (currentTime - otpSentTime > otpExpirationTime) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Reset OTP after successful verification
    user.otp.otp = null;
    await user.save();

    res
      .status(200)
      .json({ message: "OTP verified successfully", status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
