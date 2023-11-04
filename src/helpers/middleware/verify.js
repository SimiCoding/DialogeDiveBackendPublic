const asyncHandler = require("express-async-handler");
const User = require("../../models/User");

const verify = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user.isVerified) return res.unAuthorized();
    next();
  } catch (error) {
    res.unAuthorized();
  }
});
module.exports = {verify};