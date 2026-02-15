const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    organizer: {
        type: String,
        required: [true, 'Please add an organizer'],
    },
    location: {
        type: String,
        required: [true, 'Please add a location'],
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    capacity: {
        type: Number,
        required: [true, 'Please add a capacity'],
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1600',
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Music', 'Workshop', 'Conference', 'Tech', 'Sports', 'Food', 'Other'],
    },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
