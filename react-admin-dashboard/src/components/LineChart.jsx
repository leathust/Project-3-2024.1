import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme, Grid, Dialog, DialogContent, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Thay CloseIcon để hiển thị dấu X
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { tokens } from "../theme";

// Đăng ký các thành phần biểu đồ trong Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [chartsData, setChartsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Sử dụng useEffect để fetch dữ liệu và xử lý
  useEffect(() => {
    const numericalFeatures = ["age", "balance", "duration", "campaign"];

    const fetchChartData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/data");
        const data = await response.json();

        // Xử lý dữ liệu để tạo dữ liệu cho biểu đồ
        const processedData = numericalFeatures.map((feature) => {
          const allFeatureValues = data.map((row) => parseFloat(row[feature])).filter((value) => !isNaN(value));
          const minValue = Math.min(...allFeatureValues);
          const maxValue = Math.max(...allFeatureValues);

          const bins = 20;
          const binSize = (maxValue - minValue) / bins;

          const binCountsYes = Array(bins).fill(0);
          const binCountsNo = Array(bins).fill(0);

          const yesData = data.filter((row) => row.deposit === "yes");
          const noData = data.filter((row) => row.deposit === "no");

          const yesFeatureValues = yesData
            .map((row) => parseFloat(row[feature]))
            .filter((value) => !isNaN(value));
          const noFeatureValues = noData
            .map((row) => parseFloat(row[feature]))
            .filter((value) => !isNaN(value));

          yesFeatureValues.forEach((value) => {
            const binIndex = Math.min(Math.floor((value - minValue) / binSize), bins - 1);
            binCountsYes[binIndex]++;
          });

          noFeatureValues.forEach((value) => {
            const binIndex = Math.min(Math.floor((value - minValue) / binSize), bins - 1);
            binCountsNo[binIndex]++;
          });

          const binLabels = Array.from({ length: bins }, (_, i) => {
            const binStart = minValue + i * binSize;
            const binEnd = minValue + (i + 1) * binSize;
            return binStart >= 1000
              ? `${(binStart / 1000).toFixed(1)}k - ${(binEnd / 1000).toFixed(1)}k`
              : `${Math.round(binStart)} - ${Math.round(binEnd)}`;
          });

          return {
            feature,
            labels: binLabels,
            yesData: binCountsYes,
            noData: binCountsNo,
          };
        });

        setChartsData(processedData);
      } catch (error) {
        console.error("Error fetching or processing data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) return <div>Loading...</div>;

  const renderChart = (chart, index) => {
    const chartData = {
      labels: chart.labels,
      datasets: [
        {
          label: `Yes`,
          data: chart.yesData,
          backgroundColor: "rgba(250, 128, 114, 0.7)", // Màu cho Bar
          borderColor: "salmon",
          borderWidth: 1,
          type: "bar", // Biểu đồ cột
        },
        {
          label: `No`,
          data: chart.noData,
          backgroundColor: "rgba(72, 61, 139, 0.7)", // Màu cho Bar
          borderColor: "darkslateblue",
          borderWidth: 1,
          type: "bar", // Biểu đồ cột
        },
        {
          label: `Yes (Line)`,
          data: chart.yesData,
          borderColor: "salmon",
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          type: "line", // Biểu đồ đường
          pointRadius: 2,
          pointHoverRadius: 4,
        },
        {
          label: `No (Line)`,
          data: chart.noData,
          borderColor: "darkslateblue",
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          type: "line", // Biểu đồ đường
          pointRadius: 2,
          pointHoverRadius: 4,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            filter: (legendItem) => {
              // Loại bỏ các legend có label là "Yes (Line)" hoặc "No (Line)"
              return !["Yes (Line)", "No (Line)"].includes(legendItem.text);
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: {
          title: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
        y: {
          title: {
            display: false,
          },
          beginAtZero: true,
        },
      },
    };
  

    return (
      <div onClick={() => handleChartClick(chart)}>
        <div style={{ width: "100%", height: "100%" }}>
          <Bar data={chartData} options={options} />
        </div>
        <div style={{ textAlign: "center", marginTop: 10 }}>{chart.feature}</div>
      </div>
    );
  };

  const handleChartClick = (chart) => {
    setSelectedChart(chart);
    setOpen(true);
  };

  const renderModal = () => {
    if (!selectedChart) return null;

    const chartData = {
      labels: selectedChart.labels,
      datasets: [
        {
          label: `Yes`,
          data: selectedChart.yesData,
          backgroundColor: "rgba(250, 128, 114, 0.7)",
          borderColor: "salmon",
          borderWidth: 1,
          type: "bar",
        },
        {
          label: `No`,
          data: selectedChart.noData,
          backgroundColor: "rgba(72, 61, 139, 0.7)",
          borderColor: "darkslateblue",
          borderWidth: 1,
          type: "bar",
        },
        {
          label: `Yes (Line)`,
          data: selectedChart.yesData,
          borderColor: "salmon",
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          type: "line",
          pointRadius: 2,
          pointHoverRadius: 4,
        },
        {
          label: `No (Line)`,
          data: selectedChart.noData,
          borderColor: "darkslateblue",
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          type: "line",
          pointRadius: 2,
          pointHoverRadius: 4,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            filter: (legendItem) => {
              // Loại bỏ các legend có label là "Yes (Line)" hoặc "No (Line)"
              return !["Yes (Line)", "No (Line)"].includes(legendItem.text);
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: {
          title: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
        y: {
          title: {
            display: false,
          },
          beginAtZero: true,
        },
      },
    };
    

    const chartWidth = 800 * zoomLevel;
    const chartHeight = 600 * zoomLevel;

    return (
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
        <DialogContent>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <IconButton
                onClick={() => setZoomLevel(zoomLevel > 0.5 ? zoomLevel - 0.1 : zoomLevel)}
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOutIcon />
              </IconButton>
              <IconButton
                onClick={() => setZoomLevel(zoomLevel + 0.1)}
                disabled={zoomLevel >= 2}
              >
                <ZoomInIcon />
              </IconButton>
            </div>
            <IconButton onClick={() => setOpen(false)} color="primary">
              <CloseIcon /> {/* Dấu X để đóng modal */}
            </IconButton>
          </div>
          <div style={{ textAlign: "center", marginBottom: 20, fontSize: "1.5rem", fontWeight: "bold" }}>
            {selectedChart.feature}
          </div>
          <div style={{ width: chartWidth, height: chartHeight }}>
            <Bar data={chartData} options={options} />
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div>
      <Grid container spacing={2}>
        {chartsData.map((chart, index) => (
          <Grid item xs={6} key={index}>
            {renderChart(chart, index)}
          </Grid>
        ))}
      </Grid>
      {renderModal()}
    </div>
  );
};

export default LineChart;
