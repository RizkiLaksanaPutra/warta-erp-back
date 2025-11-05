import { validate } from '../validation/validation.js';
import { loginUserValidation } from '../validation/user-validation.js';
import { prismaClient } from '../application/database.js';
import { ResponseError } from '../error/response-error.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            email: loginRequest.email,
        },
    });

    if (!user) {
        throw new ResponseError(401, 'Email or password is wrong');
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

    if (!isPasswordValid) {
        throw new ResponseError(401, 'Email or password is wrong');
    }

    const token = crypto.randomBytes(32).toString('hex');

    return prismaClient.user.update({
        data: {
            token: token,
        },
        where: {
            email: user.email,
        },
        select: {
            token: true,
        },
    });
};

export default {
    login,
};
