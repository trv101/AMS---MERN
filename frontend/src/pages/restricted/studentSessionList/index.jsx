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

import { useLocation } from "react-router-dom";

import { useQuery } from "react-query";

import { viewStudentSessions } from "../../../api/sessionEndPoints";
import { datagridStyles } from "../../../constants/styles";

const StudentSessionsList = () => {
  const { state: studentInfo } = useLocation();

  const {
    isLoading,
    isError,
    error,
    data: courseList,
  } = useQuery(`studentsessions/${studentInfo.studentID}`, viewStudentSessions);

  let content;
  if (isLoading) {
    return <p>Loading</p>;
  } else if (isError) {
    return <p>{error.message}</p>;
  } else {
    content = courseList;
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
      flex: 1,
    },
    {
      field: "year",
      headerName: "Academic Year",
      width: 100,
    },

    {
      field: "email",
      headerName: "Teacher Email",
      width: 200,
    },

    {
      field: "faculty",
      headerName: "Faculty",
      width: 150,
    },

    {
      field: "location",
      headerName: "Location Name",
      width: 100,
    },
  ];

  let rows = content?.map((content) => ({
    id: content?.sessionID,
    minutes: content.minutes,
    date: new Date(content?.dateTime).toDateString(),
    time: new Date(content?.dateTime).toLocaleString().substring(10, 25),

    courseName: content.course?.courseName,
    year: content.course?.year,

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
      <AdminHeader
        title={`Session Info of ${studentInfo.user.firstName} ${studentInfo.user.lastName}`}
        subtitle="Manage Student Sessions"
      />

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

export default StudentSessionsList;
