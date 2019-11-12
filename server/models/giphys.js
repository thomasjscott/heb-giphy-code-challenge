const mongoose = require('mongoose');

// Defines the Giphy Schema that will be written to the database
const giphySchema = new mongoose.Schema({
  giphyId: {
    type: String,
    required: [true, 'Giphy ID is required.']
  },
  embedUrl: {
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
const Giphy = mongoose.model('giphys', giphySchema);

// Export the model
module.exports = Giphy;
