const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Admin
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, projectId, assignedTo } = req.body;

    // 1. Verify the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 2. Create the task
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      project: projectId,
      assignedTo
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tasks for the dashboard
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    let tasks;

    // Admin sees all tasks, Member sees only tasks assigned to them
    if (req.user.role === 'Admin') {
      tasks = await Task.find()
        .populate('project', 'title')
        .populate('assignedTo', 'name email')
        .sort({ dueDate: 1 }); // Sort by closest due date first
    } else {
      tasks = await Task.find({ assignedTo: req.user.id })
        .populate('project', 'title')
        .populate('assignedTo', 'name email')
        .sort({ dueDate: 1 });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Security Check: Only the assigned user or an Admin can update the status
    if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Ensure status is valid before updating
    if (!['Todo', 'Doing', 'Done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};