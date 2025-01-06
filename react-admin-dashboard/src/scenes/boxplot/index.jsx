import { Box } from "@mui/material";
import Header from "../../components/Header";
import BoxPlotChart from "../../components/BoxPlotChart";

const BoxPlot = () => {
  return (
    <Box m="20px">
      <Header title="Box Plot" subtitle="Box Plot với 4 thuộc tính giá trị số" />
      <Box height="75vh">
        <BoxPlotChart />
      </Box>
    </Box>
  );
};

export default BoxPlot;