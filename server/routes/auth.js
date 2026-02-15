const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

/**
 * TOKEN GENERATOR
 */
const sendToken = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
};

/**
 * @desc    REGISTER NEW USER
 * @route   POST /api/auth/register
 */
router.post('/register', asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ success: false, message: 'This email is already registered' });
    }

    // Create user in DB
    try {
        const user = await User.create({ name, email, password });
        sendToken(user, 201, res);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}));

/**
 * @desc    LOGIN USER
 * @route   POST /api/auth/login
 */
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email.' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    sendToken(user, 200, res);
}));

/**
 * @desc    GET CURRENT USER (Restore Session)
 * @route   GET /api/auth/me
 */
router.get('/me', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
}));

/**
 * @desc    DEBUG: LIST ALL USERS
 */
router.get('/users', asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.status(200).json({ success: true, count: users.length, users });
}));

module.exports = router;
