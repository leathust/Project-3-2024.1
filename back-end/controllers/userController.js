import User from '../models/userModel.js';
import { createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken } from '../services/tokenService.js';
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
            path: '/api/user/refresh-token',
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

export const refreshToken = async (req, res) => {
    try {
      // Lấy refreshToken từ cookie
      const refreshToken = req.cookies.refreshtoken;
  
      // Kiểm tra xem refreshToken có tồn tại không
      if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
      }
  
      // Xác thực refreshToken và lấy thông tin người dùng
      const decoded = verifyRefreshToken(refreshToken); // Kiểm tra tính hợp lệ của refreshToken
  
      // Lấy thông tin người dùng từ cơ sở dữ liệu hoặc cache
      const currentUser = await User.findById(decoded.id); // Dùng ID đã giải mã từ refreshToken
  
      // Kiểm tra xem người dùng có tồn tại không
      if (!currentUser) {
        return res.status(403).json({ message: 'User not found' });
      }
  
      // Tạo accessToken mới
      const accessToken = createAccessToken({ id: currentUser._id });
  
      // Trả về accessToken mới cho client
      return res.json({ accessToken });
      
    } catch (error) {
      console.error(error);
      // Xử lý lỗi khi refresh token không hợp lệ hoặc gặp lỗi bất ngờ
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };