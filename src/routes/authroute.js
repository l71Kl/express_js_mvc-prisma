const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const regisController = require('../controllers/regiscontroller');
const resetpassController = require('../controllers/resetpasscontroller')

router.post('/login', authController.login);
router.post('/regis', regisController.registerUser);
router.post('/reset-password', resetpassController.resetPassword);
router.post('/request-reset-password', resetpassController.requestResetPassword);

module.exports = router;
