const User = require('../models/User');

// @desc    Get all users (for assignment dropdowns)
// @route   GET /api/users
// @access  Private
exports.getUsers = async (req, res) => {
    try {
        // .select('-password') ensures we NEVER send hashed passwords to the frontend
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};