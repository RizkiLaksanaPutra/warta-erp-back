import { web } from '../src/application/web.js';
import { prismaClient } from '../src/application/database.js';
import { logger } from '../src/application/logging.js';
import { createTestUser, getTestUser, removeTestUser } from './utils/user.util.js';
import supertest from 'supertest';
import bcrypt from 'bcrypt';

describe('POST /api/user/login', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('Should can login with valid credentials', async () => {
        const result = await supertest(web).post('/api/user/login').send({
            email: 'test@gmail.com',
            password: 'rahasia',
        });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.token).toBeDefined();
    });

    it('Should 401 when email is wrong', async () => {
        const result = await supertest(web)
            .post('/api/user/login')
            .send({
                email: 'no-user-' + Date.now() + '@example.com',
                password: 'rahasia',
            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe('Email or password is wrong');
    });

    it('Should 401 when password is wrong', async () => {
        const result = await supertest(web).post('/api/user/login').send({
            email: 'test@gmail.com',
            password: 'wrong-password',
        });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe('Email or password is wrong');
    });
});

describe('GET /api/user/current', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can get current user', async () => {
        const result = await supertest(web).get('/api/user/current').set('Authorization', 'Bearer test');

        expect(result.status).toBe(200);
        expect(result.body.data.email).toBe('test@gmail.com');
        expect(result.body.data.name).toBe('test');
    });

    it('should reject if credential is invalid', async () => {
        const result = await supertest(web).get('/api/user/current').set('Authorization', 'Bearer salah');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('PATCH /api/user/current', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can update user', async () => {
        const result = await supertest(web).patch('/api/user/current').set('Authorization', 'Bearer test').send({
            email: 'emailbaru@gmail.com',
            name: 'Nama Baru',
            password: 'password-baru',
        });

        expect(result.status).toBe(200);
        expect(result.body.data.email).toBe('emailbaru@gmail.com');
        expect(result.body.data.name).toBe('Nama Baru');

        const user = await getTestUser();

        expect(await bcrypt.compare('password-baru', user.password)).toBe(true);
    });

    it('should reject if credential is invalid', async () => {
        const result = await supertest(web).patch('/api/user/current').set('Authorization', 'Bearer token-salah').send({
            email: 'emailbaru@gmail.com',
            name: 'Nama Baru',
        });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('DELETE /api/user/logout', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('Should can logout', async () => {
        const result = await supertest(web).delete('/api/user/logout').set('Authorization', 'Bearer test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe('OK');

        const user = await getTestUser();

        expect(user.token).toBeNull();
    });
});
