// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');
const validateMiddleware = require('../middleware/validateMiddleware');

router.post('/signup',
    body('username').notEmpty(),
    body('password').isLength({ min: 6 }),
    validateMiddleware,
    authController.register
);

router.post('/login', body('username').notEmpty(),
    body('password').isLength({ min: 6 }),
    validateMiddleware,
    authController.login
);

router.post('/logout', authController.logout);

module.exports = router;
