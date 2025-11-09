import { prismaClient } from '../../src/application/database.js';
import path from 'path';
import fs from 'fs';

export const createTestManyBranch = async (ownerId) => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.branch.create({
            data: {
                userId: ownerId,
                code: `TEST-${i}`,
                name: `Warteg ${i}`,
                phone: `0896-${i}`,
                street: `Jalan ${i}`,
                city: `Tangsel`,
                province: `Banten`,
                postal_code: `15412`,
                start_hours: `08:00:00`,
                end_hours: `17:00:00`,
                photo: 'test-photo.png',
            },
        });
    }
};

export const deleteTestBranch = async (ownerId) => {
    await prismaClient.branch.deleteMany({
        where: { userId: ownerId, name: { contains: 'test' } },
    });
};

export const createTestImageBuffer = () => {
    return Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        'base64'
    );
};

export const cleanupTestUploads = async (specificFiles = []) => {
    const uploadDirectory = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadDirectory)) return;

    const files = fs.readdirSync(uploadDirectory);

    for (const file of files) {
        if (file.startsWith('test-') || file.includes('test')) {
            const filePath = path.join(uploadDirectory, file);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    }

    if (specificFiles.length > 0) {
        for (const file of specificFiles) {
            const filePath = path.join(uploadDirectory, file);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    }
};
