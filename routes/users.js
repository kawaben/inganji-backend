const express = require('express');
const { loginUser } = require('../controllers/users');
const router = express.Router();

// Define the login route
router.post('/login', loginUser);

module.exports = router;
