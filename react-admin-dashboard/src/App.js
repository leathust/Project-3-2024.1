import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Bar from "./scenes/bar";
import Line from "./scenes/line";
import BoxPlot from "./scenes/boxplot";
import HeatMap from "./scenes/heatmap";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import PredictForm from "./scenes/form";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import DataTable from "./scenes/contacts";
import LoginPage from "./scenes/auth/SignIn";
import RegisterPage from "./scenes/auth/SignUp";
import AuthLayout from "./scenes/auth/AuthLayout";
import Profile from "./scenes/profile";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  // Kiểm tra trạng thái đăng nhập, ví dụ từ localStorage
  const isAuthenticated = !!localStorage.getItem("accessToken"); // Giả sử token lưu ở localStorage

  return (
    <div className="app">
      <Routes>
        {/* Routes dành riêng cho trang đăng nhập và đăng ký */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />

        {/* Các Routes chính */}
        <Route
          path="/*"
          element={
            isAuthenticated ? ( // Kiểm tra trạng thái đăng nhập
              <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <Sidebar isSidebar={isSidebar} />
                  <main className="content">
                    <Topbar setIsSidebar={setIsSidebar} />
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/team" element={<Team />} />
                      <Route path="/data" element={<DataTable />} />
                      <Route path="/invoices" element={<Invoices />} />
                      <Route path="/predict/model" element={<PredictForm />} />
                      <Route path="/bar" element={<Bar />} />
                      <Route path="/pie" element={<Pie />} />
                      <Route path="/line" element={<Line />} />
                      <Route path="/boxplot" element={<BoxPlot />} />
                      <Route path="/heatmap" element={<HeatMap />} />
                      <Route path="/model/lightgbm" element={<FAQ />} />
                      <Route
                        path="/model/random-forest"
                        element={<Calendar />}
                      />
                      <Route path="/geography" element={<Geography />} />
                    </Routes>
                  </main>
                </ThemeProvider>
              </ColorModeContext.Provider>
            ) : (
              <Navigate to="/login" /> // Chuyển hướng nếu chưa đăng nhập
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
