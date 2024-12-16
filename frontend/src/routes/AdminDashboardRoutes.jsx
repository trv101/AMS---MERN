import { Routes, Route } from "react-router-dom";
import { navigationItems } from "../constants/naviagationMenuContent";

import "react-toastify/dist/ReactToastify.css";

import { ColorModeContext, useMode } from "../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Sidebar from "../layouts/SideBar";
import TopBar from "../layouts/TopBar";
import PendingUserList from "../pages/restricted/pendingUserList";
import UserUpdateForm from "../pages/restricted/userUpdateForm";
import TeacherList from "../pages/restricted/teacherList";
import StudentList from "../pages/restricted/studentList";
import StaffList from "../pages/restricted/staffList";
import ListFaculties from "../pages/restricted/facultyList";
import FacultyUpdateForm from "../pages/restricted/facultyUpdateForm";
import CourseList from "../pages/restricted/courseList";
import CourseUpdateForm from "../pages/restricted/courseUpdateForm";
import StudnetCourseRelationsList from "../pages/restricted/studnetCourseRelationsList";
import LocationList from "../pages/restricted/locationList";
import LocationUpdateForm from "../pages/restricted/locationUpdateForm";
import SessionList from "../pages/restricted/sessionLIst";
import SessionUpdateForm from "../pages/restricted/sessionUpdateForm";
import AttendnaceList from "../pages/restricted/attendanceList";
import AttendanceUpdateForm from "../pages/restricted/attendanceUpdateForm";
import StudentCourseList from "../pages/restricted/studentCourseList";
import StudentSessionsList from "../pages/restricted/studentSessionList";
import Dashboard from "../pages/restricted/dashboard";

function AdminRoutes() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar navigationItems={navigationItems} />
          <main className="content">
            <TopBar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pendingusers" element={<PendingUserList />} />
              <Route path="/teacherlist" element={<TeacherList />} />
              <Route path="/studentlist" element={<StudentList />} />
              <Route path="/nonaclist" element={<StaffList />} />
              <Route path="/facultylist" element={<ListFaculties />} />
              <Route path="/courselist" element={<CourseList />} />
              <Route
                path="/studnetcourse"
                element={<StudnetCourseRelationsList />}
              />
              <Route path="/locationlist" element={<LocationList />} />
              <Route path="/sessionslist" element={<SessionList />} />
              <Route
                path="/studentattendancelist"
                element={<AttendnaceList />}
              />
              <Route
                path="/studentcourselist"
                element={<StudentCourseList />}
              />
              <Route
                path="/studentsessionlist"
                element={<StudentSessionsList />}
              />

              <Route path="/users/update" element={<UserUpdateForm />} />
              <Route path="/faculty/update" element={<FacultyUpdateForm />} />
              <Route path="/course/update" element={<CourseUpdateForm />} />
              <Route path="/location/update" element={<LocationUpdateForm />} />
              <Route path="/session/update" element={<SessionUpdateForm />} />
              <Route
                path="/attendance/update/:id"
                element={<AttendanceUpdateForm />}
              />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default AdminRoutes;
