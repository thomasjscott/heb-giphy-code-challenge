const mongoose = require('mongoose');

// Defines the User Giphy Schema that will be written to the database
const userGiphySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Giphy ID is required.']
  },
  giphyId: {
    type: String,
    maxlength: [50, 'Giphy IDs cannot be more than 50 characters.'],
    required: [true, 'Giphy ID is required.']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// Create the UserGiphy database object
const UserGiphy = mongoose.model('user_giphys', userGiphySchema);

// Export the model
module.exports = UserGiphy;
