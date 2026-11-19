const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing or invalid format. Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'hrms_super_secret_academic_jwt_key_2026_sneha';

    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account associated with this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token. Access denied.',
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${roles.join(', ')}] role(s).`,
      });
    }
    next();
  };
};

// Check if user is admin of the restaurant they are modifying
const verifyRestaurantOwnership = (req, res, next) => {
  if (req.user.role !== 'restaurantAdmin') {
    return res.status(403).json({
      success: false,
      message: 'Action restricted to restaurant administrators.',
    });
  }

  const targetRestaurantId = req.params.restaurantId || req.params.id || req.body.restaurantId;
  
  if (targetRestaurantId && req.user.restaurantId && req.user.restaurantId.toString() !== targetRestaurantId.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: You are not authorized to manage this specific restaurant.',
    });
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  verifyRestaurantOwnership,
};
