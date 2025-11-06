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
        const result = await userService.get(request.user.email)
    } catch (error) {
        
    }
}

const logout = async (request, response, next) => {
    try {
        await userService.logout(request.user.email)

        response.status(200).json({
            data: 'OK'
        })
    } catch (error) {
        logger.error('Logout failed', {
            email: request.body?.email,
            error: error.message
        })
        next(error)
    }
}

export default {
    login,
    logout
};
