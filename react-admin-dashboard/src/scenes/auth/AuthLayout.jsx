import { Box } from "@mui/material";

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",  // Đảm bảo chiều cao của Box là 100% của viewport
        display: "flex",
        alignItems: "center",  // Căn giữa theo chiều dọc
        justifyContent: "center",  // Căn giữa theo chiều ngang
        backgroundColor: "#f5f5f5",  // Màu nền nhẹ cho background
        width: "100%",  // Đảm bảo Box chiếm hết chiều rộng
        margin: 0,  // Loại bỏ lề ngoài nếu có
      }}
    >
      {children}
    </Box>
  );
};

export default AuthLayout;
