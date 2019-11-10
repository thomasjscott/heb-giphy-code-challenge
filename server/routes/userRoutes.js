const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/sign-up', authController.signUp);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

router.route('/').get(authController.protect, userController.getAllUsers);
router
  .route('/my-info')
  .get(authController.protect, userController.getCurrentUser);

router
  .route('/giphy')
  .post(authController.protect, userController.addFavoriteGiphy)
  .delete(authController.protect, userController.deleteFavoriteGiphy);

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .post(authController.protect, userController.updateUser);

module.exports = router;
