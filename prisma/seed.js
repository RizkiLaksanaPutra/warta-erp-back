import { prismaClient } from '../src/application/database.js';
import { logger } from '../src/application/logging.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    const password = await bcrypt.hash(process.env.PASSWORD, 10);

    await prismaClient.user.upsert({
        where: {
            email: process.env.EMAIL,
        },
        update: {},
        create: {
            email: process.env.EMAIL,
            name: 'Rizki Laksana Putra',
            password: password,
        },
    });
}

main()
    .then(() => prismaClient.$disconnect())
    .catch(async (error) => {
        logger.error(error);
        await prismaClient.$disconnect();
        process.exit(1);
    });
