import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import DeleteOutline from "@mui/icons-material/DeleteOutline";

import AdminHeader from "../../../components/AdminHeader";
import { useState } from "react";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import { useNavigate } from "react-router-dom";

import { useQuery, useMutation, useQueryClient } from "react-query";

import { toast } from "react-toastify";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { deleteCourse, viewCourseList } from "../../../api/courseEndPoints";
import { datagridStyles } from "../../../constants/styles";

const CourseList = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const {
    isLoading,
    isError,
    error,
    data: courseList,
  } = useQuery("courseList", viewCourseList);

  const deleteMutation = useMutation(deleteCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries("facultyList");
      toast.success("Entry Removed!");
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

  const create = () => {
    navigate(`/admin/course/update`);
  };

  const remove = () => {
    if (window.confirm("Are you sure?")) {
      deleteMutation.mutate(selectedRows[0].facultyID);
    }
  };

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

        <Button className="p-0 pe-2" variant="text" onClick={() => create()}>
          <AddCircleOutlineIcon fontSize="small" />
          <span className="px-2">Create</span>
        </Button>

        {selectedRows.length === 1 && (
          <Button className="p-0 pe-2" variant="text" onClick={() => remove()}>
            <DeleteOutline fontSize="small" style={{ color: "red" }} />
            <span className="px-2" style={{ color: "red" }}>
              Remove
            </span>
          </Button>
        )}
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
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRows = content.filter((row) =>
              selectedIDs.has(row.courseID)
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

export default CourseList;
