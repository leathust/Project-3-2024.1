import { Box } from "@mui/material";
import Header from "../../components/Header";
import HeatmapChart from "../../components/HeatMapChart";

const HeatMap = () => {
  return (
    <Box m="20px">
      <Header title="Heat Map Chart" subtitle="Biểu đồ thể hiện mối tương quan tuyến tính giữa một vài thuộc tính quan trọng" />
      <Box height="75vh">
        <HeatmapChart />
      </Box>
    </Box>
  );
};

export default HeatMap;
