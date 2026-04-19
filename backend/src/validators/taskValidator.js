const { body, query } = require('express-validator');

exports.createTaskValidator = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title is too long'),
    body('status')
        .optional()
        .isIn(['todo', 'doing', 'done']).withMessage('Invalid status value'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Invalid priority value'),
    body('githubIssuePath')
        .optional()
        .custom(value => {
            if (value && typeof value !== 'string') throw new Error('Invalid GitHub path');
            return true;
        })
];

exports.updateTaskValidator = [
    body('title')
        .optional()
        .trim()
        .notEmpty().withMessage('Title cannot be empty')
        .isLength({ max: 100 }).withMessage('Title is too long'),
    body('status')
        .optional()
        .isIn(['todo', 'doing', 'done']).withMessage('Invalid status value'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Invalid priority value'),
];

exports.getTasksValidator = [
    query('status')
        .optional()
        .isIn(['todo', 'doing', 'done']).withMessage('Invalid status filter')
];
