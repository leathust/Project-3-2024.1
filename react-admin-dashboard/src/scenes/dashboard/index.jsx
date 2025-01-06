import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import ArticleIcon from '@mui/icons-material/Article';
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import React, { useEffect, useState } from "react";
import ElderlyIcon from '@mui/icons-material/Elderly';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DataTable from "../../components/DataTable";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [totalRecords, setTotalRecords] = useState(0);
  const [yesPercentage, setYesPercentage] = useState(0);
  const [noPercentage, setNoPercentage] = useState(0);

  const [mostCommonAge, setMostCommonAge] = useState(null);
  const [countAbove35, setCountAbove35] = useState(0);

  const [marriedPercentage, setMarriedPercentage] = useState(0);

  const [medianBalance, setMedianBalance] = useState(0);
  const [aboveMedianPercentage, setAboveMedianPercentage] = useState(0);
  
  const [jobStats, setJobStats] = useState([]);

  const [educationStats, setEducationStats] = useState({
    primary: 0,
    secondary: 0,
    tertiary: 0,
    unknown: 0
  });

  const [housingStats, setHousingStats] = useState({
    yes: 0,
    no: 0,
    unknown: 0,
  });

  const [loanStats, setLoanStats] = useState({
    yes: 0,
    no: 0,
    unknown: 0,
  });

  useEffect(() => {
    // Fetch data from API
    fetch("http://localhost:3000/api/data")
      .then((response) => response.json())
      .then((data) => {
        // Tổng số bản ghi
        const total = data.length;
        const yesCount = data.filter((record) => record.deposit === "yes").length;
        const noCount = total - yesCount;

        setTotalRecords(total);
        setYesPercentage((yesCount / total) * 100);
        setNoPercentage((noCount / total) * 100);

        const ages = data.map((record) => record.age); // Lấy danh sách tuổi

        // Tìm tuổi xuất hiện nhiều nhất
        const ageCounts = {};
        ages.forEach((age) => {
          ageCounts[age] = (ageCounts[age] || 0) + 1;
        });
        const commonAge = Object.keys(ageCounts).reduce((a, b) =>
          ageCounts[a] > ageCounts[b] ? a : b
        );
        setMostCommonAge(commonAge);

        // Đếm số lượng người từ 35 tuổi trở lên
        const count = ages.filter((age) => age >= 35).length;
        setCountAbove35(count);

        // Đếm số lượng người đã kết hôn
        const marriedCount = data.filter((record) => record.marital === "married").length;

        // Tính phần trăm đã kết hôn
        const percentage = ((marriedCount / data.length) * 100).toFixed(2); // Làm tròn 2 chữ số
        setMarriedPercentage(percentage);

        // Lấy tất cả giá trị 'balance' và sắp xếp
        const balances = data.map((record) => record.balance).sort((a, b) => a - b);

        // Tính trung vị (median)
        const midIndex = Math.floor(balances.length / 2);
        let median = 0;

        if (balances.length % 2 === 0) {
          // Nếu số lượng là chẵn: trung bình của 2 giá trị ở giữa
          median = (balances[midIndex - 1] + balances[midIndex]) / 2;
        } else {
          // Nếu số lượng là lẻ: lấy giá trị ở giữa
          median = balances[midIndex];
        }
        setMedianBalance(median);

        // Tính số phần trăm người có thu nhập trên trung vị
        const aboveMedianCount = data.filter((record) => record.balance > median).length;
        const medianPercentage = ((aboveMedianCount / data.length) * 100).toFixed(2); // Làm tròn 2 chữ số
        setAboveMedianPercentage(medianPercentage);

      // Thống kê các job
      const jobCounts = {};
      const jobYesCounts = {};
      data.forEach((record) => {
        const job = record.job;
        jobCounts[job] = (jobCounts[job] || 0) + 1;
        if (record.deposit === "yes") {
          jobYesCounts[job] = (jobYesCounts[job] || 0) + 1;
        }
      });

      // Cập nhật state với thông tin thống kê job
      setJobStats(Object.keys(jobCounts).map((job) => ({
        job: job,
        total: jobCounts[job],
        yesCount: jobYesCounts[job] || 0,
        yesPercentage: ((jobYesCounts[job] || 0) / jobCounts[job] * 100).toFixed(2), // Tính phần trăm đồng ý
      })));

      // Thống kê số bản ghi theo education
      const educationCounts = {
        primary: 0,
        secondary: 0,
        tertiary: 0,
        unknown: 0
      };

      data.forEach((record) => {
        if (record.education === "primary") educationCounts.primary++;
        if (record.education === "secondary") educationCounts.secondary++;
        if (record.education === "tertiary") educationCounts.tertiary++;
        if (record.education === "unknown") educationCounts.unknown++;
      });

      setEducationStats(educationCounts);

      // Thống kê về Housing
      const housingStats = {
        yes: data.filter((record) => record.housing === "yes").length,
        no: data.filter((record) => record.housing === "no").length,
        unknown: data.filter((record) => record.housing === "unknown").length,
      };
      const housingYesPercentage = ((housingStats.yes / total) * 100).toFixed(2);
      const housingNoPercentage = ((housingStats.no / total) * 100).toFixed(2);
      const housingUnknownPercentage = ((housingStats.unknown / total) * 100).toFixed(2);

      setHousingStats({
        yes: housingYesPercentage,
        no: housingNoPercentage,
        unknown: housingUnknownPercentage,
      });

      // Thống kê về Loan
      const loanStats = {
        yes: data.filter((record) => record.loan === "yes").length,
        no: data.filter((record) => record.loan === "no").length,
        unknown: data.filter((record) => record.loan === "unknown").length,
      };
      const loanYesPercentage = ((loanStats.yes / total) * 100).toFixed(2);
      const loanNoPercentage = ((loanStats.no / total) * 100).toFixed(2);
      const loanUnknownPercentage = ((loanStats.unknown / total) * 100).toFixed(2);

      setLoanStats({
        yes: loanYesPercentage,
        no: loanNoPercentage,
        unknown: loanUnknownPercentage,
      });
    })

      // Xử lý lỗi
      .catch((error) => console.error("Error fetching data:", error));        
  }, []);

    const housingData = {
      labels: ['Yes', 'No', 'Unknown'],
      datasets: [
        {
          data: [housingStats.yes, housingStats.no, housingStats.unknown],
          backgroundColor: [colors.greenAccent[500], colors.blueAccent[500], colors.redAccent[200]], // Customize colors
          borderColor: [colors.greenAccent[500], colors.blueAccent[500], colors.redAccent[200]],
          borderWidth: 1,
        },
      ],
    };
  
    const loanData = {
      labels: ['Yes', 'No', 'Unknown'],
      datasets: [
        {
          data: [loanStats.yes, loanStats.no, loanStats.unknown],
          backgroundColor: [colors.greenAccent[500], colors.blueAccent[500], colors.redAccent[200]], // Customize colors
          borderColor: [colors.greenAccent[500], colors.blueAccent[500], colors.redAccent[200]],
          borderWidth: 1,
        },
      ],
    };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Quick overview your data insights!" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${totalRecords}`}
            subtitle="Records"
            progress={`${yesPercentage/100}`}
            increase={`Yes: ${yesPercentage.toFixed(2)}%`}
            icon={
              <ArticleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${mostCommonAge}`}
            subtitle="Common Age"
            progress={`${countAbove35/totalRecords}`}
            increase={`35: ${(countAbove35/totalRecords*100).toFixed(2)}%`}
            icon={
              <ElderlyIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${marriedPercentage}%`}
            subtitle="Married"
          progress={`${marriedPercentage/100}`}
            // increase="+5%"
            icon={
              <FamilyRestroomIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${medianBalance}$`}
            subtitle="Median Balance"
            progress={`${aboveMedianPercentage/100}`}
            // increase={`Above: ${aboveMedianPercentage}%`}
            icon={
              <AccountBalanceIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box height="100%" width="100%" mt="20px" m="-20px 0 0 0">
            <DataTable />
          </Box>
        </Box>

        <Box
  gridColumn="span 4"
  gridRow="span 2"
  backgroundColor={colors.primary[400]}
  overflow="auto"
>
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    borderBottom={`4px solid ${colors.primary[500]}`}
    colors={colors.grey[100]}
    p="15px"
  >
    <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
      Job Statistics
    </Typography>
  </Box>
  {jobStats.map((jobStat, i) => (
    <Box
      key={`${jobStat.job}-${i}`}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom={`4px solid ${colors.primary[500]}`}
      p="15px"
    >
      <Box>
        <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
          {jobStat.job}
        </Typography>
        <Typography color={colors.grey[100]}>
          Total Records: {jobStat.total}
        </Typography>
      </Box>
      <Box color={colors.grey[100]}>
        Yes Count: {jobStat.yesCount}
      </Box>
      <Box
        backgroundColor={colors.greenAccent[500]}
        p="5px 10px"
        borderRadius="4px"
      >
        {jobStat.yesPercentage}%
      </Box>
    </Box>
  ))}
</Box>


{/* Education Pie Chart */}
<Box
  gridColumn="span 4"
  gridRow="span 2"
  backgroundColor={colors.primary[400]}
  padding="30px"
  display="flex"
  flexDirection="column"
  justifyContent="center"
  alignItems="center"
>
  <Typography
    variant="h5"
    fontWeight="600"
    sx={{ alignSelf: "flex-start", marginBottom: "15px" }} // Căn tiêu đề bên trái
  >
    Education Statistics
  </Typography>
  <Box height="250px" width="250px">
    <Pie
      data={{
        labels: ["Primary", "Secondary", "Tertiary", "Unknown"],
        datasets: [
          {
            data: [
              educationStats.primary,
              educationStats.secondary,
              educationStats.tertiary,
              educationStats.unknown,
            ], // Giá trị từ state
            backgroundColor: [
              colors.greenAccent[500],
              colors.blueAccent[500],
              colors.greenAccent[300],
              colors.blueAccent[300],
            ],
            hoverBackgroundColor: [
              colors.greenAccent[700],
              colors.blueAccent[700],
              colors.greenAccent[500],
              colors.blueAccent[500],
            ],
            borderWidth: 1,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "bottom", // Đặt chú thích bên dưới
          },
        },
      }}
    />
  </Box>
</Box>

{/* Housing Pie Chart */}
<Box
  gridColumn="span 4"
  gridRow="span 2"
  backgroundColor={colors.primary[400]}
  padding="30px"
  display="flex"
  flexDirection="column"
  justifyContent="center"
  alignItems="center"
>
  <Typography
    variant="h5"
    fontWeight="600"
    sx={{ alignSelf: "flex-start", marginBottom: "15px" }} // Căn tiêu đề bên trái
  >
    Housing Statistics %
  </Typography>
  <Box height="250px" width="250px">
    <Pie
      data={housingData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "bottom", // Đặt chú thích bên dưới
          },
        },
      }}
    />
  </Box>
</Box>

{/* Loan Pie Chart */}
<Box
  gridColumn="span 4"
  gridRow="span 2"
  backgroundColor={colors.primary[400]}
  padding="30px"
  display="flex"
  flexDirection="column"
  justifyContent="center"
  alignItems="center"
>
  <Typography
    variant="h5"
    fontWeight="600"
    sx={{ alignSelf: "flex-start", marginBottom: "15px" }} // Căn tiêu đề bên trái
  >
    Loan Statistics %
  </Typography>
  <Box height="250px" width="250px">
    <Pie
      data={loanData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "bottom", // Đặt chú thích bên dưới
          },
        },
      }}
    />
  </Box>
</Box>


      </Box>
    </Box>
  );
};

export default Dashboard;
