if (process.env.NODE_ENV !== "production") {
    await import('dotenv/config');
}

import jwt from 'jsonwebtoken';

export const generateJWTandSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie('jwt-token', token, {
        httpOnly: true, // prevents XSS attacks
        // sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict', // prevents CSRF attacks (as my backend and frontend are on different deployment therefore lax is preferred)
        samSite: 'none',
        secure: process.env.NODE_ENV === 'production', //for HTTPS
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/',
    });

    return token;
}
