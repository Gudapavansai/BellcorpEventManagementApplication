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
        const mongoURI = process.env.MONGO_URI;
        
        if (!mongoURI) {
            console.error('================================================================');
            console.error('CRITICAL ERROR: MONGO_URI is not defined in environment vars!');
            console.error('If you are on Render: Go to Settings -> Environment and add MONGO_URI');
            console.error('================================================================');
            if (process.env.NODE_ENV === 'production') {
                process.exit(1);
            }
            return;
        }

        // Set mongoose options to handle buffering
        mongoose.set('bufferCommands', false); 

        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ Database Connection Error: ${err.message}`);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
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
    const dbStatus = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting'
    };
    
    res.status(200).json({
        success: true,
        message: 'BellCrop Event Management API is running',
        version: '1.0.2',
        environment: process.env.NODE_ENV || 'development',
        database: dbStatus[mongoose.connection.readyState],
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
        console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Handle port errors
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ Port ${PORT} is already in use.`);
            process.exit(1);
        }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
        console.log(`❌ Unhandled Rejection: ${err.message}`);
        server.close(() => process.exit(1));
    });
};

startServer();
