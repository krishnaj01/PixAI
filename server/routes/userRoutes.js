import express from 'express'

import userAuth from '../middlewares/auth.js'
import { registerUser, loginUser, logout, userDetails, verifyEmail, forgotPassword, resetPassword, sendCodeAgain } from '../controllers/userController.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/send-code-again', sendCodeAgain);
userRouter.post('/login', loginUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:token', resetPassword);

userRouter.post('/logout', userAuth, logout);

userRouter.get('/checkAuth', userAuth, (req,res) => {
    res.json({success: true});
})

userRouter.get('/details', userAuth, userDetails);

export default userRouter;