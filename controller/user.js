const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  // To Register the User
  try {
    // const formattedEmail=email.toLowerCase();
    const { name, password, email, mobile } = req.body;

    if (!name || !password || !email || !mobile) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isExistingUser = await User.findOne({ email: email }); //Check is there The same Details is repeat
    if (isExistingUser) {
      return res.status(400).json({ message: "User already Exist" });
    }

    hashedPassword = await bcrypt.hash(password, 10); // Simple Password --> Hash Password

    console.log(hashedPassword);

    const userData = new User({
      name,
      email ,
      password: hashedPassword,
      mobile,
    });

    await userData.save();

    res.json({ message: "User Registered Successfully" });
  } catch (error) {
    // res.json({ message: "Something went wrong" });
    next(error); // ( Global Error Handler Middleware Function ) Take from the Function which is created in the Server.js
  }
};

const loginUser = async (req, res) => {
  // FOR LOGIN
  try {
    const { email, password } = req.body; //Required Field to FIll
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid User" });
    }
    const userDetails = await User.findOne({ email: email }); //Check the Particular email is there or not

    if (!userDetails) {
      return res.status(400).json({ message: " User Doesn't exist " }); //if Not
    }

    const isPasswordMatched = await bcrypt.compare(
      // Check the Corresponding Password by [ Hash Password ---> Normal Password ]
      password,
      userDetails.password
    );

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "User Password did not match" });
    }

    const token = jwt.sign(
      { userId: userDetails._id },
      process.env.SECRET_KEY,
      { expiresIn: "60h" }
    );

    res.json({
      message: "User Login Successfully", //If Email and Password Matched......
      token: token,
      name: userDetails.name,
    });
  } catch (error) {
    // res.json({ message: "Something Error Occurred" });   // if Not
    next(error); // ( Global Error Handler Middleware Function ) Take from the Function which is created in the Server.js
  }
};

module.exports = {
  registerUser,
  loginUser,
};
