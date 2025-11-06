import Joi from 'joi';

const loginUserValidation = Joi.object({
    email: Joi.string().email().max(200).required(),
    password: Joi.string().max(100).required(),
});

const getUserValidation = Joi.string().email().max(200).required()

export { loginUserValidation, getUserValidation };
