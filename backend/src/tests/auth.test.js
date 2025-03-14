import request from 'supertest';
import app from '../app.js';

describe('Auth API Tests', () => {
    it('Should register a new user', async () => {
        const res = await request(app).post('/api/auth/register').send({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'test123',
            role: 'customer'
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
    });

    it('Should login an existing user', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'testuser@example.com',
            password: 'test123'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});
