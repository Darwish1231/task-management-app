const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { createTaskValidator, updateTaskValidator, getTasksValidator } = require('../validators/taskValidator');

// Protected Routes
router.use(auth);

router.post('/', createTaskValidator, taskController.createTask);
router.get('/', getTasksValidator, taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', updateTaskValidator, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
