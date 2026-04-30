const express = require('express');
const { createTask, getTasks, updateTaskStatus } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks) // Both Admin and Member can view tasks
  .post(authorize('Admin'), createTask); // Only Admin can create tasks

// Route to update status (Members can hit this if it's their task)
router.put('/:id/status', updateTaskStatus); 

module.exports = router;