import express from "express";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import csv from "csv-parser";
import cors from "cors";
import axios from "axios"; // Import axios để gọi Flask API
import userRouter from "./routes/userRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors({ origin: 'http://localhost:5000' })); // Đảm bảo CORS cho Flask API
app.use(morgan('dev'));
app.use(express.json());
app.use('/avatar', express.static(join(__dirname, 'avatar')));


// Đọc dữ liệu từ file CSV
app.get('/api/data', async (req, res) => {
  const filePath = join(__dirname, 'uploads', 'bank.csv');
  const results = [];

  try {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        res.json(results);
      });
  } catch (err) {
    res.status(500).json({ message: 'Error reading file', error: err.message });
  }
});

app.use('/api/user', userRouter);

// Route mới: Gọi Flask API
app.post('/api/predict', async (req, res) => {
  try {
    console.log(req.body);
    const pythonApiUrl = 'http://localhost:8080/predict'; // Flask API URL
    const requestData = req.body; // Dữ liệu JSON từ client gửi

    // Gửi request đến Flask API
    const response = await axios.post(pythonApiUrl, requestData);

    // Trả kết quả từ Flask API cho client
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error calling Flask API:', error.message);
    res.status(500).json({ error: 'Error calling Flask API' });
  }
});

export default app;
