const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const UserGiphy = require('../models/userGiphys');
const AppError = require('../utils/appError');

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

exports.getCurrentUser = (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    data: {
      id: req.currentUser._id,
      email: req.currentUser.email,
      firstName: req.currentUser.firstName,
      lastName: req.currentUser.lastName,
      fullName: req.currentUser.fullName
    }
  });
};

/**
 * Adds record to user giphy table to track users favorites
 */
exports.addFavoriteGiphy = catchAsync(async (req, res, next) => {
  if (!req.body.giphyId) {
    return next(new AppError('Must provide a giphy to favorite.', 422));
  }

  // Check if record already exists
  let userGiphy = await UserGiphy.findOne({
    userId: req.currentUser._id,
    giphyId: req.body.giphyId
  });

  if (userGiphy) return next(AppError('User already favorited giphy.', 409));

  userGiphy = await UserGiphy.create({
    userId: req.currentUser._id,
    giphyId: req.body.giphyId
  });

  return res.status(201).json({
    status: 'success',
    giphy: userGiphy
  });
});

/**
 * Removes record from user giphy table so user no longer favorites
 */
exports.deleteFavoriteGiphy = catchAsync(async (req, res, next) => {
  if (!req.body.giphyId) {
    return next(
      new AppError('Must provide a giphy ID to remove as favorite.', 422)
    );
  }

  // Finds user entry in table and deletes it
  const userGiphy = await UserGiphy.findOneAndDelete({
    userId: req.currentUser._id,
    giphyId: req.body.giphyId
  });

  return res.status(204).json({
    status: 'success'
  });
});
