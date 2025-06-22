const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const config = require('../config');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        username,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

const authMiddleware = async (req, res, next) => {
  // Simple JWT auth middleware
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Save a recipe
router.post('/save', authMiddleware, async (req, res) => {
  const { recipeId } = req.body;
  if (!recipeId) return res.status(400).json({ msg: 'Recipe ID is required' });
  try {
    const user = await User.findById(req.user.id);
    if (!user.savedRecipes.includes(recipeId)) {
      user.savedRecipes.push(recipeId);
      await user.save();
    }
    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add to watch later
router.post('/watchlater', authMiddleware, async (req, res) => {
  const { recipeId } = req.body;
  if (!recipeId) return res.status(400).json({ msg: 'Recipe ID is required' });
  try {
    const user = await User.findById(req.user.id);
    if (!user.watchLaterRecipes.includes(recipeId)) {
      user.watchLaterRecipes.push(recipeId);
      await user.save();
    }
    res.json({ watchLaterRecipes: user.watchLaterRecipes });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get saved recipes
router.get('/saved', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get watch later recipes
router.get('/watchlater', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ watchLaterRecipes: user.watchLaterRecipes });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 