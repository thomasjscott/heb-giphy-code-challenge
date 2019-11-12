const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Giphy = require('../models/giphys');
const GiphyUserTags = require('../models/giphyUserTags');

const AppError = require('../utils/appError');

/**
 * Retrieves data about current user (user data, favorit giphys, and tags)
 */
exports.getCurrentUser = catchAsync(async (req, res, next) => {
  // Retrieve tags
  let giphyUserTags = await GiphyUserTags.find({
    userId: req.currentUser.id
  });

  // Reformats tag JSON to be more legible by consuming client
  giphyUserTags = giphyUserTags.map(giphyUserTag => {
    return {
      id: giphyUserTag._id,
      giphyId: giphyUserTag.giphyId,
      tag: giphyUserTag.tag
    };
  });

  return res.status(200).json({
    status: 'success',
    data: {
      id: req.currentUser._id,
      email: req.currentUser.email,
      favoritedGiphys: req.currentUser.giphys,
      giphyTags: giphyUserTags
    }
  });
});

/**
 * Adds record to user giphy table to track users favorites
 */
exports.addFavoriteGiphy = catchAsync(async (req, res, next) => {
  // if Giphy ID or embed URL empty
  if (!req.body.giphyId || !req.body.embedUrl) {
    return next(
      new AppError('Must provide a giphy ID and embed URL to favorite.', 422)
    );
  }

  // Check if record already exists
  let giphy = await Giphy.findOne({
    giphyId: req.body.giphyId
  });

  // if giphy doesn't exist, create in database
  if (!giphy) {
    giphy = await Giphy.create({
      giphyId: req.body.giphyId,
      embedUrl: req.body.embedUrl
    });
  }

  // Populate the giphys to send back to client
  const currentUser = await User.findById(req.currentUser.id).populate(
    'giphys'
  );

  // Get current
  // const currentUser = await User.findById(req.currentUser.id);
  const isFavoritedAlready = currentUser.giphys.some(favoritedGiphy => {
    return favoritedGiphy.giphyId === giphy.giphyId;
  });

  // 3. check if user has already favorited giphy
  // if so, return empty
  // if not, save to object
  if (!isFavoritedAlready) {
    currentUser.giphys.push(giphy.id);

    await currentUser.save({ validateBeforeSave: false });
  }

  return res.status(201).json({
    status: 'success',
    data: giphy
  });
});

/**
 * Removes record from users favorite giphys
 */
exports.removeFavoriteGiphy = catchAsync(async (req, res, next) => {
  if (!req.body.giphyId) {
    return next(
      new AppError('Must provide a giphy ID to remove as favorite.', 422)
    );
  }

  // Finds the giphy to ensure it exists and to get giphy.id
  const giphy = await Giphy.findOne({
    giphyId: req.body.giphyId
  });

  // Finds user entry in table and deletes it
  const user = await User.findById(req.currentUser.id);

  user.giphys = req.currentUser.giphys.filter(favoritedGiphy => {
    return favoritedGiphy.id !== giphy.id;
  });

  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    status: 'success',
    data: giphy
  });
});

/**
 * Adds tag to giphy for user
 */
exports.addGiphyTag = catchAsync(async (req, res, next) => {
  // if Giphy ID or tag empty, can't process
  if (!req.body.giphyId || !req.body.tag) {
    return next(
      new AppError('Must provide a giphy ID and embed URL to favorite.', 422)
    );
  }

  // Get Giphy Record
  let giphy = await Giphy.findOne({
    giphyId: req.body.giphyId
  });

  // if giphy doesn't exist, we can't create a tag
  if (!giphy) {
    return next(new AppError('You have not favorited that giphy.', 422));
  }

  // Check if data already in database so we don't end up with duplicates
  let giphyTag = await GiphyUserTags.findOne({
    giphyId: req.body.giphyId,
    userId: req.currentUser.id,
    tag: req.body.tag
  });

  if (giphyTag) {
    return next(
      new AppError('You have already tagged this giphy with that tag', 422)
    );
  }

  giphyTag = await GiphyUserTags.create({
    giphyId: req.body.giphyId,
    userId: req.currentUser.id,
    tag: req.body.tag
  });

  return res.status(201).json({
    status: 'success',
    data: {
      id: giphyTag._id,
      giphyId: giphyTag.giphyId,
      tag: giphyTag.tag
    }
  });
});

/**
 * Deletes giphy tag from users favorite giphys
 */
exports.deleteGiphyTag = catchAsync(async (req, res, next) => {
  // If no tag or giphyId, it can't be deleted
  if (!req.body.giphyId || !req.body.tag) {
    return next(
      new AppError('Must provide a giphy ID to remove as favorite.', 422)
    );
  }

  // Finds one and removes it if it exists
  const giphyTag = await GiphyUserTags.findOneAndRemove({
    giphyId: req.body.giphyId,
    userId: req.currentUser.id,
    tag: req.body.tag
  });

  return res.status(200).json({
    status: 'success',
    data: giphyTag
  });
});
