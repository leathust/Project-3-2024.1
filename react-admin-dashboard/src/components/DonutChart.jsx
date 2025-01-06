import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = () => {
  const theme = useTheme(); // Lấy theme hiện tại
  const [chartData, setChartData] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0); // Tổng số bản ghi

  useEffect(() => {
    // Fetch data from API
    fetch("http://localhost:3000/api/data")
      .then((response) => response.json())
      .then((data) => {
        const depositCounts = data.reduce(
          (acc, item) => {
            acc[item.deposit] += 1;
            return acc;
          },
          { yes: 0, no: 0 }
        );

        // Tính tổng số bản ghi
        const total = depositCounts.yes + depositCounts.no;

        // Lưu dữ liệu tổng và chartData
        setTotalRecords(total);
        setChartData({
          labels: ["Yes", "No"],
          datasets: [
            {
              data: [depositCounts.yes, depositCounts.no],
              backgroundColor: [
                "#FA8072", // Yes
                "#483D8B", // No
              ],
              borderColor: [
                "#FA8072",
                "#483D8B",
              ],
              borderWidth: 1,
            },
          ],
        });
      });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: theme.palette.mode === "dark" ? "#fff" : "#000", // Màu chữ của legend tùy thuộc chế độ sáng/tối
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff", // Tooltip background màu theo chế độ
        titleColor: theme.palette.mode === "dark" ? "#fff" : "#000",     // Màu tiêu đề Tooltip
        bodyColor: theme.palette.mode === "dark" ? "#fff" : "#000",      // Màu thân Tooltip
      },
    },
    animation: {
      animateRotate: true, // Hiệu ứng xoay vòng
      duration: 1000, // Thời gian hiệu ứng (ms)
    },
    cutout: "50%", // Tạo hiệu ứng Donut
  };

  if (!chartData) return <div>Loading...</div>;

  return (
    <div style={{ width: "40%", margin: "0 auto", textAlign: "center" }}>
      {/* Hiển thị tổng số bản ghi bên trên biểu đồ */}
      <h3 style={{ color: theme.palette.mode === "dark" ? "#fff" : "#000", marginBottom: "20px" }}>
        Total records: {totalRecords}
      </h3>
      <Doughnut
        data={chartData}
        options={options}
        style={{ width: "300px", height: "300px" }} // Kích thước biểu đồ
      />
    </div>
  );
};

export default DonutChart;
