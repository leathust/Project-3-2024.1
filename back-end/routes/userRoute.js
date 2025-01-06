import Router from 'express';
import * as userController from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/tokenMiddleware.js';

const userRouter = Router();

userRouter.post('/login', userController.userLogin);
userRouter.post('/register', userController.userRegister);
userRouter.post('/logout', userController.userLogout);
userRouter.post('/profile', authenticateToken, userController.userProfile);
userRouter.post('/refresh-token', userController.refreshToken);

export default userRouter;