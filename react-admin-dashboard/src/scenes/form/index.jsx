import React, { useState } from "react";
// import { useContext } from "react";
import "./PredictForm.css";
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import ForestOutlinedIcon from '@mui/icons-material/ForestOutlined';
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined';
import {
  // CircularProgress,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  Card,
  Chip,
  useTheme,

} from "@mui/material";
import { tokens } from "../../theme.js"; // Đường dẫn đến context
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar"; // Dùng thư viện vòng tròn phần trăm
import "react-circular-progressbar/dist/styles.css";

const PredictForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    age: "",
    job: "",
    marital: "",
    education: "",
    default: "",
    balance: "",
    housing: "",
    loan: "",
    contact: "",
    day: "",
    month: "",
    duration: "",
    campaign: "",
    pdays: "",
    previous: "",
    poutcome: "",
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [probability, setProbability] = useState(null);
  const [selectedModel, setSelectedModel] = useState("decision_tree"); // Model mặc định
  const [openDialog, setOpenDialog] = useState(false); // Trạng thái mở popup

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setPrediction(null);
    setProbability(null);
    setOpenDialog(true); // Mở dialog khi bắt đầu dự đoán
  
    // Chuyển đổi các trường có kiểu number thành number
    const formDataWithNumbers = Object.keys(formData).reduce((acc, key) => {
      acc[key] = isNaN(formData[key]) ? formData[key] : Number(formData[key]);
      return acc;
    }, {});
  
    fetch("http://localhost:3000/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: formDataWithNumbers, // Dữ liệu form đã được chuyển đổi
        model: selectedModel, // Model được chọn
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPrediction(data.prediction);
        setProbability(data.probability);
      })
      .catch((error) => {
        console.error("Error fetching prediction:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model); // Cập nhật model được chọn
  };

  const getStrokeColor = (probability) => {
    if (probability < 0.25) {
      return colors.redAccent[500]; // Màu đỏ cho xác suất dưới 25%
    } else if (probability < 0.5) {
      return "#FFEB3B"; // Màu vàng cho xác suất dưới 50%
    } else if (probability < 0.75) {
      return colors.blueAccent[400]; // Màu xanh dương cho xác suất dưới 75%
    } else {
      return theme.palette.secondary.main; // Màu hiện tại cho xác suất từ 75% trở lên
    }
  };
  
  const getCustomerStatus = (probability) => {
    if (probability >= 0.75) {
      return "Khách hàng rất tiềm năng";
    } else if (probability >= 0.5) {
      return "Khách hàng tiềm năng";
    } else if (probability >= 0.25) {
      return "Khách hàng ít tiềm năng";
    } else {
      return "Khách hàng rất ít tiềm năng";
    }
  };  

  const modelCards = [
    {
      model: "decision_tree",
      title: "Decision Tree",
      description: "A simple and interpretable tree-based model.",
    },
    {
      model: "random_forest",
      title: "Random Forest",
      description: "An ensemble of decision trees for robust predictions.",
    },
    {
      model: "lightgbm",
      title: "LightGBM",
      description: "A gradient boosting model optimized for speed and accuracy.",
    },
  ];

  const fields = [
    { name: "age", label: "Age", type: "number" },
    { name: "balance", label: "Balance", type: "number" },
    { name: "day", label: "Last Contact Day", type: "number" },
    { name: "duration", label: "Contact Duration", type: "number" },
    { name: "campaign", label: "Number of Contacts During Campaign", type: "number" },
    { name: "pdays", label: "Days Since Last Campaign Contact", type: "number" },
    { name: "previous", label: "Number of Previous Contacts", type: "number" },
  ];

  const selectFields = [
    { name: "job", label: "Job", options: ["admin.", "blue-collar", "entrepreneur", "housemaid", "management", "retired", "self-employed", "services", "student", "technician", "unemployed", "unknown"] },
    { name: "marital", label: "Marital Status", options: ["single", "married", "divorced"] },
    { name: "education", label: "Education", options: ["primary", "secondary", "tertiary", "unknown"] },
    { name: "default", label: "Has Default?", options: ["yes", "no", "unknown"] },
    { name: "housing", label: "Has Housing Loan?", options: ["yes", "no", "unknown"] },
    { name: "loan", label: "Has Personal Loan?", options: ["yes", "no", "unknown"] },
    { name: "contact", label: "Contact Communication", options: ["cellular", "telephone", "unknown"] },
    { name: "month", label: "Last Contact Month", options: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"] },
    { name: "poutcome", label: "Previous Campaign Outcome", options: ["success", "failure", "other", "unknown"] },
  ];

  return (
    <Box sx={{ width: "80%", margin: "0 auto", textAlign: "left" }}>
      <Typography variant="h4" gutterBottom>
        Predict Deposit Probability
      </Typography>

      <Box
        component="form"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2,
          marginBottom: 3,
        }}
      >
        {[...fields, ...selectFields].map(({ name, label, type, options }) => (
          <TextField
            key={name}
            name={name}
            label={label}
            type={type || "text"}
            select={!!options}
            value={formData[name]}
            onChange={handleInputChange}
            fullWidth
            size="small"
            sx={{
              maxWidth: "200px",
              input: {
                color: theme.palette.text.primary,
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.text.secondary,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.text.secondary,
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.grey[500],
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.secondary.main,
                },
              },
            }}
          >
            {options &&
              options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
          </TextField>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-around", marginBottom: 3 }}>
        {modelCards.map((card, index) => (
          <Card
            key={card.model}
            variant="outlined"
            sx={{
              maxWidth: 200, // Giảm chiều rộng
              padding: "8px", // Giảm padding
              borderColor: selectedModel === card.model ? theme.palette.secondary.main : theme.palette.grey[400],
              borderWidth: selectedModel === card.model ? 2 : 1,
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out, border-color 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.02)", // Hiệu ứng hover
                borderColor: theme.palette.secondary.main, // Đổi màu viền khi hover
              },
            }}
            onClick={() => handleModelSelect(card.model)}
          >
            <Box sx={{ p: 1, position: "relative" }}>
              {/* Nút Selected */}
              <Chip
                label={selectedModel === card.model ? "Selected" : "Select"}
                color={selectedModel === card.model ? "secondary" : "default"}
                size="small"
                sx={{
                  position: "absolute",
                  top: 4,
                  left: 4, // Đặt góc trái
                  fontSize: "0.7rem", // Nhỏ hơn
                  height: "20px",
                }}
              />
              <Typography
                gutterBottom
                variant="h6" // Kích thước chữ nhỏ hơn
                component="div"
                sx={{
                  fontSize: "1rem", // Giảm kích thước chữ
                  mt: 2, // Thêm khoảng cách giữa Chip và title
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Thêm các icon phía trước */}
                {index === 0 && (
                  <ParkOutlinedIcon sx={{ mr: 1, color: theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main }} />
                )}
                {index === 1 && (
                  <ForestOutlinedIcon sx={{ mr: 1, color: theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main }} />
                )}
                {index === 2 && (
                  <DeviceHubOutlinedIcon sx={{ mr: 1, color: theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main }} />
                )}
                {card.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.85rem", // Giảm kích thước chữ mô tả
                }}
              >
                {card.description}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      <Box sx={{ textAlign: "center", marginTop: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            width: "200px",
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.getContrastText(theme.palette.secondary.main),
            "&:hover": {
              backgroundColor: theme.palette.secondary.dark,
            },
          }}
        >
          Predict
        </Button>
        {/* {loading && <CircularProgress sx={{ marginTop: 3 }} />} */}
      </Box>

      {/* Hiển thị kết quả trong popup */}
      <Dialog open={openDialog} maxWidth="lg" onClose={() => setOpenDialog(false)}>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
              <div className="circle-container">
                <svg className="circle" width="160" height="160" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={theme.palette.grey[300]} // Màu nền vòng tròn
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={getStrokeColor(probability)} // Màu vòng tròn thay đổi theo xác suất
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="440" // Tổng chiều dài vòng tròn (2 * Math.PI * r)
                    strokeDashoffset={440 - (probability * 440)} // Vị trí của phần đầy vòng tròn
                    style={{
                      transformOrigin: "center", // Đảm bảo quay từ tâm
                      transform: "rotate(-90deg)", // Quay vòng tròn để bắt đầu từ điểm trên cùng
                      transition: "stroke-dashoffset 1s ease", // Thêm hiệu ứng xoay
                    }}
                  />
                </svg>
                <div className="percentage-text" style={{ color: theme.palette.text.secondary }}>
                  {(probability * 100).toFixed(2)}%
                </div>
              </div>
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
              <div className="circle-container">
                <svg className="circle" width="160" height="160" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={theme.palette.grey[300]} // Màu nền vòng tròn
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={getStrokeColor(probability)} // Màu vòng tròn thay đổi theo xác suất
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="440" // Tổng chiều dài vòng tròn (2 * Math.PI * r)
                    strokeDashoffset={440 - (probability * 440)} // Vị trí của phần đầy vòng tròn
                    style={{
                      transformOrigin: "center", // Đảm bảo quay từ tâm
                      transform: "rotate(-90deg)", // Quay vòng tròn để bắt đầu từ điểm trên cùng
                      transition: "stroke-dashoffset 1s ease", // Thêm hiệu ứng xoay
                    }}
                  />
                </svg>
                <div className="percentage-text">
                  {(probability * 100).toFixed(2)}%
                </div>
              </div>
              <div style={{ textAlign: "center", marginLeft: 15 }}> {/* Đảm bảo marginTop để dòng chữ cách xa vòng tròn */}
                <span style={{ fontWeight: "bold" }}>
                  {getCustomerStatus(probability)}
                </span>
              </div>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} style={{ color: theme.palette.text.secondary }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default PredictForm;
