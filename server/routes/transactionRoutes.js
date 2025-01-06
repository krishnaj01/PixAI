import express from 'express'

import userAuth from '../middlewares/auth.js'
import { paymentRazorpay, verifyRazorpay } from '../controllers/paymentController.js';

const transactionRouter = express.Router();

transactionRouter.post('/payment-razorpay', userAuth, paymentRazorpay);
transactionRouter.post('/verify-razorpay-payment', userAuth, verifyRazorpay);

export default transactionRouter;