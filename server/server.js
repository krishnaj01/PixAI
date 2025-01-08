import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import connectDB from './config/mongodb.js'

import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import transactionRouter from './routes/transactionRoutes.js';
import userAuth from './middlewares/auth.js';

const app = express();

const setUpApp = async (PORT) => {
    await connectDB();
    const frontendURL = process.env.FRONTEND_URL;

    app.use(express.json({ limit: '50mb' }));
    app.use(cors({
        credentials: true,
        origin: frontendURL
    }));

    const signedCookieSecret = process.env.SIGNED_COOKIE_SECRET || 'thisismysecret';
    app.use(cookieParser(signedCookieSecret));

    app.use('/api/user', userRouter);
    app.use('/api/image', imageRouter);
    app.use('/api/transaction', transactionRouter);

    // app.get('/api/gettoken', (req, res) => {
    //     const tokenValue = req.cookies['jwt-token'];
    //     res.json({ tokenValue: tokenValue });
    // });

    app.get('/', (req, res) => {
        res.send(`HELLO FROM PIXAI BACKEND!`)
    });
}

async function dotenvLoad() {
    if (process.env.NODE_ENV !== "production") {
        await import('dotenv/config');
    }
    const PORT = process.env.PORT || 3000;

    try {
        await setUpApp(PORT);
        app.listen(PORT, () => {
            console.log(`Serving on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

dotenvLoad();