import { Routes, Route } from "react-router-dom";
import { teacherNavigation } from "../constants/naviagationMenuContent";

import "react-toastify/dist/ReactToastify.css";

import { ColorModeContext, useMode } from "../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Sidebar from "../layouts/SideBar";
import TopBar from "../layouts/TopBar";

import Dashboard from "../pages/restricted/dashboard";

import TeacherSessionList from "../pages/restricted/teacherAllSessions";
import TeacherUpcomingSessionList from "../pages/restricted/teacherUpcomingSessions";
import TeacherCourseList from "../pages/restricted/teacherCourseList";

function TeacherRoutes() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar navigationItems={teacherNavigation} />
          <main className="content">
            <TopBar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/sessions"
                element={<TeacherUpcomingSessionList />}
              />
              <Route path="/sessionsall" element={<TeacherSessionList />} />
              <Route path="/courses" element={<TeacherCourseList />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default TeacherRoutes;
