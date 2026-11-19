const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'hrms_super_secret_academic_jwt_key_2026_sneha';
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      restaurantId: user.restaurantId || null,
    },
    secret,
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new customer or restaurant admin
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'customer', phone = '', restaurantName = '' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: role === 'restaurantAdmin' ? 'restaurantAdmin' : 'customer',
      phone: phone.trim(),
    });

    // If registering as admin with restaurant name, check or link
    if (role === 'restaurantAdmin') {
      if (restaurantName) {
        const newRestaurant = await Restaurant.create({
          name: restaurantName.trim(),
          description: `Welcome to ${restaurantName.trim()}! Managed with Smart HRMS.`,
          cuisine: ['Multi-Cuisine'],
          address: {
            street: '12 GST Road',
            area: 'Ramapuram',
            city: 'Chennai',
            state: 'Tamil Nadu',
            postalCode: '600089',
          },
          ownerId: user._id,
        });
        user.restaurantId = newRestaurant._id;
      }
    }

    await user.save();

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Smart HRMS.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        restaurantId: user.restaurantId,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        restaurantId: user.restaurantId,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/auth/me
// @desc    Get currently logged-in user profile
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};
