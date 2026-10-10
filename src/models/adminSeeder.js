const bcrypt = require('bcryptjs');
const db = require('../config/db');

const seedAdmin = async () => {
    const username = 'admin';
    const email = 'admin@example.com';
    const password = 'adminpassword';

    try {
        // Check if admin exists
        const checkQuery = 'SELECT * FROM admins WHERE email = $1';
        const checkResult = await db.query(checkQuery, [email]);

        if (checkResult.rows.length > 0) {
            console.log('Admin account already exists.');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert admin
        const insertQuery = `
      INSERT INTO admins (username, email, password_hash, role)
      VALUES ($1, $2, $3, 'admin')
      RETURNING id, username, email, role;
    `;
        const result = await db.query(insertQuery, [username, email, passwordHash]);

        console.log('Admin account created successfully:', result.rows[0]);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
};

seedAdmin();
