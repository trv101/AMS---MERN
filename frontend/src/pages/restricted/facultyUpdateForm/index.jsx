import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";

import AdminHeader from "../../../components/AdminHeader";
import { useMemo, useRef, useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createOrUpdate } from "../../../api/facultyEndPoints";

const checkoutSchema = yup.object().shape({
  department: yup.string().required("required"),
});

const FacultyUpdateForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { state: facultyInfo } = useLocation();

  const [formic, setFormicState] = useState({});

  const headerTextRef = useRef("");
  const headerSubRef = useRef("");

  useMemo(() => {
    if (facultyInfo) {
      headerTextRef.current = "Update Faculty";
      headerSubRef.current = "Manage Faculties";

      setFormicState({
        department: facultyInfo.department,
      });
    } else {
      headerTextRef.current = "Create Faculty";
      headerSubRef.current = "Manage Faculties";
      setFormicState({
        department: "",
      });
    }
  }, [facultyInfo]);

  const formMutation = useMutation(createOrUpdate, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data, variable) => {
      setLoading(false);

      toast.success("Update Success!");

      navigate("/admin/facultylist");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err.response.data.message);
    },
  });

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (value) => {
    if (facultyInfo) {
      formMutation.mutate({
        ...value,
        facultyID: facultyInfo.facultyID,
      });
    } else {
      formMutation.mutate({
        ...value,
      });
    }
  };

  if (loading) {
    return <h1>Loading....</h1>;
  }

  return (
    <Box m="20px">
      <AdminHeader
        title={` ${headerTextRef.current}`}
        subtitle={` ${headerSubRef.current}`}
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
                label="Department"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.department}
                name="department"
                error={!!touched.department && !!errors.department}
                helperText={touched.department && errors.department}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {facultyInfo ? "Update Faculty" : "Create Faculty"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default FacultyUpdateForm;
