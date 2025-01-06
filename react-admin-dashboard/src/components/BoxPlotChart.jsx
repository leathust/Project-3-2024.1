import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { Grid, Dialog, DialogContent, DialogTitle, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BoxPlotChart = () => {
  const [chartsData, setChartsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState(null);
  const [open, setOpen] = useState(false);

  // Fetch và xử lý dữ liệu từ API
  useEffect(() => {
    const numericalFeatures = ["age", "balance", "duration", "campaign"];

    const fetchChartData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/data");
        const data = await response.json();

        // Xử lý dữ liệu cho mỗi thuộc tính
        const processedData = numericalFeatures.map((feature) => {
          const yesData = data
            .filter((row) => row.deposit === "yes")
            .map((row) => parseFloat(row[feature]))
            .filter((value) => !isNaN(value));

          const noData = data
            .filter((row) => row.deposit === "no")
            .map((row) => parseFloat(row[feature]))
            .filter((value) => !isNaN(value));

          return {
            feature,
            data: [
              {
                y: yesData,
                type: "box",
                name: "Yes",
                marker: { color: "rgba(250, 128, 114, 0.7)" },
              },
              {
                y: noData,
                type: "box",
                name: "No",
                marker: { color: "rgba(72, 61, 139, 0.7)" },
              },
            ],
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

  const handleChartClick = (chart) => {
    setSelectedChart(chart);
    setOpen(true);
  };

  // Hàm tùy chỉnh yaxis
  const getYAxisConfig = (feature) => {
    if (feature === "duration") {
      return {
        title: `${feature} values`,
        tickformat: "~s", // Làm tròn thành 1k, 2k, ...
      };
    }
    return {
      title: `${feature} values`,
    };
  };

  const renderChart = (chart, index) => (
    <div onClick={() => handleChartClick(chart)} style={{ cursor: "pointer" }} key={index}>
      <Plot
        data={chart.data}
        layout={{
          title: `${chart.feature} Distribution`,
          yaxis: getYAxisConfig(chart.feature),
          boxmode: "group",
          margin: { t: 30, l: 40, r: 20, b: 40 },
        }}
        style={{ width: "100%", height: "100%" }}
      />
      <div style={{ textAlign: "center", marginTop: 10 }}>{chart.feature}</div>
    </div>
  );

  const renderModal = () => {
    if (!selectedChart) return null;

    return (
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {selectedChart.feature}
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
          <Plot
            data={selectedChart.data}
            layout={{
              title: `${selectedChart.feature} Distribution`,
              yaxis: getYAxisConfig(selectedChart.feature),
              boxmode: "group",
              margin: { t: 30, l: 40, r: 20, b: 40 },
            }}
            style={{ width: "100%", height: "400px" }}
          />
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Button onClick={() => setOpen(false)} color="primary" variant="contained">
              Close
            </Button>
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

export default BoxPlotChart;
