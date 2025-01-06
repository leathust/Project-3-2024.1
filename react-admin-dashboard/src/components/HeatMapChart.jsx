import React, { useState, useEffect } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { sampleCorrelation } from "simple-statistics";
import { tokens } from "../theme";
import { useTheme, Typography, useMediaQuery } from "@mui/material";

const HeatmapChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [heatmapData, setHeatmapData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/data")
      .then((response) => response.json())
      .then((data) => {
        const attributes = [
          "deposit",
          "duration",
          "pdays",
          "previous",
          "balance",
          "age",
          "day",
          "campaign",
        ];

        const numericData = data.map((item) => ({
          deposit: item.deposit === "yes" ? 1 : 0,
          duration: parseFloat(item.duration),
          pdays: parseFloat(item.pdays),
          previous: parseFloat(item.previous),
          balance: parseFloat(item.balance),
          age: parseFloat(item.age),
          day: parseFloat(item.day),
          campaign: parseFloat(item.campaign),
        }));

        const correlationMatrix = attributes.map((attrX) => {
          return attributes.map((attrY) => {
            const valuesX = numericData.map((item) => item[attrX]);
            const valuesY = numericData.map((item) => item[attrY]);
            const correlation = sampleCorrelation(valuesX, valuesY);
            return {
              x: attrX,
              y: attrY,
              value: isNaN(correlation) ? 0 : parseFloat(correlation.toFixed(2)),
            };
          });
        });

        const formattedData = correlationMatrix.map((row) => ({
          id: row[0].x,
          data: row.map((cell) => ({
            x: cell.y,
            y: cell.value,
            value: cell.value !== undefined && !isNaN(cell.value) ? cell.value : 0,
          })),
        }));

        setColumns(attributes);
        setHeatmapData(formattedData);
      });
  }, []);

  if (!heatmapData.length)
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          color: colors.grey[500],
        }}
      >
        <p>Loading heatmap data...</p>
      </div>
    );

  return (
    <div
      style={{
        width: isSmallScreen ? "100%" : "80%",
        height: "500px",
        margin: "0 auto",
      }}
    >
      {/* <Typography
        variant="h4"
        align="center"
        style={{ marginBottom: "20px", color: colors.grey[100] }}
      >
        Correlation Heatmap
      </Typography> */}
      <ResponsiveHeatMap
        data={heatmapData}
        keys={columns}
        indexBy="id"
        margin={{ top: 60, right: 100, bottom: 60, left: 80 }}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendOffset: 36,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendOffset: -40,
        }}
        cellOpacity={0.6}
        cellBorderColor={colors.grey[100]}
        colors={{
          type: "diverging",
          scheme: theme.palette.mode === "dark" ? "spectral" : "red_yellow_blue",
          minValue: -1,
          maxValue: 1,
        }}
        // tooltip={(cell) => (
        //   <div
        //     style={{
        //       background: colors.primary[400],
        //       color: colors.grey[100],
        //       padding: "8px",
        //       borderRadius: "4px",
        //       boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
        //     }}
        //   >
        //     {cell.data && <strong>{cell.data.x}</strong>}:{" "}
        //     {cell.data && cell.data.value !== undefined && cell.data.value !== null && !isNaN(cell.data.value)
        //       ? cell.data.value.toFixed(2)
        //       : "N/A"}
        //   </div>
        // )}
        legends={[
          {
            anchor: "right",
            direction: "column",
            translateX: 50,
            itemWidth: 80,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemsSpacing: 5,
            symbolSize: 20,
            textColor: colors.grey[100],
          },
        ]}
        theme={{
          fontSize: 14,
          axis: {
            ticks: {
              text: {
                fontSize: 16,
                fill: colors.grey[100],
              },
            },
          },
          labels: {
            text: {
              fontSize: 16,
              fill: colors.grey[100],
            },
          },
        }}
      />
    </div>
  );
};

export default HeatmapChart;
