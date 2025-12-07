import { prismaClient } from '../application/database.js';

export const authMiddleware = async (request, response, next) => {
    try {
        const auth = request.get('Authorization') || '';
        const [type, token] = auth.split(' ');

        if (type !== 'Bearer' || !token) {
            return response.status(401).json({
                errors: 'Unauthorized',
            });
        }

        const user = await prismaClient.user.findFirst({
            where: { token },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        if (!user) {
            return response.status(401).json({
                errors: 'Unauthorized',
            });
        }

        request.user = user;
        return next();
    } catch (error) {
        return next(error);
    }
};
