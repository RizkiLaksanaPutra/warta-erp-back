import express from 'express';
import userController from '../controller/user-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';

const userRouter = new express.Router();
userRouter.use(authMiddleware);

//User API
userRouter.get('/api/user/current', userController.get);
userRouter.delete('/api/user/logout', userController.logout);

export {userRouter}