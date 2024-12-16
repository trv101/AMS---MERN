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

import { useQuery, useMutation, useQueryClient } from "react-query";

import { toast } from "react-toastify";

import { deleteCourse } from "../../../api/courseEndPoints";
import { viewStudentCourseRelations } from "../../../api/studentCourseRelationEndPonts";
import { datagridStyles } from "../../../constants/styles";

const StudnetCourseRelationsList = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    error,
    data: courseList,
  } = useQuery("courseList", viewStudentCourseRelations);

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
      field: "firstName",
      headerName: "First Name",
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "last Name",
      flex: 1,
    },

    {
      field: "year",
      headerName: "Acedemic Yeare",
      flex: 1,
    },

    {
      field: "courseName",
      headerName: "Course Name",
      flex: 1,
    },
  ];
  let rows = content?.map((content) => ({
    id: `${content.studentID}-${content.courseID}`,
    firstName: content?.student?.user.firstName,
    lastName: content?.student?.user.lastName,
    year: content?.student?.year,
    courseName: content?.course?.courseName,
  }));

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport printOptions={{ disableToolbarButton: false }} />

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
      <AdminHeader
        title="Student Course Relations"
        subtitle="Manage Students Courses"
      />

      <Box m="40px 0 0 0" height="75vh" sx={datagridStyles}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRows = content.filter((row) =>
              selectedIDs.has(`${row.studentID}-${row.courseID}`)
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

export default StudnetCourseRelationsList;
