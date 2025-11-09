import { prismaClient } from '../src/application/database.js';
import { web } from '../src/application/web.js';
import { createTestUser, getTestUser, removeTestUser } from './utils/user.util.js';
import { createTestImageBuffer, cleanupTestUploads, deleteTestBranch, createTestManyBranch } from './utils/branch.util.js';
import supertest from 'supertest';

describe('POST /api/branches', function () {
    let owner;

    beforeEach(async () => {
        await createTestUser();
        owner = await getTestUser();
    });

    afterEach(async () => {
        await deleteTestBranch(owner.id);
        await removeTestUser();
        await cleanupTestUploads();
    });

    it('Should can create new branch', async () => {
        const imageBuffer = createTestImageBuffer();

        const result = await supertest(web)
            .post('/api/branches')
            .set('Authorization', 'Bearer test')
            .field('code', 'test')
            .field('name', 'test')
            .field('phone', '102938')
            .field('street', 'jalan pahlawan')
            .field('city', 'tangsel')
            .field('province', 'banten')
            .field('postal_code', '15412')
            .field('start_hours', '08:00:00')
            .field('end_hours', '17:00:00')
            .attach('photo', imageBuffer, 'test-photo.png');

        console.log(result.body);

        expect(result.status).toBe(201);
        expect(result.body.data.code).toBe('test');
        expect(result.body.data.name).toBe('test');
        expect(result.body.data.phone).toBe('102938');
        expect(result.body.data.street).toBe('jalan pahlawan');
        expect(result.body.data.city).toBe('tangsel');
        expect(result.body.data.province).toBe('banten');
        expect(result.body.data.postal_code).toBe('15412');
        expect(result.body.data.start_hours).toBe('08:00:00');
        expect(result.body.data.end_hours).toBe('17:00:00');
        expect(result.body.data.photo).toContain('.png');
    });
});

describe('GET /api/branches', function () {
    let owner;

    beforeEach(async () => {
        await createTestUser();
        owner = await getTestUser();
        await createTestManyBranch(owner.id);
    });

    afterEach(async () => {
        await deleteTestBranch(owner.id);
        await removeTestUser();
    });

    it('should return first page with default size (page=1,size=10)', async () => {
        const res = await supertest(web).get('/api/branches?page=1&size=10').set('Authorization', 'Bearer test');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(10);

        if (res.body.paging) {
            expect(res.body.paging.page).toBe(1);
            expect(res.body.paging.size).toBe(10);
            expect(res.body.paging.total_item).toBe(15);
            expect(res.body.paging.total_page).toBe(2);
            expect(res.body.paging.has_prev).toBe(false);
            expect(res.body.paging.has_next).toBe(true);
        }
    });

    it('should return second page (page=2,size=10) with 5 items left', async () => {
        const res = await supertest(web).get('/api/branches?page=2&size=10').set('Authorization', 'Bearer test');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(5);

        if (res.body.paging) {
            expect(res.body.paging.page).toBe(2);
            expect(res.body.paging.size).toBe(10);
            expect(res.body.paging.total_item).toBe(15);
            expect(res.body.paging.total_page).toBe(2);
            expect(res.body.paging.has_prev).toBe(true);
            expect(res.body.paging.has_next).toBe(false);
        }
    });

    it('should support fuzzy search by name (contains)', async () => {
        const res = await supertest(web)
            .get('/api/branches?name=Warteg 1')
            .set('Authorization', 'Bearer test');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);

        for (const b of res.body.data) {
            expect(b.name).toContain('Warteg 1');
        }
    });

    it('should sort by name asc when order_by=name&order_dir=asc', async () => {
        const res = await supertest(web).get('/api/branches?order_by=name&order_dir=asc&size=15').set('Authorization', 'Bearer test');

        expect(res.status).toBe(200);
        const arr = res.body.data;

        const copy = [...arr].map((x) => x.name);
        const sorted = [...copy].sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
        expect(copy).toEqual(sorted);
    });

    it('should return all items when no filter is provided (still paginated)', async () => {
        const res = await supertest(web).get('/api/branches').set('Authorization', 'Bearer test');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeLessThanOrEqual(10);
    });
});
