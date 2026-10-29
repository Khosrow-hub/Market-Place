const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

// Protected routes
router.use(authController.protect);

router.get('/me', userController.getMe);
router.patch('/update-profile', userController.updateProfile);
router.patch('/change-password', userController.changePassword);
router.delete('/delete-account', userController.deleteAccount);

module.exports = router;
