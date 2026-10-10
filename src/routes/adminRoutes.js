const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { login } = require('../controllers/authController');
const {
    getMessages,
    deleteMessage,
    getProjects,
    createProject,
    deleteProject
} = require('../controllers/adminController');

// Auth Route
router.post('/auth/login', login);

// Admin Routes (Protected)
router.get('/admin/messages', verifyToken, getMessages);
router.delete('/admin/messages/:id', verifyToken, deleteMessage);

router.get('/admin/projects', verifyToken, getProjects);
router.post('/admin/projects', verifyToken, createProject);
router.delete('/admin/projects/:id', verifyToken, deleteProject);

module.exports = router;
