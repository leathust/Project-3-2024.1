import { Box } from "@mui/material";
import { DataGrid} from "@mui/x-data-grid";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { useState, useEffect } from "react";

const DataTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State để lưu dữ liệu
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/data"); // URL API từ backend
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json(); // Chuyển dữ liệu từ JSON sang object

        // Nếu dữ liệu không có trường "id", ta có thể tạo trường này bằng cách sử dụng chỉ số
        const dataWithId = data.map((item, index) => ({
          ...item,
          id: index + 1, // Tạo id tự động từ chỉ số, bắt đầu từ 1
        }));

        setRows(dataWithId); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Dừng trạng thái tải
      }
    };

    fetchData();
  }, []);

  // Định nghĩa các cột
  const columns = [
    // { field: "id", headerName: "ID", flex: 1 },
    { field: "age", headerName: "age", type: "number", width: 50 },
    { field: "job", headerName: "job", width: 80 },
    { field: "marital", headerName: "marital", width: 80 },
    { field: "education", headerName: "education", width: 80 },
    { field: "default", headerName: "default", width: 80 },
    { field: "balance", headerName: "balance", width: 80 },
    { field: "housing", headerName: "housing", width: 80 },
    { field: "loan", headerName: "loan", width: 80 },
    { field: "contact", headerName: "contact", width: 80 },
    { field: "day", headerName: "day", type: "number", width: 80 },
    { field: "month", headerName: "month", width: 80 },
    { field: "duration", headerName: "duration", type: "number", width: 80 },
    { field: "campaign", headerName: "campaign", type: "number", width: 80 },
    { field: "pdays", headerName: "pdays", type: "number", width: 80 },
    { field: "previous", headerName: "previous", type: "number", width: 80 },
    { field: "poutcome", headerName: "poutcome", width: 80 },
    { field: "deposit", headerName: "deposit", width: 80 },
  ];

  return (
    <Box m="20px">
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading} // Hiển thị trạng thái tải
          disableColumnResize={false}
        />
      </Box>
    </Box>
  );
};

export default DataTable;
