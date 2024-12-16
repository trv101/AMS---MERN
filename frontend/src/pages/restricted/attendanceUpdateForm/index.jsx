import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Switch from "@mui/material/Switch";
import AdminHeader from "../../../components/AdminHeader";
import { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate, useLocation } from "react-router-dom";

import { useMutation } from "react-query";
import { toast } from "react-toastify";

import { createOrUpdateAttendance } from "../../../api/attendanceEndPoints";

const checkoutSchema = yup.object().shape({
  studentID: yup.string().required("required"),
  sessionID: yup.string().required("required"),
});

const AttendanceUpdateForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPresent, setIsPresent] = useState(false);
  const location = useLocation();

  const [formic] = useState({
    studentID: location.pathname.split("/")[4],
    sessionID: "",
  });

  const change = () => {
    setIsPresent((prevState) => !prevState);
  };

  const formMutation = useMutation(createOrUpdateAttendance, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data, variable) => {
      setLoading(false);

      toast.success("Update Success!");

      navigate("/admin/studentattendancelist");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err.response.data.message);
    },
  });

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (value) => {
    formMutation.mutate({
      ...value,
      isPresent,
    });
  };

  if (loading) {
    return <h1>Loading....</h1>;
  }

  return (
    <Box m="20px">
      <AdminHeader
        title=" Create Attendance Record"
        subtitle="Manage Attendance"
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={formic}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Student ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.studentID}
                name="studentID"
                error={!!touched.studentID && !!errors.studentID}
                helperText={touched.studentID && errors.studentID}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Session ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.sessionID}
                name="sessionID"
                error={!!touched.sessionID && !!errors.sessionID}
                helperText={touched.sessionID && errors.sessionID}
                sx={{ gridColumn: "span 2" }}
              />

              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <FormControlLabel
                  label="Is Present"
                  labelPlacement="start"
                  control={
                    <Switch
                      id="isAdmin"
                      checked={isPresent}
                      color="warning"
                      onChange={change}
                    />
                  }
                />
              </div>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Attendance
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AttendanceUpdateForm;
