const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect routes (Verify JWT)
exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database and attach it to the request object
    // use .select('-password') so we don't accidentally pass the hashed password around
    req.user = await User.findById(decoded.id).select('-password');

    next(); // Move to the next middleware or controller
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// 2. Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // req.user was set by the `protect` middleware above
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};