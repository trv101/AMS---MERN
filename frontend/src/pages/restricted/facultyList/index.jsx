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
import { deleteFaculty, viewFacultyList } from "../../../api/facultyEndPoints";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { datagridStyles } from "../../../constants/styles";

const FacultyList = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const {
    isLoading,
    isError,
    error,
    data: facultyList,
  } = useQuery("facultyList", viewFacultyList);

  const deleteMutation = useMutation(deleteFaculty, {
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
    content = facultyList;
  }

  const update = () => {
    console.log(selectedRows[0]);
    navigate(`/admin/faculty/update`, {
      state: { ...selectedRows[0] },
    });
  };

  const create = () => {
    console.log(selectedRows[0]);
    navigate(`/admin/faculty/update`);
  };

  const remove = () => {
    if (window.confirm("Are you sure?")) {
      deleteMutation.mutate(selectedRows[0].facultyID);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Faculty ID",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "facultyName",
      headerName: "Faculty Name",
      flex: 1,
    },
  ];

  let rows = content?.map((content) => ({
    id: content.facultyID,
    facultyName: content.department,
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
          <Button className="p-0 pe-2" variant="text" onClick={() => update()}>
            <DesignServices fontSize="small" />
            <span className="px-2">Update</span>
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
      <AdminHeader title="Faculty List" subtitle="Manage Faculties" />

      <Box m="40px 0 0 0" height="75vh" sx={datagridStyles}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRows = content.filter((row) =>
              selectedIDs.has(row.facultyID)
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

export default FacultyList;
