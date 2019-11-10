const catchAsync = require('../utils/catchAsync');
const axios = require('axios');
const AppError = require('../utils/appError');

// Set Defaults for URL
const RATING = 'g';
const LANG = 'en';
const LIMIT = 20;
const URL = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&rating=${RATING}&lang=${LANG}&limit=${LIMIT}`;

exports.getGiphys = catchAsync(async (req, res, next) => {
  // Check to ensure a query string is provided
  if (!req.query.q) return next(AppError('Must provide query string', 422));

  const giphyResponse = await axios.get(`${URL}&q=${req.query.q}`);

  if (giphyResponse.status != 200) {
    return next(
      AppError(
        `A error occured when attempting to retrieve giphys for query ${req.query.q}`,
        500
      )
    );
  }
  // Extract the data from the giphy response
  const { data } = giphyResponse.data;

  res.status(200).json({
    status: 'success',
    results: data.length,
    data: [...data]
  });
});
