import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import AdminHeader from "../../../components/AdminHeader";

import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import { useQuery } from "react-query";

import { viewUpcomingSessionListTeacher } from "../../../api/sessionEndPoints";
import { datagridStyles } from "../../../constants/styles";

const TeacherUpcomingSessionList = () => {
  const {
    isLoading,
    isError,
    error,
    data: sessionlist,
  } = useQuery("sessionListTeacher", viewUpcomingSessionListTeacher);

  let content;
  if (isLoading) {
    return <p>Loading</p>;
  } else if (isError) {
    return <p>{error.message}</p>;
  } else {
    content = sessionlist;
  }

  const columns = [
    {
      field: "id",
      headerName: "Session ID",
      width: 250,
      cellClassName: "name-column--cell",
    },
    {
      field: "minutes",
      headerName: "Minutes",
      width: 60,
    },
    {
      field: "date",
      headerName: "Date",
      width: 150,
    },
    {
      field: "time",
      headerName: "Time",
      width: 100,
    },
    {
      field: "courseName",
      headerName: "Course Name",
      width: 250,
    },
    {
      field: "year",
      headerName: "Academic Year",
      width: 100,
    },
    {
      field: "teacherFirstName",
      headerName: "Teacher First Name",
      width: 120,
    },
    {
      field: "teacherSecondName",
      headerName: "Teacher Second Name",
      width: 120,
    },
    {
      field: "email",
      headerName: "Teacher Email",
      width: 200,
    },
    {
      field: "location",
      headerName: "Location Name",
      width: 100,
    },
    {
      field: "faculty",
      headerName: "Faculty",
      width: 150,
    },
  ];

  let rows = content?.map((content) => ({
    id: content?.sessionID,
    minutes: content.minutes,
    date: content?.dateTime
      ? new Intl.DateTimeFormat("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(content.dateTime))
      : "",

    time: new Date(content?.dateTime).toLocaleString().substring(10, 25),

    courseName: content.course?.courseName,
    year: content.course?.year,
    teacherFirstName: content.course?.teacher?.user?.firstName,
    teacherSecondName: content.course?.teacher?.user?.lastName,
    email: content.course?.teacher?.user?.email,
    location: content?.session_location?.name,
    faculty: content?.session_location?.faculty.department,
  }));

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport printOptions={{ disableToolbarButton: false }} />
      </GridToolbarContainer>
    );
  };

  return (
    <Box m="20px">
      <AdminHeader title="Upcoming Session List" subtitle="Manage Sessions" />

      <Box m="40px 0 0 0" height="75vh" sx={datagridStyles}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default TeacherUpcomingSessionList;
