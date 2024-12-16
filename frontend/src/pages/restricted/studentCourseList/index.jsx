import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import AdminHeader from "../../../components/AdminHeader";
import { useState } from "react";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import { useLocation } from "react-router-dom";

import { useQuery, useMutation, useQueryClient } from "react-query";

import { toast } from "react-toastify";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import {
  viewStudentCourseRelationsforSingleStudent,
  createOrDeleteRelation,
} from "../../../api/studentCourseRelationEndPonts";
import { datagridStyles } from "../../../constants/styles";

const StudentCourseList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const { state: studentInfo } = useLocation();

  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    error,
    data: courseList,
  } = useQuery(
    `studentcourses/${studentInfo.studentID}`,
    viewStudentCourseRelationsforSingleStudent
  );

  const mutation = useMutation(createOrDeleteRelation, {
    onSuccess: () => {
      queryClient.invalidateQueries("facultyList");
      toast.success("Success!");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      console.log(error);
    },
  });

  let content;
  if (isLoading) {
    return <p>Loading</p>;
  } else if (isError) {
    return <p>{error.message}</p>;
  } else {
    content = courseList;
  }

  const enroll = () => {
    if (window.confirm("Are you sure?")) {
      mutation.mutate({
        studentID: studentInfo.studentID,
        courseID: selectedRows[0].item.courseID,
        entroll: true,
      });
    }
  };

  const enlist = () => {
    if (window.confirm("Are you sure?")) {
      mutation.mutate({
        studentID: studentInfo.studentID,
        courseID: selectedRows[0].item.courseID,
        enroll: true,
      });
    }
  };
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

        {selectedRows.length === 1 && selectedRows[0]?.following === false && (
          <Button className="p-0 pe-2" variant="text" onClick={() => enroll()}>
            <AddCircleOutlineIcon
              fontSize="small"
              style={{ color: "skyblue" }}
            />
            <span className="px-2" style={{ color: "skyblue" }}>
              Enroll Student
            </span>
          </Button>
        )}

        {selectedRows.length === 1 && selectedRows[0]?.following === true && (
          <Button className="p-0 pe-2" variant="text" onClick={() => enlist()}>
            <AddCircleOutlineIcon fontSize="small" style={{ color: "red" }} />
            <span className="px-2" style={{ color: "red" }}>
              Enlist Student
            </span>
          </Button>
        )}
      </GridToolbarContainer>
    );
  };

  return (
    <Box m="20px">
      <AdminHeader
        title={`Course Info of ${studentInfo.user.firstName} ${studentInfo.user.lastName}`}
        subtitle="Manage Student Courses"
      />

      <Box m="40px 0 0 0" height="75vh" sx={datagridStyles}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRows = content.filter((row) =>
              selectedIDs.has(row.item.courseID)
            );

            setSelectedRows(selectedRows);
          }}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default StudentCourseList;
