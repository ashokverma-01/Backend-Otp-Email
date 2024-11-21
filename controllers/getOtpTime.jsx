const User = require("../models/user.jsx");

exports.getOtpTime = async (req, res) => {
  const { token } = req.body;

  console.log("Incoming Request Body:", req.body); // Debugging log

  try {
    // Validate the presence of token
    if (!token) {
      console.warn("Token not provided in request");
      return res
        .status(400)
        .json({ message: "Token is required", status: false });
    }

    // Find user with the given token in the OTP field
    const user = await User.findOne({ "otp.token": token }).select("otp");
    if (!user) {
      console.warn(`Invalid token: ${token}`);
      return res.status(404).json({ message: "Invalid token", status: false });
    }

    // Respond with OTP send time if the user is found
    return res.status(200).json({
      message: "Success",
      status: true,
      sendTime: user.otp.sendTime,
    });
  } catch (error) {
    console.error("Error occurred in getOtpTime:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
};
