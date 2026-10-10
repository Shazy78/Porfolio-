const db = require('../config/db');

// Messages
const getMessages = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM contacts WHERE id = $1', [id]);
        res.json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Projects
const getProjects = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createProject = async (req, res) => {
    const { title, description, image_url, live_link, github_link, technologies } = req.body;
    try {
        const query = `
      INSERT INTO projects (title, description, image_url, live_link, github_link, technologies)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
        const result = await db.query(query, [title, description, image_url, live_link, github_link, technologies]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM projects WHERE id = $1', [id]);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getMessages,
    deleteMessage,
    getProjects,
    createProject,
    deleteProject
};
