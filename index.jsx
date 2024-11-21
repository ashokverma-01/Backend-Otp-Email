const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

require("./db/connection.jsx");
const userRote = require("./routes/userRoute.jsx");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(cors());
app.use(express.json());

//route
app.use("/user", userRote);

//server on port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
