const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if admin exists
        const query = 'SELECT * FROM admins WHERE email = $1';
        const result = await db.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const admin = result.rows[0];

        // Verify Password
        const validPass = await bcrypt.compare(password, admin.password_hash);
        if (!validPass) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Create Token
        const token = jwt.sign(
            { id: admin.id, role: 'admin' },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Logged in successfully',
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email
            }
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { login };
