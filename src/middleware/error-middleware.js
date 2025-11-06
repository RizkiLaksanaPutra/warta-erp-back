import { ResponseError } from '../error/response-error.js';

const errorMiddleware = async (error, request, response, next) => {
    if (!error) {
        next();
        return;
    }

    if (error instanceof ResponseError) {
        response
            .status(error.status)
            .json({
                errors: error.message,
            })
            .end();
    } else {
        response
            .status(500)
            .json({
                errors: 'Internal server error',
            })
            .end();
    }
};

export { errorMiddleware };
