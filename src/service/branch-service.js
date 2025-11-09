import { prismaClient } from '../application/database.js';
import { ResponseError } from '../error/response-error.js';
import { createBranchValidation, getBranchValidation, searchBranchValidation } from '../validation/branch-validation.js';
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

const search = async (user, request) => {
    const params = validate(searchBranchValidation, request);

    const where = {
        userId: user.id,
        ...(params.name && params.name.trim() !== '' && { name: { contains: params.name } }),
    };

    const skip = (params.page - 1) * params.size;
    const take = params.size;

    const [totalItems, branches] = await Promise.all([
        prismaClient.branch.count({ where }),
        prismaClient.branch.findMany({ where, skip, take, orderBy: { [params.order_by]: params.order_dir } }),
    ]);

    const totalPage = Math.ceil(totalItems / params.size) || 0;

    return {
        data: branches,
        paging: {
            page: params.page,
            size: params.size,
            total_item: totalItems,
            total_page: totalPage,
            has_prev: params.page > 1,
            has_next: params.page < totalPage,
            order_by: params.order_by,
            order_dir: params.order_dir,
        },
    };
};

const get = async (user, request) => {
    request = validate(getBranchValidation, request);

    const result = await prismaClient.branch.findFirst({
        where: {
            userId: user.id,
            id: request.id,
        },
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

    if (!result) {
        throw new ResponseError(404, 'Branch not found');
    }

    return result;
};

export default {
    create,
    search,
    get,
};
