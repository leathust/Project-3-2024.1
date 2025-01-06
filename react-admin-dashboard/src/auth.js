import axios from 'axios';

// Hàm kiểm tra accessToken hết hạn
const isAccessTokenExpired = (token) => {
  if (!token) return true;

  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const currentTime = Date.now() / 1000;

  return decodedToken.exp < currentTime;
};

// Hàm gọi API refresh token và lưu accessToken mới
const refreshAccessToken = async () => {
  try {
    const baseURL = "http://localhost:3000";
    const response = await axios.post(`${baseURL}/api/user/refresh-token`, null, {
      withCredentials: true, // Đảm bảo gửi cookie
    });
    
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    console.error('Refresh token failed', error);
    throw new Error('Could not refresh access token');
  }
};

// Hàm gửi request với token làm mới nếu cần
export const axiosRequestWithTokenRefresh = async (url, options = {}) => {
  let accessToken = localStorage.getItem('accessToken');

  // Kiểm tra xem accessToken đã hết hạn chưa
  if (isAccessTokenExpired(accessToken)) {
    accessToken = await refreshAccessToken(); // Lấy accessToken mới
  }

  // Cấu hình headers với accessToken
  const config = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return axios(url, config); // Gửi request
};
