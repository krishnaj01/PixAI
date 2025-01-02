if (process.env.NODE_ENV !== "production") {
    await import('dotenv/config');
}
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multiavatar from '@multiavatar/multiavatar/esm';

// normal authentication
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

        const userData = {
            authType: 'normal',
            profilePicture,
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData);
        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

        res.cookie(
            'jwt-token', token, {
            sameSite: 'strict',
            path: '/',
            expire: Date.now() + (1000 * 60 * 60 * 24 * 7), // Date.now() is in milliseconds
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            // secure: true
        }
        );

        res.json({ success: true, token, user: { userId: savedUser._id, name: savedUser.name, profilePicture: savedUser.profilePicture, numberGenerated: savedUser.numberGenerated, numberSaved: savedUser.numberSaved, numberShared: savedUser.numberShared } })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        let flag = true;
        const { email, password } = req.body;
        const foundUser = await userModel.findOne({ email });

        if (!foundUser) {
            flag = false;
        } else {
            const isValid = await bcrypt.compare(password, foundUser.password);
            if (!isValid) {
                flag = false;
            }
        }

        if (!flag) {
            return res.json({ success: false, message: 'Invalid Email or Password' })
        }

        const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET);

        res.cookie(
            'jwt-token', token, {
            sameSite: 'strict',
            path: '/',
            expire: Date.now() + (1000 * 60 * 60 * 24 * 7), // Date.now() is in milliseconds
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            // secure: true
        }
        );

        res.json({ success: true, token, user: { userId: foundUser._id, name: foundUser.name, profilePicture: foundUser.profilePicture, numberGenerated: foundUser.numberGenerated, numberSaved: foundUser.numberSaved, numberShared: foundUser.numberShared } });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const userCredits = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        res.json({ success: true, credits: user.creditBalance, user: { userId: user._id, name: user.name, profilePicture: user.profilePicture, numberGenerated: user.numberGenerated, numberSaved: user.numberSaved, numberShared: user.numberShared } });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { registerUser, loginUser, userCredits };