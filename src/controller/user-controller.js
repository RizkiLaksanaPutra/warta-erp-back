import userService from '../service/user-service.js';
import { logger } from '../application/logging.js';
import { ResponseError } from '../error/response-error.js';

const login = async (request, response, next) => {
    try {
        const result = await userService.login(request.body);

        response.status(200).json({
            data: result,
        });
    } catch (error) {
        logger.error('Login failed', {
            email: request.body?.email,
            error: error.message,
        });
        next(error);
    }
};

const get = async (request, response, next) => {
    try {
        const result = await userService.get(request.user.email);

        response.status(200).json({
            data: result,
        });
    } catch (error) {
        logger.error('Get user failed', {
            email: request.user?.email,
            error: error.message,
        });
        next(error);
    }
};

const update = async (request, response, next) => {
    try {
        const userId = request.user.id;

        const result = await userService.update(userId, request.body);

        response.status(200).json({
            data: result,
        });
    } catch (error) {
        logger.error('Update profile failed', {
            userId: req.user?.id,
            error: e.message,
        });
        next(e);
    }
};

const logout = async (request, response, next) => {
    try {
        await userService.logout(request.user.email);

        response.status(200).json({
            data: 'OK',
        });
    } catch (error) {
        logger.error('Logout failed', {
            email: request.user?.email,
            error: error.message,
        });
        next(error);
    }
};

export default {
    login,
    get,
    update,
    logout,
};
