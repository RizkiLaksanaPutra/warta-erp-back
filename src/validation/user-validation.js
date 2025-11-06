import Joi from 'joi';

const loginUserValidation = Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().max(100).required(),
});

const getUserValidation = Joi.string().email().max(200).required()

const updateUserValidation = Joi.object({
    email: Joi.string().email().max(100).optional(),
    name: Joi.string().max(100).optional(),
    password: Joi.string().max(100).optional()
})

export { loginUserValidation, getUserValidation, updateUserValidation };
