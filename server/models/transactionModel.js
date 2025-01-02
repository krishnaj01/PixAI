import mongoose from "mongoose";
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    plan: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    payment: {
        type: Boolean,
        default: false
    }
});

const transactionModel = mongoose.model('Transaction', transactionSchema);

export default transactionModel;