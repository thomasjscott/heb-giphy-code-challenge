const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    users
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.'
  });
};

exports.updateUser = (req, res, next) => {
  //
};
