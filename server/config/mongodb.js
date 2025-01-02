import mongoose from "mongoose";
import userModel from "../models/userModel.js";

const dbURL = process.env.DB_URL || 'mongodb://127.0.0.1:27017';

const connectDB = async () => {

    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected', () => {
        console.log('Database Connected');
    })

    mongoose.connection.on('error', console.error.bind(console, "connection error:"))

    await mongoose.connect(`${dbURL}/pixai`)
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");
        // (async () => {
        //     try {
        //         await userModel.syncIndexes();
        //         console.log('Indexes created successfully');
        //     } catch (err) {
        //         console.error('Error syncing indexes:', err);
        //     }
        // })();
    })
    .catch((err) => {
        console.log("MONGO CONNECTION ERROR RECEIVED!!!");
        console.log(err);
    })
}


export default connectDB;