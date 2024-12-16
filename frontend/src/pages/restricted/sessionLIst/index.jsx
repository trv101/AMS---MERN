import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import DeleteOutline from "@mui/icons-material/DeleteOutline";

import AdminHeader from "../../../components/AdminHeader";
import { useRef, useState } from "react";
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

import { deleteSession, viewSessionList } from "../../../api/sessionEndPoints";

import Qrmodel from "../../../components/Qrmodel";
import QRCode from "qrcode";

import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { datagridStyles } from "../../../constants/styles";

const SessionList = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const qr = useRef("");

  const generateQR = async (text) => {
    try {
      qr.current = await QRCode.toDataURL(text);
    } catch (err) {
      console.error(err);
    }
  };

  const navigate = useNavigate();

  const {
    isLoading,
    isError,
    error,
    data: sessionlist,
  } = useQuery("sessionList", viewSessionList);

  const deleteMutation = useMutation(deleteSession, {
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
    content = sessionlist;
  }

  const create = () => {
    navigate(`/admin/session/update`);
  };

  const remove = () => {
    if (window.confirm("Are you sure?")) {
      deleteMutation.mutate(selectedRows[0].sessionID);
    }
  };

  const qrHandler = () => {
    console.log(window.location.href.split("/")[2]);
    generateQR(
      `http://${window.location.href.split("/")[2]}/student/attandance/${
        selectedRows[0].sessionID
      }`
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    date: new Date(content?.dateTime).toDateString(),
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

        <Button className="p-0 pe-2" variant="text" onClick={() => create()}>
          <AddCircleOutlineIcon fontSize="small" />
          <span className="px-2">Create</span>
        </Button>

        {selectedRows.length === 1 && (
          <Button
            className="p-0 pe-2"
            variant="text"
            onClick={() => qrHandler()}
          >
            <QrCodeScannerIcon fontSize="small" />
            <span className="px-2">Generate Session QR</span>
          </Button>
        )}

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
      <AdminHeader title="Session List" subtitle="Manage Sessions" />

      <Box m="40px 0 0 0" height="75vh" sx={datagridStyles}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRows = content.filter((row) =>
              selectedIDs.has(row.sessionID)
            );

            setSelectedRows(selectedRows);
          }}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Box>
      <Qrmodel
        onClick={qrHandler}
        qr={qr.current}
        open={open}
        handleClose={handleClose}
      />
    </Box>
  );
};

export default SessionList;
