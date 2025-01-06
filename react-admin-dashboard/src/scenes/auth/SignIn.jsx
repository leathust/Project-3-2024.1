import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State để theo dõi lỗi của từng trường
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Kiểm tra nếu người dùng đã đăng nhập
  const isAuthenticated = !!localStorage.getItem("accessToken");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Chuyển hướng ngay nếu đã đăng nhập
    }
  }, [isAuthenticated, navigate]);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Basic email validation regex

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset lỗi trước khi kiểm tra lại
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    let valid = true;

    if (!email) {
      setEmailError("Vui lòng nhập email!");
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Email không đúng định dạng!");
      valid = false;
    }

    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu!");
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await axios.post("http://localhost:3000/api/user/login", { email, password });
      const { accessToken, user } = response.data;

      // Lưu token và thông tin người dùng (nếu cần)
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Chuyển hướng sau khi đăng nhập thành công
      navigate("/");
    } catch (err) {
      if (err.response) {
        const { message } = err.response.data;

        if (message === "User not found") {
          setEmailError("Email không tồn tại!");
        } else if (message === "Incorrect password") {
          setPasswordError("Mật khẩu không đúng!");
        } else {
          setGeneralError("Đã xảy ra lỗi. Vui lòng thử lại!");
        }
      } else {
        setGeneralError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau!");
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
        width="400px"
        p="20px"
        bgcolor="white"
        borderRadius="8px"
        boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
      >
        <Avatar
          sx={{
            m: 1,
            bgcolor: theme.palette.secondary.main,
            color: theme.palette.getContrastText(theme.palette.secondary.main),
          }}
        >
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {generalError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {generalError}
            </Typography>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError} // Hiển thị trạng thái lỗi
            helperText={emailError} // Text báo lỗi màu đỏ
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError} // Hiển thị trạng thái lỗi
            helperText={passwordError} // Text báo lỗi màu đỏ
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có tài khoản?{" "}
              <Button
                variant="text"
                onClick={handleRegisterClick}
                sx={{ padding: 0, textTransform: "none" }}
              >
                Đăng ký
              </Button>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
