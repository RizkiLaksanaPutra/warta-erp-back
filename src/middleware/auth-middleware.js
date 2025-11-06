import { prismaClient } from '../application/database.js';

export const authMiddleware = async (request, response, next) => {
    try {
        const auth = request.get('Authorization') || '';
        const [type, token] = auth.split(' ');

        if (type !== 'Bearer' || !token) {
            response.status(401).json({
                errors: 'Unauthorized',
            });
        }

        const user = await prismaClient.user.findFirst({
            where: {
                token: token,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        if (!user) {
            response.status(401).json({
                errors: 'Unauthorized',
            });
        }

        request.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
