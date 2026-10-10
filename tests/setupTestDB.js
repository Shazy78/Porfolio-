const { Pool, Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const testDbName = process.env.DB_TEST_NAME || 'portfolio_test';

async function setupTestDB() {
    // 1. Connect to default database (e.g. postgres) to create test DB
    const client = new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: 'postgres',
    });

    try {
        await client.connect();
        console.log(`Checking if test database '${testDbName}' exists...`);
        const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${testDbName}'`);
        
        if (res.rowCount === 0) {
            console.log(`Creating test database '${testDbName}'...`);
            await client.query(`CREATE DATABASE ${testDbName}`);
            console.log(`Test database created successfully.`);
        } else {
            console.log(`Test database '${testDbName}' already exists.`);
        }
    } catch (err) {
        console.error('Error during database creation:', err);
    } finally {
        await client.end();
    }

    // 2. Connect to the new test DB and run schema
    const pool = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: testDbName,
    });

    try {
        console.log('Running schema.sql...');
        const schemaPath = path.join(__dirname, '../src/models/schema.sql');
        const schemaQuery = fs.readFileSync(schemaPath, { encoding: 'utf8' });
        await pool.query(schemaQuery);
        console.log('Test database schema setup successfully.');
    } catch (err) {
        console.error('Error running schema.sql:', err);
    } finally {
        await pool.end();
    }
}

if (require.main === module) {
    setupTestDB();
}

module.exports = setupTestDB;
