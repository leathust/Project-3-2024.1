import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Trạng thái hiển thị Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // success, error, warning, info

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateName = (name) => /^[a-zA-ZÀ-ỹ\s]+$/.test(name);

  const handleRegister = async () => {
    let hasErrors = false;
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };

    if (!name) {
      newErrors.name = "Họ Tên không được để trống!";
      hasErrors = true;
    } else if (!validateName(name)) {
      newErrors.name = "Họ Tên không được chứa ký tự đặc biệt hoặc số!";
      hasErrors = true;
    }

    if (!email) {
      newErrors.email = "Email không được để trống!";
      hasErrors = true;
    } else if (!validateEmail(email)) {
      newErrors.email = "Email không đúng định dạng!";
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống!";
      hasErrors = true;
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự!";
      hasErrors = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu không được để trống!";
      hasErrors = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu và xác nhận mật khẩu không khớp!";
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      try {
        // Gọi API đăng ký
        const response = await axios.post("http://localhost:3000/api/user/register", {
          name,
          email,
          password,
        });

        // Kiểm tra phản hồi từ API
        if (response.data.message === "Registration successful") {
          setSnackbarMessage("Đăng ký thành công!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);

        // Xóa dữ liệu sau khi đăng ký thành công
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        // Điều hướng sau 2 giây
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
        // Xử lý lỗi từ API
        setSnackbarMessage(error.response?.data?.message || "Đã xảy ra lỗi!");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } else {
      // Hiển thị Snackbar lỗi
      setSnackbarMessage("Vui lòng kiểm tra lại thông tin!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{ backgroundColor: "#f5f5f5" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="400px"
        p="20px"
        bgcolor="white"
        borderRadius="8px"
        boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" textAlign="center">
          Sign Up
        </Typography>
        <TextField
          label="Họ Tên"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Mật khẩu"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
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
        <TextField
          label="Xác nhận mật khẩu"
          variant="outlined"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRegister}
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
        <Typography
          variant="body2"
          textAlign="center"
          mt={2}
          color="text.secondary"
        >
          Bạn đã có tài khoản?{" "}
          <Button
            variant="text"
            color="primary"
            onClick={() => navigate("/login")}
            sx={{ textTransform: 'none' }} // Ghi đè text-transform mặc định
          >
            Đăng nhập
          </Button>
        </Typography>
        </Box>
      {/* </Box> */}

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterPage;
