const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

// @desc    Get all events with filters
// @desc    Get all events with filters
router.get('/', asyncHandler(async (req, res) => {
    // Check if DB is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
        // Return mock data
        console.warn('DB not connected, returning mock events');
        const mockEvents = [
            {
                _id: 'mock1',
                name: 'Tech Innovation Summit 2024',
                date: new Date(Date.now() + 86400000 * 5),
                location: 'San Francisco, CA',
                category: 'Tech',
                image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop',
                organizer: 'TechWorld Inc.',
                description: 'Join us for the biggest tech conference of the year featuring 50+ speakers and workshops.',
                capacity: 500,
                availableSeats: 120,
                isFull: false
            },
            {
                _id: 'mock2',
                name: 'Summer Music Festival',
                date: new Date(Date.now() + 86400000 * 12),
                location: 'Austin, TX',
                category: 'Music',
                image: 'https://images.unsplash.com/photo-1459749411177-0473ef7144cf?q=80&w=1000&auto=format&fit=crop',
                organizer: 'Live Nation',
                description: 'Experience 3 days of non-stop music from top artists around the globe.',
                capacity: 2000,
                availableSeats: 0,
                isFull: true
            },
            {
                _id: 'mock3',
                name: 'Digital Art Workshop',
                date: new Date(Date.now() + 86400000 * 2),
                location: 'New York, NY',
                category: 'Workshop',
                image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1000&auto=format&fit=crop',
                organizer: 'Creative Arts Center',
                description: 'Learn digital painting techniques from industry professionals.',
                capacity: 50,
                availableSeats: 15,
                isFull: false
            },
            {
                _id: 'mock4',
                name: 'Startup Networking Mixer',
                date: new Date(Date.now() + 86400000 * 8),
                location: 'London, UK',
                category: 'Business',
                image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop',
                organizer: 'Founders Club',
                description: 'Connect with fellow entrepreneurs and investors in a casual setting.',
                capacity: 100,
                availableSeats: 45,
                isFull: false
            }
        ];
        return res.status(200).json({ success: true, count: mockEvents.length, data: mockEvents });
    }

    const { name, category, location, date } = req.query;
    let query = {};

    if (name) {
        query.name = { $regex: name, $options: 'i' };
    }
    if (category) {
        query.category = category;
    }
    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }
    if (date) {
        // Simple day-start match or greater than current date
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        query.date = { $gte: startDate, $lt: endDate };
    }

    const events = await Event.find(query);

    // Dynamic availability check for each event
    const eventsWithAvailability = await Promise.all(events.map(async (event) => {
        const registrationCount = await Registration.countDocuments({ event: event._id });
        return {
            ...event._doc,
            availableSeats: event.capacity - registrationCount,
            isFull: registrationCount >= event.capacity
        };
    }));

    res.status(200).json({ success: true, count: events.length, data: eventsWithAvailability });
}));

// @desc    Get user's registered events
// @route   GET /api/events/user/my-registrations
// @access  Private
router.get('/user/my-registrations', protect, asyncHandler(async (req, res) => {
    const registrations = await Registration.find({ user: req.user.id }).populate('event');
    res.status(200).json({ success: true, data: registrations });
}));

// @desc    Get single event
router.get('/:id', asyncHandler(async (req, res) => {
    // Check if DB is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
        console.warn('DB not connected, returning mock event');
        // Return mock event based on ID if possible, or generic
        const mockEvent = {
            _id: req.params.id,
            name: req.params.id === 'mock2' ? 'Summer Music Festival' : 'Tech Innovation Summit 2024',
            date: new Date(Date.now() + 86400000 * 5),
            location: 'San Francisco, CA',
            category: 'Tech',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
            organizer: 'TechWorld Inc.',
            description: 'This is a mock event description. The database is currently offline, so we are showing placeholder data to demonstrate the UI.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            capacity: 500,
            availableSeats: 120,
            isFull: false,
            isRegistered: false // Mock not registered
        };
        return res.status(200).json({ success: true, data: mockEvent });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const registrationCount = await Registration.countDocuments({ event: event._id });

    // Check if current user is registered
    let isRegistered = false;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const registration = await Registration.findOne({ event: event._id, user: decoded.id });
            if (registration) isRegistered = true;
        } catch (err) {
            // Token invalid or expired, ignore
        }
    }

    res.status(200).json({
        success: true,
        data: {
            ...event._doc,
            availableSeats: event.capacity - registrationCount,
            isFull: registrationCount >= event.capacity,
            isRegistered
        }
    });
}));

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
    const { name, organizer, location, date, description, capacity, image, category } = req.body;

    if (!name || !organizer || !location || !date || !description || !capacity || !category) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const event = await Event.create({
        name,
        organizer,
        location,
        date,
        description,
        capacity,
        image: image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1600',
        category,
        user: req.user.id
    });

    res.status(201).json({ success: true, data: event });
}));

// @desc    Register for an event
router.post('/:id/register', protect, asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({ event: req.params.id, user: req.user.id });
    if (existingRegistration) {
        return res.status(400).json({ success: false, message: 'You are already registered for this event' });
    }

    // Check capacity
    const registrationCount = await Registration.countDocuments({ event: req.params.id });
    if (registrationCount >= event.capacity) {
        return res.status(400).json({ success: false, message: 'Event is at full capacity' });
    }

    // Create registration
    const registration = await Registration.create({
        event: req.params.id,
        user: req.user.id,
    });

    res.status(201).json({ success: true, data: registration });
}));

// @desc    Cancel event registration
// @route   DELETE /api/events/registration/:id
// @access  Private
router.delete('/registration/:id', protect, asyncHandler(async (req, res) => {
    const registration = await Registration.findOne({ event: req.params.id, user: req.user.id });

    if (!registration) {
        return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    await registration.deleteOne();

    res.status(200).json({ success: true, message: 'Registration cancelled' });
}));

// @desc    Get all registrations in the system (Debug/Admin)
// @route   GET /api/events/all-registrations
// @access  Public (for verification)
router.get('/all-registrations', asyncHandler(async (req, res) => {
    const registrations = await Registration.find({}).populate('user', 'name email').populate('event', 'name date');
    res.status(200).json({
        success: true,
        count: registrations.length,
        data: registrations
    });
}));



module.exports = router;
