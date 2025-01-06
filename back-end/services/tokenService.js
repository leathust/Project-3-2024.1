import jwt from 'jsonwebtoken';

export const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};

export const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

// Xác thực Access Token
export const verifyAccessToken = (token) => {
    try {
      return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
};
  
  // Xác thực Refresh Token
export const verifyRefreshToken = (token) => {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
};


