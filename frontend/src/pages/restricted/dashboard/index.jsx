import { Box, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import StatBox from "../../../components/StatBox";

import AdminHeader from "../../../components/AdminHeader";
import { useSelector } from "react-redux";

import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";

import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { viewDashboardStats } from "../../../api/statsEndPonts";
import { useQuery } from "react-query";

import EditCalendarTwoToneIcon from "@mui/icons-material/EditCalendarTwoTone";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const auth = useSelector((state) => state.auth);
  const { userInfo } = auth;

  let headertext = "";
  let role = "";

  if (userInfo.userData.user.isAdmin) {
    role = "admin";
    headertext = "ADMIN";
  } else if (userInfo.role === "STUDENT") {
    role = "student";
  } else if (userInfo.role === "TEACHER") {
    role = "teacher";
    headertext = "TEACHER";
  } else {
    headertext = userInfo.role;
  }

  const {
    isLoading,
    isError,
    error,
    data: stats,
  } = useQuery(["adminstats", role], viewDashboardStats);

  let content;
  if (isLoading) {
    return <p>Loading</p>;
  } else if (isError) {
    return <p>{error.message}</p>;
  } else {
    content = stats;
  }

  console.log(content);
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <AdminHeader
          subtitle={`WELCOME TO THE ${headertext} DASHBOARD`}
          title={`Hi, ${userInfo.userData.user.firstName} ${userInfo.userData.user.lastName}!`}
        />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}

        {userInfo.role === "TEACHER" && (
          <>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={content.courseCount}
                subtitle="Number of Courses"
                icon={
                  <AutoStoriesIcon
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
                title={content.sessionCount}
                subtitle="Number of upcoming sessions"
                icon={
                  <EditCalendarTwoToneIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
          </>
        )}

        {userInfo.role === "STUDENT" && (
          <>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={content.coursesCount}
                subtitle="Number of Courses"
                icon={
                  <AutoStoriesIcon
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
                title={content.sessionCount}
                subtitle="Number of upcoming sessions"
                icon={
                  <EditCalendarTwoToneIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
          </>
        )}

        {userInfo.userData.user.isAdmin && (
          <>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={content.studentCount}
                subtitle="Number of Students"
                icon={
                  <PsychologyAltIcon
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
                title={content.teacherCount}
                subtitle="Number of Teachers"
                icon={
                  <ConnectWithoutContactIcon
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
                title={content.facultyCount}
                subtitle="Number of Faculties"
                icon={
                  <CorporateFareIcon
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
                title={content.courseCount}
                subtitle="Number of Courses"
                icon={
                  <AutoStoriesIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
