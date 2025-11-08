import { prismaClient } from '../../src/application/database.js';
import path from 'path';
import fs from 'fs';

export const deleteTestBranch = async () => {
    await prismaClient.branch.deleteMany({
        where: {
            name: 'test'
        }
    })
}

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
