import branchService from '../service/branch-service.js';
import { logger } from '../application/logging.js';
import { ResponseError } from '../error/response-error.js';
import { createImageUpload, cleanupFile } from '../middleware/upload-middleware.js';

const uploadBranchPhoto = createImageUpload('photo');

const create = async (request, response, next) => {
    uploadBranchPhoto(request, response, async function (error) {
        try {
            if (error) {
                throw new ResponseError(400, error.message);
            }

            if (!request.file) {
                throw new ResponseError(400, 'Branch photo is required');
            }

            const result = await branchService.create(request.body, request.file, request.user);

            response.status(201).json({
                data: result,
            });
        } catch (error) {
            cleanupFile(request.file);

            logger.error('Create branch failed', {
                userId: request.user?.id,
                branchName: request.body?.name,
                error: error.message,
            });

            next(error);
        }
    });
};

const search = async (request, response, next) => {
    try {
        const result = await branchService.search(request.user, request.query);

        response.status(200).json({
            data: result.data,
            paging: result.paging,
        });
    } catch (error) {
        logger.error('Search branch failed', {
            userId: request.user?.id,
            error: error.message,
        });
        next(error);
    }
};

const get = async (request, response, next) => {
    try {
        const userId = request.user;
        const branchId = request.params.branchId;

        const result = await branchService.get(userId, branchId);

        response.status(200).json({
            data: result,
        });
    } catch (error) {
        logger.error('Get branch failed', {
            userId: request.user?.id,
            branchId: request.params?.id,
            error: error.message,
        });
        next(error);
    }
};

export default {
    create,
    search,
    get,
};
