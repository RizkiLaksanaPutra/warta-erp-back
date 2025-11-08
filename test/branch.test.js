import { prismaClient } from '../src/application/database.js';
import { web } from '../src/application/web.js';
import { createTestUser, getTestUser, removeTestUser } from './utils/user.util.js';
import { createTestImageBuffer, cleanupTestUploads, deleteTestBranch } from './utils/branch.util.js';
import supertest from 'supertest';

describe('POST /branches', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await deleteTestBranch();
        await removeTestUser();
        await cleanupTestUploads();
    });

    it('Should can create new branch', async () => {
        const imageBuffer = createTestImageBuffer()

        const result = await supertest(web)
            .post('/branches')
            .set('Authorization', 'Bearer test')
            .field('code', 'test')
            .field('name', 'test')
            .field('phone', '102938')
            .field('street', 'jalan pahlawan')
            .field('city', 'tangsel')
            .field('province', 'banten')
            .field('postal_code', '15412')
            .field('start_hours', '08:00:00')
            .field("end_hours", "17:00:00")
            .attach('photo', imageBuffer, 'test-photo.png');

        console.log(result.body)

        expect(result.status).toBe(201);
        expect(result.body.data.code).toBe('test')
        expect(result.body.data.name).toBe('test')
        expect(result.body.data.phone).toBe('102938')
        expect(result.body.data.street).toBe('jalan pahlawan')
        expect(result.body.data.city).toBe('tangsel')
        expect(result.body.data.province).toBe('banten')
        expect(result.body.data.postal_code).toBe('15412')
        expect(result.body.data.start_hours).toBe('08:00:00')
        expect(result.body.data.end_hours).toBe('17:00:00')
        expect(result.body.data.photo).toContain('.png')
    });
});
