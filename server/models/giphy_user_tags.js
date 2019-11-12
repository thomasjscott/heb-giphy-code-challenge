const mongoose = require('mongoose');

// Defines the Giphy Schema that will be written to the database
const giphyUserTagSchema = new mongoose.Schema({
  giphyId: {
    type: String,
    required: [true, 'Giphy ID is required.']
  },
  userId: {
    type: String,
    required: [true, 'User ID is required.']
  },
  tag: {
    type: String,
    maxlength: [200, 'Giphy URLs cannot be more than 200 characters.'],
    required: [true, 'Giphy ID is required.']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// Create the giphy database object
const GiphyUserTags = mongoose.model('giphy_user_tags', giphyUserTagSchema);

// Export the model
module.exports = GiphyUserTags;
