if (process.env.NODE_ENV !== "production") {
    await import('dotenv/config');
}

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import multiavatar from '@multiavatar/multiavatar/esm';

import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail } from "../utils/emails.js";
import { generateJWTandSetCookie } from '../utils/generateJWTandSetCookie.js'

import userModel from "../models/userModel.js";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        const doesUserExist = await userModel.findOne({ email });

        if (doesUserExist) {
            return res.json({ success: false, message: 'User with the given email already exists' });
        }

        // const hashedPassword = await bcrypt.hash(password,12);
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const profilePicture = multiavatar(`${name}`);

        const verificationToken = Math.floor(100000 + (Math.random() * 900000)).toString();

        const userData = {
            name,
            email,
            password: hashedPassword,
            profilePicture,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        }

        const newUser = new userModel(userData);
        const savedUser = await newUser.save();

        await sendVerificationEmail(res, newUser.email, verificationToken);

        res.json({ success: true, userId: savedUser._id });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const sendCodeAgain = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'Invalid Details' });
        }

        const verificationToken = Math.floor(100000 + (Math.random() * 900000)).toString();

        user.verificationToken = verificationToken;
        user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        await sendVerificationEmail(res, user.email, verificationToken);

        res.json({ success: true, message: 'New verification code sent' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { userId, code } = req.body;

        if (!code) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const user = await userModel.findOne({
            userId,
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.json({ success: false, message: 'Invalid or expired verification code' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        const token = generateJWTandSetCookie(res, user._id);

        await sendWelcomeEmail(res, user.name, user.email);

        res.json({
            success: true, message: "Email verified successfully", token, user: {
                userId: user._id,
                name: user.name,
                isVerified: user.isVerified,
                profilePicture: user.profilePicture,
                numberGenerated: user.numberGenerated,
                numberSaved: user.numberSaved,
                numberShared: user.numberShared
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }

};

const loginUser = async (req, res) => {
    try {
        let flag = true;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const foundUser = await userModel.findOne({ email });

        if (!foundUser) {
            flag = false;
        } else {
            const isValid = await bcrypt.compare(password, foundUser.password);

            if (!isValid) {
                flag = false;
            } else if (!foundUser.isVerified) {
                return res.json({ success: false, userId: foundUser._id, message: 'Verify Yourself First' });
            }
        }

        if (!flag) {
            return res.json({ success: false, message: 'Invalid Email or Password' });
        }

        const token = generateJWTandSetCookie(res, foundUser._id);
        foundUser.lastLogin = new Date();
        await foundUser.save();

        res.json({
            success: true, message: 'Login Successful', token, user: {
                userId: foundUser._id,
                name: foundUser.name,
                isVerified: foundUser.isVerified,
                profilePicture: foundUser.profilePicture,
                numberGenerated: foundUser.numberGenerated,
                numberSaved: foundUser.numberSaved,
                numberShared: foundUser.numberShared
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const logout = (req, res) => {
    res.clearCookie('jwt-token').json({ success: true, message: 'Logged out successfully' });
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;

        await user.save();

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await sendPasswordResetEmail(res, user.email, resetURL);

        res.json({ success: true, message: "Password reset link sent to your email" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password|| !token) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ success: false, message: 'Invalid or expired reset token' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;

        await user.save();

        await sendPasswordResetSuccessEmail(res, user.email);

        res.json({ success: true, message: 'Password reset successful' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const userCredits = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        res.json({
            success: true, credits: user.creditBalance, user: {
                userId: user._id,
                name: user.name,
                isVerified: user.isVerified,
                profilePicture: user.profilePicture,
                numberGenerated: user.numberGenerated,
                numberSaved: user.numberSaved,
                numberShared: user.numberShared
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


export { registerUser, verifyEmail, loginUser, userCredits, logout, forgotPassword, resetPassword, sendCodeAgain };