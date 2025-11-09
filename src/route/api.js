import express from 'express';
import userController from '../controller/user-controller.js';
import branchController from '../controller/branch-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';

const userRouter = new express.Router();
userRouter.use(authMiddleware);

//User API
userRouter.get('/api/user/current', userController.get);
userRouter.patch('/api/user/current', userController.update);
userRouter.delete('/api/user/logout', userController.logout);

//Branch API
userRouter.post('/api/branches', branchController.create);
userRouter.get('/api/branches', branchController.search);
userRouter.get('/api/branches/:branchId', branchController.get);

export { userRouter };
