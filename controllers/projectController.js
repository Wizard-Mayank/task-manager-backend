const Project = require('../models/project');
const User = require('../models/user');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    // req.user.id comes from our `protect` middleware!
    const project = await Project.create({
      title,
      description,
      createdBy: req.user.id,
      members 
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    let projects;

    // If Admin, they see all projects. 
    if (req.user.role === 'Admin') {
      projects = await Project.find().populate('members', 'name email');
    } else {
      // If Member, they only see projects where their ID is in the members array
      projects = await Project.find({ members: req.user.id }).populate('members', 'name email');
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};