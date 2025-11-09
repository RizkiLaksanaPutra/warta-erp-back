import Joi from 'joi';

const createBranchValidation = Joi.object({
    code: Joi.string().max(20).required(),
    name: Joi.string().max(100).required(),
    phone: Joi.string().max(20).optional(),
    street: Joi.string().max(255).optional(),
    city: Joi.string().max(100).optional(),
    province: Joi.string().max(100).optional(),
    postal_code: Joi.string().max(10).optional(),
    start_hours: Joi.string()
        .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .optional(),
    end_hours: Joi.string()
        .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .optional(),
});

const searchBranchValidation = Joi.object({
    page: Joi.number().integer().min(1).positive().default(1),
    size: Joi.number().integer().min(1).positive().max(100).default(10),
    name: Joi.string().optional(),
    order_by: Joi.string().valid('created_at', 'name', 'code').default('created_at'),
    order_dir: Joi.string().valid('asc', 'desc').default('desc')
})

export { createBranchValidation, searchBranchValidation };
