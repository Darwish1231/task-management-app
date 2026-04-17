const Task = require('../models/Task');
const githubService = require('../services/githubService');
const newsService = require('../services/newsService');

exports.createTask = async (req, res, next) => {
    try {
        const { title, description, status, priority, githubIssuePath } = req.body;

        // Manual Input Validation
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ msg: 'Title is required' });
        }
        if (status && !['todo', 'doing', 'done'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status value' });
        }
        if (priority && !['low', 'medium', 'high'].includes(priority)) {
            return res.status(400).json({ msg: 'Invalid priority value' });
        }

        let finalStatus = status || 'todo';
        let finalPriority = priority || 'medium';
        let finalTitle = title.trim();

        // Deep GitHub Logic Sync
        if (githubIssuePath) {
            const issueData = await githubService.fetchIssueData(githubIssuePath);
            if (issueData) {
                if (issueData.state === 'closed') {
                    finalStatus = 'done';
                }
                if (issueData.labels.some(l => l.includes('bug') || l.includes('urgent') || l.includes('critical') || l.includes('error'))) {
                    finalPriority = 'high';
                }
                if (!title || finalTitle === 'New Task' || finalTitle === '') {
                    finalTitle = issueData.title; // Adopt title if not customized
                }
            }
        }

        // Intelligently generate Related News explicitly for this Task Title Context
        let relatedNews = [];
        if (finalTitle) {
            // Wait for resolution and strict array binding
            relatedNews = await newsService.fetchRelatedNews(finalTitle);
        }

        const newTask = new Task({
            user: req.user.id,
            title: finalTitle,
            description,
            status: finalStatus,
            priority: finalPriority,
            githubIssuePath,
            relatedNews
        });

        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
};

exports.getTasks = async (req, res, next) => {
    try {
        const { status } = req.query;
        const query = { user: req.user.id };
        
        if (status && ['todo', 'doing', 'done'].includes(status)) {
            query.status = status;
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 });

        // Enrich tasks with Github Data concurrently using Promise.all
        const enrichedTasks = await Promise.all(
            tasks.map(async (task) => {
                let githubData = null;
                if (task.githubIssuePath) {
                    githubData = await githubService.fetchIssueData(task.githubIssuePath);
                }
                return {
                    ...task.toObject(),
                    githubData
                };
            })
        );

        res.json(enrichedTasks);
    } catch (err) {
        next(err);
    }
};

exports.getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        let githubData = null;
        if (task.githubIssuePath) {
            githubData = await githubService.fetchIssueData(task.githubIssuePath);
        }

        res.json({
            ...task.toObject(),
            githubData
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        next(err);
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        const { title, description, status, priority, githubIssuePath } = req.body;

        if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
            return res.status(400).json({ msg: 'Title cannot be empty' });
        }
        if (status && !['todo', 'doing', 'done'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status value' });
        }
        if (priority && !['low', 'medium', 'high'].includes(priority)) {
            return res.status(400).json({ msg: 'Invalid priority value' });
        }

        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        let finalStatus = status || task.status;
        let finalPriority = priority || task.priority;
        let finalTitle = title !== undefined ? title.trim() : task.title;
        let finalGithubPath = githubIssuePath !== undefined ? githubIssuePath : task.githubIssuePath;

        // Deep GitHub Logic Sync
        if (finalGithubPath) {
            const issueData = await githubService.fetchIssueData(finalGithubPath);
            if (issueData) {
                if (issueData.state === 'closed') {
                    finalStatus = 'done';
                }
                if (issueData.labels.some(l => l.includes('bug') || l.includes('urgent') || l.includes('critical') || l.includes('error'))) {
                    finalPriority = 'high';
                }
            }
        }

        // Intelligently update contextual news ONLY if the title fundamentally changed organically
        let relatedNewsUpdate = task.relatedNews;
        if (title !== undefined && title.trim() !== task.title) {
            // Title changed! Re-fetch contextual insight metadata
            relatedNewsUpdate = await newsService.fetchRelatedNews(finalTitle);
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: { 
                title: finalTitle, 
                description, 
                status: finalStatus, 
                priority: finalPriority, 
                githubIssuePath: finalGithubPath,
                relatedNews: relatedNewsUpdate
            } },
            { new: true }
        );

        let githubData = null;
        if (task.githubIssuePath) {
             githubData = await githubService.fetchIssueData(task.githubIssuePath);
        }

        res.json({
             ...task.toObject(),
             githubData
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await task.deleteOne();

        res.json({ msg: 'Task removed' });
    } catch (err) {
        next(err);
    }
};
