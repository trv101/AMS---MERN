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

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import {
  deleteLocation,
  viewLocationList,
} from "../../../api/locationEndPoints";
import { datagridStyles } from "../../../constants/styles";

const LocationList = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const {
    isLoading,
    isError,
    error,
    data: courseList,
  } = useQuery("locationList", viewLocationList);

  const deleteMutation = useMutation(deleteLocation, {
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

  const update = () => {
    navigate(`/admin/location/update`, {
      state: { ...selectedRows[0] },
    });
  };

  const create = () => {
    navigate(`/admin/location/update`);
  };

  const remove = () => {
    if (window.confirm("Are you sure?")) {
      deleteMutation.mutate(selectedRows[0].locationID);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Location ID",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "locationName",
      headerName: "Location Name",
      flex: 1,
    },
    {
      field: "faculty",
      headerName: "Faculty",
      flex: 1,
    },
  ];

  let rows = content?.map((content) => ({
    id: content.locationID,
    locationName: content.name,
    faculty: content.faculty?.department,
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
      <AdminHeader title="Location List" subtitle="Manage Locations" />

      <Box m="40px 0 0 0" height="75vh" sx={datagridStyles}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRows = content.filter((row) =>
              selectedIDs.has(row.locationID)
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

export default LocationList;
