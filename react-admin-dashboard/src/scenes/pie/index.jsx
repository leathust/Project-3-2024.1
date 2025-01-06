import { Box } from "@mui/material";
import Header from "../../components/Header";
// import PieChart from "../../components/PieChart";
import DonutChart from "../../components/DonutChart";

const Pie = () => {
  return (
    <Box m="20px">
      <Header title="Pie Chart" subtitle="The chart shows a yes-no comparison of the data" />
      <Box height="75vh">
        <DonutChart />
      </Box>
    </Box>
  );
};

export default Pie;
