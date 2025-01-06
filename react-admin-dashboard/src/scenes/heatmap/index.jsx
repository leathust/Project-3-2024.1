import { Box } from "@mui/material";
import Header from "../../components/Header";
import HeatmapChart from "../../components/HeatMapChart";

const HeatMap = () => {
  return (
    <Box m="20px">
      <Header title="Heat Map" subtitle="The graph shows the linear correlation between several features" />
      <Box height="75vh">
        <HeatmapChart />
      </Box>
    </Box>
  );
};

export default HeatMap;
