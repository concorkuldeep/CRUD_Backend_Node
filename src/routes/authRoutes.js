const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {protect} = require('../middleware/auth');
const {registerValidator, loginValidator} = require('../utils/validators');
const {validate} = require('../middleware/validation');

router.post('/register', validate(registerValidator),authController.register);
router.post('/login',validate(loginValidator),authController.login)

router.get('/profile',protect,authController.getProfile)

module.exports = router;