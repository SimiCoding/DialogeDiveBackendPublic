// Requirements
const generateToken = require("../helpers/functions/generateToken");
const isEmailValid = require("../helpers/functions/validateEmail");
const { sendMail } = require("../helpers/services/mailer");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");

// Register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  // Validate Body

  if (!name || !email | !password) return res.badRequest();
  // Validate Email
  if (!isEmailValid(email)) return res.badRequest();

  // Check if User exists

  const userExists = await User.findOne({ email });

  if (userExists) return res.badRequest({ message: "User exists" });

  // Configure OTP

  const key = crypto.randomInt(100000, 999999);

  // Create user
  const user = await User.create({ name, email, password, pic, otp: key });

  // Configure Email Options
  const options = {
    from: "SimiChat <sender@gmail.com>",
    to: user.email,
    subject: "Verification required",
    text: `Hey ${user.name}! \n We have received a registration attempt using this email. If it was not you you can ignore this email. \n\n Your code for verifying:\n ${user.otp} \n\n Thanks for using our service!\n Sincerly, \n SimiChat`,
  };

  if (user) {
    // Send Mail
    sendMail(options);

    res.success({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      },
    });
  } else {
    res.failure();
  }
});

// Login

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate Inputs
  if (!email || !password) return res.badRequest();

  // Find user with email

  const user = await User.findOne({ email });

  if (!user) return res.badRequest({ message: "User not found" });

  if (await user.matchPassword(password)) {
    res.success({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      },
    });
  } else res.unAuthorized({ message: "Invalid Email or Password" });
});

// Verify user using otp
const verify = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (!otp) return res.badRequest();

  const user = await User.findOne({ email: req.user.email });

  if (!user) return res.badRequest({ message: "User not found" });

  if (user.otp === otp) {
    user.isVerified = true;
    await user.save();
  } else {
    return res.unAuthorized();
  }

  res.success({
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    },
  });
});

// Export
module.exports = { register, login, verify };
