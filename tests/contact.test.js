const request = require('supertest');
const app = require('../server');
const db = require('../src/config/db');

// Ensure test DB schema is initialized
const setupTestDB = require('./setupTestDB');

beforeAll(async () => {
    // Setup test DB before running integration tests
    await setupTestDB();
});

afterAll(async () => {
    await db.query('DELETE FROM contacts');
    await db.query('DELETE FROM projects');
    // We do not close the db pool here because supertest might be using it, 
    // or we can close it if we export it correctly. We will just leave it open for now, 
    // jest --runInBand will handle it or we can force exit.
});

describe('Contact API Endpoints', () => {
    it('should submit a new contact message', async () => {
        const res = await request(app)
            .post('/api/contact')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                message: 'Hello, this is a test message.'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Message sent successfully');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.name).toEqual('John Doe');
    });

    it('should return 400 if validation fails (missing email)', async () => {
        const res = await request(app)
            .post('/api/contact')
            .send({
                name: 'Jane Doe',
                message: 'Missing email.'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0].msg).toEqual('Invalid email address');
    });
});
