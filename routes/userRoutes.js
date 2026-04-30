const express = require('express');
const { getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// You must be logged in to see the user list
router.get('/', protect, getUsers);

module.exports = router;