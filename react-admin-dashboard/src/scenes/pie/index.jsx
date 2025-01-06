import { Box } from "@mui/material";
import Header from "../../components/Header";
// import PieChart from "../../components/PieChart";
import DonutChart from "../../components/DonutChart";

const Pie = () => {
  return (
    <Box m="20px">
      <Header title="Pie Chart" subtitle="Biểu đồ thể hiện so sánh yes-no của dữ liệu" />
      <Box height="75vh">
        <DonutChart />
      </Box>
    </Box>
  );
};

export default Pie;
