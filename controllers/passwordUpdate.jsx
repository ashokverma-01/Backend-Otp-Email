const User = require("../models/user.jsx");
const bcrypt = require("bcrypt"); // For hashing passwords

exports.passwordUpdate = async (req, res) => {
  const { password, confirmPassword, token } = req.body;

  try {
    console.log("Received token:", token);

    // Find user with matching OTP token
    const findUser = await User.findOne({ "otp.token": token });
    if (!findUser) {
      return res.status(400).json({ message: "Invalid OTP or user not found" });
    }

    // Check if OTP is expired
    const otpExpiryTime =
      new Date(findUser.otp.sendTime).getTime() + 5 * 60 * 1000;
    if (new Date().getTime() > otpExpiryTime) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user data
    findUser.password = hashedPassword;
    findUser.otp.token = null;
    findUser.otp.sendTime = null;
    await findUser.save();

    res
      .status(200)
      .json({ message: "Password updated successfully", status: true });
  } catch (error) {
    console.error("Error during password update:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
};
