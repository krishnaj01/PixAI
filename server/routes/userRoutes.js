import express from 'express'

import userAuth from '../middlewares/auth.js'
import { registerUser, loginUser, logout, userCredits, verifyEmail, forgotPassword, resetPassword, sendCodeAgain } from '../controllers/userController.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/send-code-again', sendCodeAgain);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logout);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:token', resetPassword);

userRouter.get('/credits', userAuth, userCredits);

export default userRouter;