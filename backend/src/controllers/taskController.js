const taskService = require('../services/taskService');
const { validationResult } = require('express-validator');

exports.createTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const task = await taskService.createTask(req.user.id, req.body);
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
};

exports.getTasks = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const tasks = await taskService.getTasks(req.user.id, req.query);
        res.json(tasks);
    } catch (err) {
        next(err);
    }
};

exports.getTaskById = async (req, res, next) => {
    try {
        const task = await taskService.getTaskById(req.params.id, req.user.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        if (err.message === 'Not authorized') {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        next(err);
    }
};

exports.updateTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const task = await taskService.updateTask(req.params.id, req.user.id, req.body);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        res.json(task);
    } catch (err) {
        if (err.message === 'Not authorized') {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        next(err);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const result = await taskService.deleteTask(req.params.id, req.user.id);
        if (!result) return res.status(404).json({ msg: 'Task not found' });
        res.json({ msg: 'Task removed' });
    } catch (err) {
        if (err.message === 'Not authorized') {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        next(err);
    }
};
