if (process.env.NODE_ENV !== "production") {
    await import('dotenv/config');
}
import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    const token = req.cookies['access_token'];

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.userId) {
            req.body.userId = tokenDecode.userId
            next();
        } else {
            return res.json({ success: false, message: 'Not Authorized. Login Again.' });
        }

    } catch (error) {
        // Incase of expired jwt or invalid token kill the token and clear the cookie
        res.clearCookie('access_token', {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });
        res.json({ success: false, message: error.message });
    }
};

export default userAuth;