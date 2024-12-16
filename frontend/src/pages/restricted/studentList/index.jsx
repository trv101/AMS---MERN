import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import DeleteOutline from "@mui/icons-material/DeleteOutline";
import DesignServices from "@mui/icons-material/DesignServices";

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
import { deletePendingUser, viewStudentList } from "../../../api/userEndPoints";

import BeenhereIcon from "@mui/icons-material/Beenhere";

import AutoStoriesIcon from "@mui/icons-material/AutoStories";

import EditCalendarTwoToneIcon from "@mui/icons-material/EditCalendarTwoTone";
import { datagridStyles } from "../../../constants/styles";

const StudentList = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const {
    isLoading,
    isError,
    error,
    data: userlist,
  } = useQuery("studentlist", viewStudentList);
  console.log(userlist);

  const deleteMutation = useMutation(deletePendingUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("pendingUserList");
      toast.success("User Removed!");
      //   navigate('/admin/outmaterial')
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
    content = userlist;
  }

  const updateUser = () => {
    console.log(selectedRows[0]);
    navigate(`/admin/users/update`, {
      state: { ...selectedRows[0] },
    });
  };

  const viewAttendance = () => {
    navigate(`/admin/studentattendancelist`, {
      state: { ...selectedRows[0] },
    });
  };

  const manageCourses = () => {
    navigate(`/admin/studentcourselist`, {
      state: { ...selectedRows[0] },
    });
  };

  const viewSessions = () => {
    navigate(`/admin/studentsessionlist`, {
      state: { ...selectedRows[0] },
    });
  };

  const removeUser = () => {
    if (window.confirm("Are you sure?")) {
      deleteMutation.mutate(selectedRows[0].userID);
    }
  };

  const columns = [
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
    },

    {
      field: "email",
      headerName: "Email",
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
      field: "hiredate",
      headerName: "Date Joined",
      flex: 1,
    },

    {
      field: "isApproved",
      headerName: "Account Approval",
      flex: 1,
    },

    {
      field: "isAdmin",
      headerName: "Admin Access",
      flex: 1,
    },
  ];

  let rows = content?.map((content, key) => ({
    id: content.studentID,
    userID: content.user.userID,
    firstName: content.user.firstName,
    lastName: content.user.lastName,
    email: content.user.email,
    isApproved: content.user.isApproved,
    isAdmin: content.user.isAdmin,
    hiredate: content.enrollmentDate.slice(0, 10),
    faculty: content.faculty.facultyID,
    department: content.faculty.department,
    year: content.year,
  }));

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport printOptions={{ disableToolbarButton: false }} />

        {selectedRows.length === 1 && (
          <Button
            className="p-0 pe-2"
            variant="text"
            onClick={() => updateUser()}
          >
            <DesignServices fontSize="small" />
            <span className="px-2">Update User Profile</span>
          </Button>
        )}

        {selectedRows.length === 1 && (
          <Button
            className="p-0 pe-2"
            variant="text"
            onClick={() => viewAttendance()}
          >
            <BeenhereIcon fontSize="small" />
            <span className="px-2">View Attendance</span>
          </Button>
        )}

        {selectedRows.length === 1 && (
          <Button
            className="p-0 pe-2"
            variant="text"
            onClick={() => manageCourses()}
          >
            <AutoStoriesIcon fontSize="small" />
            <span className="px-2">Manage Courses</span>
          </Button>
        )}

        {selectedRows.length === 1 && (
          <Button
            className="p-0 pe-2"
            variant="text"
            onClick={() => viewSessions()}
          >
            <EditCalendarTwoToneIcon fontSize="small" />
            <span className="px-2">View Sessions</span>
          </Button>
        )}
        {selectedRows.length === 1 && (
          <Button
            className="p-0 pe-2"
            variant="text"
            onClick={() => removeUser()}
          >
            <DeleteOutline fontSize="small" style={{ color: "red" }} />
            <span className="px-2" style={{ color: "red" }}>
              Remove User
            </span>
          </Button>
        )}
      </GridToolbarContainer>
    );
  };

  return (
    <Box m="20px">
      <AdminHeader title="Student List" subtitle="Manage Students" />

      <Box m="40px 0 0 0" height="75vh" sx={datagridStyles}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRows = content.filter((row) =>
              selectedIDs.has(row.studentID)
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

export default StudentList;
