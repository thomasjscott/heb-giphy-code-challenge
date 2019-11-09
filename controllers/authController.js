const jwt = require('jsonwebtoken');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

/**
 * Provides the user the ability to create an account.
 */
exports.signUp = catchAsync(async (req, res, next) => {
  // Allow only data needed to create new user
  const user = await User.create({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  // Encrypt the user ID, sign it with a secret, and set expiration (7 Days)
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  return res.status(201).json({
    status: 'success',
    token,
    user
  });
});
