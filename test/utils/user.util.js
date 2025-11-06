import { prismaClient } from '../../src/application/database.js';
import bcrypt from 'bcrypt';

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            id: '1',
            email: 'test@gmail.com',
            name: 'test',
            password: await bcrypt.hash('rahasia', 10),
            token: 'test',
        },
    });
};

export const removeTestUser = async () => {
    await prismaClient.user.delete({
        where: {
            id: '1',
        },
    });
};

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            id: '1',
        },
    });
};
