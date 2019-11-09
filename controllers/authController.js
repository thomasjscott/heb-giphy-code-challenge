const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

/**
 * Utility that creates a JWT token from a userId
 * @param {string} userId - user ID to create a JWT on behalf of
 * @return {string}       - Returns JWT token
 */
const signToken = userId => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

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
  const token = signToken(user.id);

  return res.status(201).json({
    status: 'success',
    token,
    user
  });
});

/**
 * Allows user to login
 * @return {string} - returns a payload that includes JWT token
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('You must provide a username and password.', 400));
  }

  // 2) Check if user exists && if password is correct
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  // 3) If everything OK, send token to client
  const token = signToken(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user
  });
});

/**
 * Validates if user is logged in and authenticated to access a protected route
 */
exports.protect = catchAsync(async (req, res, next) => {
  //  Check if token in header is valid
  let token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer '))
    return next(new AppError('You are not logged in.', 401));

  // Trim the 'bearer' portion of the token
  token = token.split(' ')[1];

  // Validate token and that user exists
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('User no longer exists', 401));
  }

  // Check if user changed password after JWT was issued
  if (currentUser.hasPasswordChanged(decoded.iat)) {
    return next(
      new AppError('Password has changed.  Re-authenticate user.', 401)
    );
  }

  // Attach the user to the request
  req.currentUser = currentUser;

  // User is authenticated, proceed
  return next();
});

/**
 * Checks if currentUser has permission to access restricted route
 * @param {string} roles - string of role(s) that are allowed to access a given resource
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Checks to see if the current user has permission to access the resource
    if (!roles.includes(req.currentUser.role)) {
      return next(
        new AppError('User does not hace access to this resource.', 403)
      );
    }

    return next();
  };
};

/**
 * Provides functionality for user to reset their password
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on provided email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(
        'If that email address exists, instructions sent to email.',
        201
      )
    );
  }

  // Generate token that will provide functionality to reset password
  const resetToken = user.generatePasswordResetToken();

  // Prevent all hooks from running when user is saved
  await user.save({ validateBeforeSave: false });

  // Generate a resetUrl and message
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password?  Submit a new pasword and password confirm to ${resetURL}.`;

  try {
    // Send to email address
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token.',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'If that email address exists, instructions sent to email.'
    });
  } catch (err) {
    // Sending email failed, reset the token and expiration
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later.'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  if (!req.params.token || !req.body.password || !req.body.passwordConfirm) {
    return next(
      new AppError('Token, password, or password confirm missing.', 401)
    );
  }
  // Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Find user based on hashed token and where date is greater than now (not expired)
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // if token has not exired and there is a user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }

  // Update the password and remove the reset tokens
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordRestToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // Send new JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});
