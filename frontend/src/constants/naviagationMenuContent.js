import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import EngineeringIcon from "@mui/icons-material/Engineering";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import JoinFullIcon from "@mui/icons-material/JoinFull";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import EditCalendarTwoToneIcon from "@mui/icons-material/EditCalendarTwoTone";

import BeenhereIcon from "@mui/icons-material/Beenhere";

export const navigationItems = [
  {
    title: "Dashboard",
    to: "/admin/",
    icon: <HomeOutlinedIcon />,
  },
  {
    title: "Manage Pending Users",
    to: "/admin/pendingusers",
    icon: <PersonAddAltIcon />,
  },

  {
    title: "Manage Teachers",
    to: "/admin/teacherlist",
    icon: <ConnectWithoutContactIcon />,
  },

  {
    title: "Manage Students",
    to: "/admin/studentlist",
    icon: <PsychologyAltIcon />,
  },

  {
    title: "Manage Staff",
    to: "/admin/nonaclist",
    icon: <EngineeringIcon />,
  },

  {
    title: "Manage Faculties",
    to: "/admin/facultylist",
    icon: <CorporateFareIcon />,
  },

  {
    title: "Manage Courses",
    to: "/admin/courselist",
    icon: <AutoStoriesIcon />,
  },

  {
    title: "Manage Locations",
    to: "/admin/locationlist",
    icon: <MyLocationIcon />,
  },

  {
    title: "Manage Sessions",
    to: "/admin/sessionslist",
    icon: <EditCalendarTwoToneIcon />,
  },

  {
    title: "Students Courses",
    to: "/admin/studnetcourse",
    icon: <JoinFullIcon />,
  },
];

export const teacherNavigation = [
  {
    title: "Dashboard",
    to: "/teacher/",
    icon: <HomeOutlinedIcon />,
  },

  // {
  //   title: "Upcoming Sessions List",
  //   to: "/teacher/sessions",
  //   icon: <MoveToInboxIcon />,
  // },

  {
    title: "My Sessions",
    to: "/teacher/sessionsall",
    icon: <EditCalendarTwoToneIcon />,
  },

  {
    title: "My Courses",
    to: "/teacher/courses",
    icon: <AutoStoriesIcon />,
  },
];

export const StudentNavigation = [
  {
    title: "Dashboard",
    to: "/student/",
    icon: <HomeOutlinedIcon />,
  },

  {
    title: "My Attendance",
    to: "/student/attendance",
    icon: <BeenhereIcon />,
  },

  {
    title: "My Courses",
    to: "/student/courses",
    icon: <AutoStoriesIcon />,
  },
];
