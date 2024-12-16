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
import { useSelector } from "react-redux";

import { getStudentAttendance } from "../../../api/attendanceEndPoints";
import { datagridStyles } from "../../../constants/styles";

const StudentAttendnaceList = () => {
  const auth = useSelector((state) => state.auth);
  const { userInfo } = auth;

  const {
    isLoading,
    isError,
    error,
    data: courseList,
  } = useQuery(
    `locationList/${userInfo.userData.studentID}`,
    getStudentAttendance
  );

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
      field: "sessionId",
      headerName: "Session ID",
      flex: 1,
    },
    {
      field: "courseName",
      headerName: "Course Name",
      flex: 1,
    },
    {
      field: "courseId",
      headerName: "Course ID",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "time",
      headerName: "Time",
      flex: 1,
    },
  ];

  let rows = content?.map((content) => ({
    id: `${content.studentID}-${content.sessionID}`,
    sessionId: content.sessionID,
    courseName: content?.session?.course?.courseName,
    courseId: content?.session?.courseID,
    date: new Date(content?.session?.dateTime).toDateString(),
    time: new Date(content?.session?.dateTime)
      .toLocaleString()
      .substring(10, 25),
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
        title={`My attendance list`}
        subtitle="Manage Student Attendance"
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

export default StudentAttendnaceList;
