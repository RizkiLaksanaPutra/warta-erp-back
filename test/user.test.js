import { web } from '../src/application/web.js';
import { prismaClient } from '../src/application/database.js';
import { logger } from '../src/application/logging.js';
import { setupUserTest, cleanupUserTest } from './utils/user.util.js';
import supertest from 'supertest';
import dotenv from 'dotenv';

dotenv.config();

describe('POST /login', function () {
    beforeEach(async () => {
        await setupUserTest();
    });

    afterEach(async () => {
        await cleanupUserTest();
    });

    it('Should can login with valid credentials', async () => {
        const result = await supertest(web).post('/login').send({
            email: process.env.EMAIL,
            password: process.env.PASSWORD,
        });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.token).toBeDefined();
    });

    it('Should 401 when email is wrong', async () => {
        const result = await supertest(web).post('/login').send({
            email: 'no-user-' + Date.now() + '@example.com',
            password: process.env.PASSWORD,
        });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe('Email or password is wrong');
    });

    it('Should 401 when password is wrong', async () => {
        const result = await supertest(web).post('/login').send({
            email: process.env.EMAIL,
            password: 'wrong-password',
        });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe('Email or password is wrong');
    });

});
