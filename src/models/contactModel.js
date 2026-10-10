const db = require('../config/db');

const createTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
    try {
        await db.query(query);
        console.log('Messages table ready');
    } catch (err) {
        console.error('Error creating table:', err);
    }
};

const saveMessage = async (name, email, message) => {
    const query = 'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *';
    const values = [name, email, message];
    const result = await db.query(query, values);
    return result.rows[0];
};

module.exports = {
    createTable,
    saveMessage,
};
