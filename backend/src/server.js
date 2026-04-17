require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Main Route
app.get('/api', (req, res) => {
    res.json({ message: 'Task Management System API is running' });
});

// Centralized Error Handling Middleware
app.use(require('./middleware/errorHandler'));

// Database and Server Initialization
const startServer = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('FATAL: MONGO_URI is missing from your .env file!');
            console.error('Please add MONGO_URI to /backend/.env using your MongoDB Atlas cluster connection string.');
            process.exit(1);
        }

        // Connect Mongoose to Real DB
        await mongoose.connect(mongoUri);
        console.log(`Connected successfully to database cluster!`);

        // Start listening
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();

// Export the Express App for Serverless Platform Compatibility (e.g. Vercel)
module.exports = app;

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.disconnect();
    console.log('\nMongoDB default connection disconnected through app termination.');
    process.exit(0);
});
