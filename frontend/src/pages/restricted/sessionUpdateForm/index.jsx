import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";

import AdminHeader from "../../../components/AdminHeader";
import { useMemo, useRef, useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";

import { createOrUpdateSession } from "../../../api/sessionEndPoints";
import { viewLocationList } from "../../../api/locationEndPoints";
import { viewCourseList } from "../../../api/courseEndPoints";

const checkoutSchema = yup.object().shape({
  courseID: yup.string().required("required"),
  dateTime: yup.string().required("required"),
  minutes: yup.number().required("required"),
  locationID: yup.string().required("required"),
});

const SessionUpdateForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { state: sessionInfo } = useLocation();

  const [formic, setFormicState] = useState({});

  const headerTextRef = useRef("");
  const headerSubRef = useRef("");

  const {
    isLoading,
    isError,
    error,
    data: locationlist,
  } = useQuery("locationList", viewLocationList);

  const {
    isLoading: courseIsLoading,
    isError: courseIsError,

    data: courseList,
  } = useQuery("courseList", viewCourseList);

  useMemo(() => {
    if (sessionInfo) {
      headerTextRef.current = "Update Session";
      headerSubRef.current = "Manage Session";
      let originalDate = new Date(sessionInfo.dateTime);

      // Adding 5.5 hours to the date
      originalDate.setHours(
        originalDate.getHours() + 5,
        originalDate.getMinutes() + 30
      );

      // Getting the ISO string with the adjusted time
      let adjustedISOString = originalDate.toISOString().slice(0, 16);

      setFormicState({
        courseID: sessionInfo.courseID,
        dateTime: sessionInfo.dateTime
          ? adjustedISOString
          : sessionInfo.dateTime,
        minutes: sessionInfo.minutes,
        locationID: sessionInfo.locationID,
      });
    } else {
      headerTextRef.current = "Create Session";
      headerSubRef.current = "Manage Session";
      setFormicState({
        courseID: "",
        dateTime: "",
        minutes: "",
        locationID: "",
      });
    }
  }, [sessionInfo]);

  const formMutation = useMutation(createOrUpdateSession, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data, variable) => {
      setLoading(false);

      toast.success("Update Success!");

      navigate("/admin/sessionslist");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err.response.data.message);
    },
  });

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (value) => {
    if (sessionInfo) {
      formMutation.mutate({
        ...value,
        sessionID: sessionInfo.sessionID,
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

  let locations;
  let courses;
  if (isLoading || loading || courseIsLoading) {
    return <p>Loading</p>;
  } else if (isError || courseIsError) {
    return <p>{error.message}</p>;
  } else {
    locations = locationlist;
    courses = courseList;
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
        enableReinitialize={true}
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
              <FormControl sx={{ gridColumn: "span 2" }} value="id">
                <InputLabel
                  id="courseID"
                  sx={{ gridColumn: "span 2" }}
                  value="id"
                >
                  Course Name
                </InputLabel>
                <Select
                  labelId="courseID"
                  id="courseID"
                  value={values.courseID}
                  label="Course Name"
                  name="courseID"
                  onChange={handleChange}
                  style={{ gridColumn: "span 2", backgroundColor: "#293040" }}
                  error={!!touched.courseID && !!errors.courseID}
                >
                  {courses.map((item) => (
                    <MenuItem key={item.courseID} value={item.courseID}>
                      {item.courseName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                variant="filled"
                type="datetime-local"
                label="Date and Time"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dateTime}
                name="dateTime"
                error={!!touched.dateTime && !!errors.dateTime}
                helperText={touched.dateTime && errors.dateTime}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Number of minutes"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.minutes}
                name="minutes"
                error={!!touched.minutes && !!errors.minutes}
                helperText={touched.minutes && errors.minutes}
                sx={{ gridColumn: "span 2" }}
              />

              {/* <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Location ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.locationID}
                name="locationID"
                error={!!touched.locationID && !!errors.locationID}
                helperText={touched.locationID && errors.locationID}
                sx={{ gridColumn: "span 2" }}
              /> */}

              <FormControl sx={{ gridColumn: "span 2" }} value="id">
                <InputLabel
                  id="locationID"
                  sx={{ gridColumn: "span 2" }}
                  value="id"
                >
                  Location Name
                </InputLabel>
                <Select
                  labelId="locationID"
                  id="locationID"
                  value={values.locationID}
                  label="Location Name"
                  name="locationID"
                  onChange={handleChange}
                  style={{ gridColumn: "span 2", backgroundColor: "#293040" }}
                  error={!!touched.locationID && !!errors.locationID}
                >
                  {locations.map((item) => (
                    <MenuItem key={item.locationID} value={item.locationID}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {sessionInfo ? "Update Session" : "Create Session"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default SessionUpdateForm;
