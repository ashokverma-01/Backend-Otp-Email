const bcrypt = require("bcrypt");
const User = require("../models/user.jsx");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    // Catch any errors and respond
    console.error("Error in user registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};
