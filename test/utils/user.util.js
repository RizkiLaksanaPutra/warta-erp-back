import { prismaClient } from '../../src/application/database.js';
import bcrypt from 'bcrypt';

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            email: 'test@gmail.com',
            name: 'test',
            password: await bcrypt.hash('rahasia', 10),
            token: 'test'
        }
    })
}

export const removeTestUser = async () => {
    await prismaClient.user.delete({
        where: {
            email: 'test@gmail.com'
        }
    })
}

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            email: 'test@gmail.com'
        }
    })
}