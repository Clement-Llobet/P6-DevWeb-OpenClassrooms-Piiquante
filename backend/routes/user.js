const express = require('express');
const router = express.Router();

const usersController = require('../controllers/user');

router.post('/signup', usersController.postSignUp);
router.post('/login', usersController.postLogin);

module.exports = router;