const express = require('express');
const { createProject, getProjects } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProjects) // Both Admins and Members can GET projects
  .post(authorize('Admin'), createProject); // ONLY Admins can POST (create) a project

module.exports = router;