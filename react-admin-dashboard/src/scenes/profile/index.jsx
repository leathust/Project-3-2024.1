import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Avatar,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const baseURL = "http://localhost:3000";
  const [profile, setProfile] = useState({
    avatar: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    // Gọi API để lấy thông tin người dùng
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
  
        if (accessToken) {
          const res = await axios.post(
            `${baseURL}/api/user/profile`,
            {}, // Nếu không có payload, gửi một object rỗng
            {
              headers: {
                Authorization: `Bearer ${accessToken}`, // Đính kèm accessToken vào header
              },
            }
          );
  
          setProfile({
            avatar: res.data.avatar || "",
            name: res.data.name || "",
            email: res.data.email || "",
            password: "",
            confirmPassword: "",
          });
        } else {
          console.log("accessToken not found in localStorage");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
  
    fetchProfile();
  }, []);
  

  const handleLogout = async () => {
    try {
      // Gửi yêu cầu logout tới server
      await axios.post(`${baseURL}/api/user/logout`);
  
      // Xóa accessToken khỏi localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/login");

    } catch (error) {
      console.error("Logout failed", error);
    }
  };  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSave = async () => {
    const errors = {};
    if (!profile.name.trim()) errors.name = "Name is required";
    if (!profile.email.trim()) errors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(profile.email))
      errors.email = "Invalid email address";
    if (profile.password && profile.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (profile.password !== profile.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setError(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      const res = await axios.put(`${baseURL}/api/user/profile`, {
        name: profile.name,
        email: profile.email,
        password: profile.password,
        avatar: profile.avatar,
      });
      alert(res.data.message || "Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={4} alignItems="center">
        {/* Cột trái: Avatar */}
        <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
          <Avatar
            src={`${baseURL}${profile.avatar}`}
            alt={profile.name}
            sx={{
              width: 150,
              height: 150,
              margin: "0 auto",
              mb: 2,
            }}
          />
          <Button variant="contained"
                  component="label" 
                  sx={{ mt: 2, 
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.getContrastText(theme.palette.secondary.main),
                    "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                    },
                  }}>
            Change Avatar
            <input
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () =>
                    setProfile((prev) => ({ ...prev, avatar: reader.result }));
                  reader.readAsDataURL(file);
                }
              }}
            />
          </Button>
        </Grid>

        {/* Cột phải: Form thông tin */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Edit Profile
          </Typography>
          <Box component="form" noValidate sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Name"
                  fullWidth
                  value={profile.name}
                  onChange={handleInputChange}
                  error={!!error.name}
                  helperText={error.name}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.secondary.main, // Màu giống nút Save Changes
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: theme.palette.text.secondary,
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: theme.palette.text.secondary,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  fullWidth
                  value={profile.email}
                  onChange={handleInputChange}
                  error={!!error.email}
                  helperText={error.email}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.secondary.main, // Màu giống nút Save Changes
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: theme.palette.text.secondary,
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: theme.palette.text.secondary,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={profile.password}
                  onChange={handleInputChange}
                  error={!!error.password}
                  helperText={error.password}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.secondary.main, // Màu giống nút Save Changes
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: theme.palette.text.secondary,
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: theme.palette.text.secondary,
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  value={profile.confirmPassword}
                  onChange={handleInputChange}
                  error={!!error.confirmPassword}
                  helperText={error.confirmPassword}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.secondary.main, // Màu giống nút Save Changes
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: theme.palette.text.secondary,
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: theme.palette.text.secondary,
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowConfirmPassword}>
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, 
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.getContrastText(theme.palette.secondary.main),
                "&:hover": {
                  backgroundColor: theme.palette.secondary.dark,
                },
              }}
              onClick={handleSave}
            >
              Save Changes
            </Button>
            <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{
                    mt: 3,
                    backgroundColor: theme.palette.error.main,  // Màu đỏ
                    color: theme.palette.getContrastText(theme.palette.error.main),  // Màu chữ phù hợp với nền
                    "&:hover": {
                    backgroundColor: theme.palette.error.dark,  // Màu đỏ đậm khi hover
                    },
                }}
                onClick={handleLogout}
                >
                Logout
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
