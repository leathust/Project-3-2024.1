import User from '../models/userModel.js';
import { createAccessToken, createRefreshToken } from '../services/tokenService.js';
import pkg from 'mongodb';
const { ObjectId } = pkg;

export const userLogin = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

        const accessToken = createAccessToken({ id: user._id });
        const refreshToken = createRefreshToken({ id: user._id });

        res.cookie('refreshtoken', refreshToken, {
            httpOnly: true,
            path: '/api/refresh_token',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: 'Login successful',
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

export const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Email already exists' });

        const newUser = new User({
            name,
            email,
            password,
        });

        await newUser.save();

        res.json({ message: 'Registration successful' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const userLogout = async (req, res) => {
    try {
        res.clearCookie('refreshtoken', { path: '/api/refresh_token' });
        return res.json({ message: 'Logged out' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const userProfile = async (req, res) => {
    try {
        const userId = new ObjectId(req.user.id);
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}