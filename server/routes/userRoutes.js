const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/sign-up', authController.signUp);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

router
  .route('/my-info')
  .get(authController.protect, userController.getCurrentUser);

router
  .route('/giphy')
  .post(authController.protect, userController.addFavoriteGiphy)
  .delete(authController.protect, userController.removeFavoriteGiphy);

router
  .route('/giphy/tags')
  .post(authController.protect, userController.addGiphyTag)
  .delete(authController.protect, userController.deleteGiphyTag);

module.exports = router;
