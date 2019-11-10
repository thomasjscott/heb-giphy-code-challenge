const express = require('express');
const router = express.Router();
const giphyController = require('../controllers/giphyController');
const authController = require('../controllers/authController');

router.route('/').get(authController.protect, giphyController.getGiphys);

module.exports = router;
