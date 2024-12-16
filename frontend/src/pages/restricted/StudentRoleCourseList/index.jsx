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

import { viewStudentCourseRelationsforSingleStudent } from "../../../api/studentCourseRelationEndPonts";
import { useSelector } from "react-redux";
import { datagridStyles } from "../../../constants/styles";

const StudentCourseRoleList = () => {
  const auth = useSelector((state) => state.auth);
  const { userInfo } = auth;

  const {
    isLoading,
    isError,
    error,
    data: courseList,
  } = useQuery(
    `studentcourses/${userInfo.userData.studentID}`,
    viewStudentCourseRelationsforSingleStudent
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
      field: "id",
      headerName: "Course ID",
      flex: 1,
    },
    {
      field: "courseName",
      headerName: "Course Name",
      flex: 1,
    },
    {
      field: "department",
      headerName: "Faculty",
      flex: 1,
    },
    {
      field: "year",
      headerName: "Academic Year",
      flex: 1,
    },
    {
      field: "isFollowing",
      headerName: "Enrollment Status",
      flex: 1,
    },
  ];

  let rows = content?.map((content) => ({
    id: content?.item?.courseID,

    courseName: content?.item?.courseName,
    department: content?.item?.faculty.department,
    year: content?.item?.year,
    isFollowing: content?.following,
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
      <AdminHeader title={`My Course Info`} subtitle="Manage Student Courses" />

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

export default StudentCourseRoleList;
