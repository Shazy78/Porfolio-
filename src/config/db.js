const { Pool } = require('pg');
require('dotenv').config();

const dbName = process.env.NODE_ENV === 'test' 
    ? (process.env.DB_TEST_NAME || 'portfolio_test') 
    : process.env.DB_NAME;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: dbName,
});

pool.on('connect', () => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`Connected to the PostgreSQL database: ${dbName}`);
    }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
