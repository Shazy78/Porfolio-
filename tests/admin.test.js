const request = require('supertest');
const app = require('../server');
const db = require('../src/config/db');
const jwt = require('jsonwebtoken');

// Ensure test DB schema is initialized
const setupTestDB = require('./setupTestDB');

let token;
let projectId;
let messageId;

beforeAll(async () => {
    // Setup test DB
    await setupTestDB();

    // Create a mock token for admin
    token = jwt.sign(
        { id: 1, role: 'admin' },
        process.env.JWT_SECRET || 'secretkey',
        { expiresIn: '1h' }
    );
});

afterAll(async () => {
    await db.query('DELETE FROM contacts');
    await db.query('DELETE FROM projects');
    await db.query('DELETE FROM admins');
});

describe('Admin API Endpoints', () => {

    describe('Projects', () => {
        it('should create a new project (protected)', async () => {
            const res = await request(app)
                .post('/api/admin/projects')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Project',
                    description: 'A project for testing',
                    image_url: 'http://example.com/image.png',
                    live_link: 'http://example.com',
                    github_link: 'http://github.com/test',
                    technologies: ['Node', 'React']
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.title).toEqual('Test Project');
            projectId = res.body.id;
        });

        it('should get all projects', async () => {
            const res = await request(app)
                .get('/api/admin/projects')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should delete a project (protected)', async () => {
            const res = await request(app)
                .delete(`/api/admin/projects/${projectId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Project deleted');
        });

        it('should deny access if no token provided', async () => {
            const res = await request(app).post('/api/admin/projects').send({});
            expect(res.statusCode).toEqual(401);
        });
    });

    describe('Messages', () => {
        beforeAll(async () => {
            // Insert a test message
            const result = await db.query(
                'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING id',
                ['Test User', 'test@user.com', 'Test message']
            );
            messageId = result.rows[0].id;
        });

        it('should get all messages (protected)', async () => {
            const res = await request(app)
                .get('/api/admin/messages')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should delete a message (protected)', async () => {
            const res = await request(app)
                .delete(`/api/admin/messages/${messageId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Message deleted');
        });
    });
});
