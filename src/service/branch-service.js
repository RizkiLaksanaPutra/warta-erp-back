import { prismaClient } from '../application/database.js';
import { ResponseError } from '../error/response-error.js';
import { createBranchValidation } from '../validation/branch-validation.js';
import { validate } from '../validation/validation.js';
import path from 'path';
import fs from 'fs';

const create = async (request, file, user) => {
    const createRequest = validate(createBranchValidation, request);

    const checkExistBranch = await prismaClient.branch.count({
        where: {
            code: createRequest.code,
        },
    });

    if (checkExistBranch > 0) {
        throw new ResponseError(400, 'Branch already exist');
    }

    if (file) {
        createRequest.photo = path.basename(file.path);
    }

    createRequest.userId = user.id;

    const result = await prismaClient.branch.create({
        data: createRequest,
        select: {
            id: true,
            code: true,
            name: true,
            phone: true,
            street: true,
            city: true,
            province: true,
            postal_code: true,
            start_hours: true,
            end_hours: true,
            photo: true,
        },
    });

    return result;
};

export default {
    create,
};
