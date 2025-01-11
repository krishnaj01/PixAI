if (process.env.NODE_ENV !== "production") {
    await import('dotenv/config');
}

import jwt from 'jsonwebtoken';

export const generateJWT = (userId) => {
    const token = jwt.sign({userId} , process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    return token;
}
