import { prismaClient } from '../../src/application/database.js';
import dotenv from 'dotenv';

dotenv.config();

export async function clearUserToken() {
    await prismaClient.user.update({
        where: {
            email: process.env.EMAIL,
        },
        data: {
            token: null,
        },
    });
}

export async function setupUserTest() {
    await clearUserToken()
}

export async function cleanupUserTest() {
    await clearUserToken()
}