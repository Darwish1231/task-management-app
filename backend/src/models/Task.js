const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['todo', 'doing', 'done'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    githubIssuePath: {
        // Expected format: "owner/repo/issues/number" e.g., "expressjs/express/issues/4996"
        type: String,
        required: false
    },
    relatedNews: [{
        headline: String,
        url: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
