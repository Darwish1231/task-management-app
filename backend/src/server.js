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
    res.json({ message: 'TaskHub API is running' });
});

// Centralized Error Handling Middleware
app.use(require('./middleware/errorHandler'));

// Database and Server Initialization
const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
    mongoose.connect(mongoUri).then(() => {
        console.log('Connected successfully to database cluster!');
    }).catch(err => console.error('Database connection error:', err));
}

// Only explicitly bind the port if we are NOT operating in a Serverless environment like Vercel
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export the Express App for Serverless Platform Compatibility
module.exports = app;

// Handle graceful shutdown natively
process.on('SIGINT', async () => {
    await mongoose.disconnect();
    console.log('\nMongoDB connection gracefully disconnected.');
    process.exit(0);
});
