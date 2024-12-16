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

import { viewCourseListTeacher } from "../../../api/courseEndPoints";
import { datagridStyles } from "../../../constants/styles";

const TeacherCourseList = () => {
  const {
    isLoading,
    isError,
    error,
    data: courseList,
  } = useQuery("courseList", viewCourseListTeacher);

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
      cellClassName: "name-column--cell",
    },

    {
      field: "courseName",
      headerName: "Course Name",
      flex: 1,
    },
    {
      field: "courseYear",
      headerName: "Acedemic Year",
      flex: 1,
    },

    {
      field: "facultyName",
      headerName: "Faculty Name",
      flex: 1,
    },

    {
      field: "techerFirstName",
      headerName: "Teacher First Name",
      flex: 1,
    },

    {
      field: "teacherLastName",
      headerName: "Teacher Last Name",
      flex: 1,
    },
  ];

  let rows = content?.map((content) => ({
    id: content.courseID,
    courseName: content.courseName,
    facultyName: content.faculty?.department,
    courseYear: content.year,
    techerFirstName: content.teacher?.user.firstName,
    teacherLastName: content.teacher?.user.lastName,
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
      <AdminHeader title="Course List" subtitle="Manage Courses" />

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

export default TeacherCourseList;
