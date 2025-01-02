if (process.env.NODE_ENV !== "production") {
    await import('dotenv/config');
}
import Razorpay from 'razorpay'
import userModel from '../models/userModel.js';
import transactionModel from '../models/transactionModel.js';

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentRazorpay = async (req, res) => {
    try {
        const { userId, planId } = req.body;

        if (!userId || !planId) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'Incorrect Details' });
        }

        let credits, plan, amount, date;

        switch (planId) {
            case 'Basic':
                plan = 'Basic';
                credits = 100;
                amount = 10;
                break;

            case 'Advanced':
                plan = 'Advanced';
                credits = 500;
                amount = 50;
                break;

            case 'Business':
                plan = 'Business';
                credits = 5000;
                amount = 250;
                break;

            default:
                return res.json({ success: false, message: 'Plan not found' });
        }

        date = Date.now();

        const transactionData = { userId, plan, amount, credits, date };

        const newTransaction = await transactionModel.create(transactionData);

        const options = {
            amount: amount * 100, //as per razorpay instructions
            currency: process.env.CURRENCY,
            receipt: newTransaction._id
        };

        const order = await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                return res.json({ success: false, message: error })
            }

            const addTransactiontoUser = async () => {
                const userforTransaction = await userModel.findById(userId);
                userforTransaction.transactions.push(newTransaction);
                await userforTransaction.save();
            }

            addTransactiontoUser();

            res.json({ success: true, order });
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
            const transactionData = await transactionModel.findById(orderInfo.receipt);
            if (transactionData.payment) {
                return res.json({ success: false, message: 'Payment Failed' })
            }

            const user = await userModel.findById(transactionData.userId);
            const newCreditBalance = user.creditBalance + transactionData.credits;
            const updateCreditsforUser = await userModel.findByIdAndUpdate(user._id, { creditBalance: newCreditBalance });

            const updateTransaction = await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

            res.json({success: true, message: 'Credits Added'});
        } else {
            res.json({success: false, message: 'Payment Failed'});
        }

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { paymentRazorpay, verifyRazorpay };