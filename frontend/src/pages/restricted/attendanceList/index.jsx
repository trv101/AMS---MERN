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

import { useNavigate, useLocation } from "react-router-dom";

import { useQuery, useMutation, useQueryClient } from "react-query";

import { toast } from "react-toastify";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import {
  deleteAttendance,
  getStudentAttendance,
} from "../../../api/attendanceEndPoints";
import { datagridStyles } from "../../../constants/styles";

const AttendnaceList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const { state: studentInfo } = useLocation();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const {
    isLoading,
    isError,
    error,
    data: courseList,
  } = useQuery(`locationList/${studentInfo.studentID}`, getStudentAttendance);

  const deleteMutation = useMutation(deleteAttendance, {
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
    navigate(`/admin/attendance/update/${studentInfo.studentID}`);
  };

  const remove = () => {
    if (window.confirm("Are you sure?")) {
      deleteMutation.mutate([
        selectedRows[0].studentID,
        selectedRows[0].sessionID,
      ]);
    }
  };

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
      <AdminHeader
        title={`Attendance List of  ${studentInfo.user.firstName} ${studentInfo.user.lastName}`}
        subtitle="Manage Student Attendance"
      />

      <Box m="40px 0 0 0" height="75vh" sx={datagridStyles}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRows = content.filter((row) =>
              selectedIDs.has(`${row.studentID}-${row.sessionID}`)
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

export default AttendnaceList;
