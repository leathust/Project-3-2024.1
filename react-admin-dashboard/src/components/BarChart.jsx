import { useTheme } from "@mui/material";
// eslint-disable-next-line
import { Grid, Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton } from "@mui/material";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CloseIcon from '@mui/icons-material/Close';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  // eslint-disable-next-line
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedChartData, setSelectedChartData] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/data");
        const rawData = await response.json();

        const categoricalFeatures = Object.keys(rawData[0]).filter(
          (key) => key !== "deposit" && isNaN(parseFloat(rawData[0][key]))
        );

        const groupedData = categoricalFeatures.map((feature) => {
          const featureData = rawData.reduce((acc, row) => {
            const value = row[feature];
            const target = row.deposit;
            if (!acc[value]) {
              acc[value] = { yes: 0, no: 0 };
            }
            acc[value][target] += 1;
            return acc;
          }, {});

          return {
            feature,
            data: Object.keys(featureData).map((key) => ({
              category: key,
              yes: featureData[key].yes,
              no: featureData[key].no,
            })),
          };
        });

        setData(groupedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching or processing data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderBarChart = (featureData, index) => {
    const chartData = {
      labels: featureData.data.map((item) => item.category),
      datasets: [
        {
          label: "Yes",
          data: featureData.data.map((item) => item.yes),
          backgroundColor: "#FA8072", // Salmon color
        },
        {
          label: "No",
          data: featureData.data.map((item) => item.no),
          backgroundColor: "#483D8B", // DarkSlateBlue color
        },
      ],
    };

    const options = {
      indexAxis: "y",
      responsive: true,
      plugins: {
        tooltip: { enabled: true },
      },
      scales: {
        x: { beginAtZero: true },
        y: {
          beginAtZero: true,
          ticks: { padding: 10, maxRotation: 0, minRotation: 0 },
        },
      },
    };

    return (
      <div>
        <Bar
          data={chartData}
          options={options}
          onClick={() => {
            setSelectedChartData(featureData);
            setOpen(true);
          }}
        />
        <div style={{ textAlign: "center", marginTop: 10 }}>{featureData.feature}</div> {/* Feature name */}
      </div>
    );
  };

  const renderModal = () => {
    if (!selectedChartData) return null;

    const chartData = {
      labels: selectedChartData.data.map((item) => item.category),
      datasets: [
        {
          label: "Yes",
          data: selectedChartData.data.map((item) => item.yes),
          backgroundColor: "#FA8072", // Salmon color
        },
        {
          label: "No",
          data: selectedChartData.data.map((item) => item.no),
          backgroundColor: "#483D8B", // DarkSlateBlue color
        },
      ],
    };

    const chartWidth = 800 * zoomLevel;
    const chartHeight = 600 * zoomLevel;

    const options = {
      indexAxis: "y",
      responsive: true,
      plugins: { tooltip: { enabled: true } },
      scales: {
        x: { beginAtZero: true },
        y: { beginAtZero: true },
      },
    };

    return (
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
        {/* DialogTitle with centered text */}
        <DialogTitle
          sx={{
            textAlign: "center", // Center the title
            fontSize: "1.5rem", // Increase font size for the title
            fontWeight: "bold", // Make title bold
            marginBottom: "10px", // Margin below title
            position: "relative", // For positioning Close button
          }}
        >
          {selectedChartData.feature} {/* Feature name above the chart */}
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

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
        {data &&
          data.length > 0 &&
          data.map((featureData, index) => (
            <Grid item xs={4} key={index}>
              {renderBarChart(featureData, index)}
            </Grid>
          ))}
      </Grid>

      {renderModal()}
    </div>
  );
};

export default BarChart;
