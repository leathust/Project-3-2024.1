import { verifyAccessToken } from '../services/tokenService.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required." });
  }

  try {
    const user = verifyAccessToken(token);
    req.user = user; // Gắn thông tin user vào request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired access token." });
  }
};