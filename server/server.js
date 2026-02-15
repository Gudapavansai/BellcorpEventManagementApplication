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
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        console.warn('Running in offline mode (mock data will be used if implemented)');
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
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Offline',
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
        console.log(`Error: ${err.message}`);
        server.close(() => process.exit(1));
    });
};

startServer();
