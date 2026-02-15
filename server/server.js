const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

// Load env vars
dotenv.config();

/**
 * DATABASE CONNECTION
 */
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            console.error('❌ CRITICAL: MONGO_URI is missing from environment.');
            return;
        }

        mongoose.set('bufferCommands', false);

        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ DB Connection Error: ${err.message}`);
    }
};

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/**
 * DATABASE GUARD MIDDLEWARE
 * Ensuring API won't hang if DB is not connected
 */
app.use((req, res, next) => {
    // Skip check for health route
    if (req.path === '/') return next();

    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: 'Backend is online, but Database is not connected. Please check MONGO_URI on Render.'
        });
    }
    next();
});

// Routes
const auth = require('./routes/auth');
const events = require('./routes/events');
const errorHandler = require('./middleware/error');

app.use('/api/auth', auth);
app.use('/api/events', events);

// Basic Health Check & IP Discovery (Helping user debug)
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        project: 'BellCrop Event Management',
        dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        uptime: process.uptime(),
        env: process.env.NODE_ENV
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const start = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server launched on port ${PORT}`);
    });
};

start();
