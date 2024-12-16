import { Routes, Route } from "react-router-dom";
import { StudentNavigation } from "../constants/naviagationMenuContent";

import "react-toastify/dist/ReactToastify.css";

import { ColorModeContext, useMode } from "../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Sidebar from "../layouts/SideBar";
import TopBar from "../layouts/TopBar";
import Dashboard from "../pages/restricted/dashboard";
import StudentUpcomingSessionList from "../pages/restricted/studentUpcomingSessionsList";

import StudentCourseRoleList from "../pages/restricted/StudentRoleCourseList";
import StudentAttendnaceList from "../pages/restricted/StudentAttendanceList";

function StudenRoutes() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar navigationItems={StudentNavigation} />
          <main className="content">
            <TopBar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/sessions"
                element={<StudentUpcomingSessionList />}
              />
              <Route path="/attendance" element={<StudentAttendnaceList />} />
              <Route path="/courses" element={<StudentCourseRoleList />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default StudenRoutes;
