import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/public/Signup";
import LoginPage from "./pages/public/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminRoutes from "./routes/AdminDashboardRoutes";
import Landing from "./pages/public/Landing";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import TeacherRoutes from "./routes/TeacherRoutes";
import StudenRoutes from "./routes/StudentRoutes";
import MarkAttendace from "./pages/restricted/attandanceValidationScreen";
function App() {
  const auth = useSelector((state) => state.auth);
  const { userInfo } = auth;
  return (
    <div>
      <Routes>
        <Route
          path="/admin/*"
          element={
            userInfo?.userData && userInfo.userData.user.isAdmin ? (
              <AdminRoutes />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/teacher/*"
          element={
            userInfo?.userData && userInfo.role === "TEACHER" ? (
              <TeacherRoutes />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/student/*"
          element={
            userInfo?.userData && userInfo.role === "STUDENT" ? (
              <StudenRoutes />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/attandance/:id"
          element={
            userInfo?.userData && userInfo.role === "STUDENT" ? (
              <MarkAttendace />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/" element={<Landing />} />
        <Route path="/attandce" element={<Landing />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login/admin" element={<LoginPage />} />
        <Route path="/login/student" element={<LoginPage />} />
        <Route path="/login/teacher" element={<LoginPage />} />
        <Route path="/*" element={<h1>Not found</h1>} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
