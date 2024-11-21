const jwt = require("jsonwebtoken");
const JWT_SECRET = "ashok@123";

function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { setUser, getUser };
