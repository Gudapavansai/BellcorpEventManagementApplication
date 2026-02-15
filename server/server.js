const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env file');
        }

        // Set mongoose options to handle buffering
        mongoose.set('bufferCommands', false); // Disable buffering so we get immediate errors if not connected

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Database Connection Error: ${err.message}`);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1); // In production, we need the DB
        }
        console.warn('Running in development mode without active DB connection. API requests will fail until DB is connected.');
    }
};

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    app.use(morgan('dev'));
}

// Database connectivity middleware
app.use((req, res, next) => {
    if (req.path === '/' || req.path.startsWith('/api-docs')) {
        return next();
    }

    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: 'Database connection is not established. Please check your MONGO_URI and IP whitelisting in MongoDB Atlas.'
        });
    }
    next();
});

// Route files
const auth = require('./routes/auth');
const events = require('./routes/events');
const errorHandler = require('./middleware/error');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/events', events);

// Root Route - Health Check & Info
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'BellCrop Event Management API is running',
        version: '1.0.1',
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        endpoints: {
            auth: '/api/auth',
            events: '/api/events'
        },
        timestamp: new Date().toISOString()
    });
});

// Error handler (must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    const server = app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Handle port errors
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use.`);
            process.exit(1);
        }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
        console.log(`Unhandled Rejection: ${err.message}`);
        server.close(() => process.exit(1));
    });
};

startServer();
