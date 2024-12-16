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

import { createOrUpdateCourse } from "../../../api/courseEndPoints";
import { viewFacultyList } from "../../../api/facultyEndPoints";
import { viewTeacherList } from "../../../api/userEndPoints";

const checkoutSchema = yup.object().shape({
  courseName: yup.string().required("required"),
  year: yup.number().required("required"),
  teacherID: yup.string().required("required"),
  facultyName: yup.string().required("required"),
});

const CourseUpdateForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { state: courseInfo } = useLocation();

  const [formic, setFormicState] = useState({});

  const headerTextRef = useRef("");
  const headerSubRef = useRef("");

  const {
    isLoading: teachersIsLoading,
    isError: teacherIsError,
  
    data: teacherlist,
  } = useQuery("teacherList", viewTeacherList);

  const {
    isLoading,
    isError,
    error,
    data: facultyList,
  } = useQuery("facultyList", viewFacultyList);

  useMemo(() => {
    if (courseInfo) {
      headerTextRef.current = "Update Course";
      headerSubRef.current = "Manage Course";

      setFormicState({
        courseName: courseInfo.courseName,
        year: courseInfo.year,
        teacherID: courseInfo.teacherID,
        facultyName: courseInfo.faculty.department,
      });
    } else {
      headerTextRef.current = "Create Course";
      headerSubRef.current = "Manage Course";
      setFormicState({
        courseName: "",
        year: "",
        teacherID: "",
        facultyName: "",
      });
    }
  }, [courseInfo]);

  const formMutation = useMutation(createOrUpdateCourse, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data, variable) => {
      setLoading(false);

      toast.success("Update Success!");

      navigate("/admin/courselist");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err.response.data.message);
    },
  });

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (value) => {
    if (courseInfo) {
      formMutation.mutate({
        ...value,
        facultyID: courseInfo.courseID,
      });
    } else {
      formMutation.mutate({
        ...value,
      });
    }
  };

  let faculties;
  let teachers;
  if (isLoading || loading || teachersIsLoading) {
    return <p>Loading</p>;
  } else if (isError || teacherIsError) {
    return <p>{error.message}</p>;
  } else {
    faculties = facultyList;
    teachers = teacherlist;
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
                label="Course Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.courseName}
                name="courseName"
                error={!!touched.courseName && !!errors.courseName}
                helperText={touched.courseName && errors.courseName}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl sx={{ gridColumn: "span 2" }} value="id">
                <InputLabel
                  id="year"
                  sx={{ gridColumn: "span 2" }}
                  value="year"
                >
                  Year
                </InputLabel>
                <Select
                  labelId="Acedemic year"
                  id="year"
                  value={values.year}
                  label="Year"
                  name="year"
                  onChange={handleChange}
                  style={{ gridColumn: "span 2", backgroundColor: "#293040" }}
                  error={!!touched.year && !!errors.year}
                >
                  <MenuItem value="1">First Year</MenuItem>
                  <MenuItem value="2">Second Year</MenuItem>
                  <MenuItem value="3">Third Year</MenuItem>

                  <MenuItem value="4">Fourth Year</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ gridColumn: "span 2" }} value="id">
                <InputLabel
                  id="teacherID"
                  sx={{ gridColumn: "span 2" }}
                  value="id"
                >
                  Teacher Name
                </InputLabel>
                <Select
                  labelId="teacherID"
                  id="teacherID"
                  value={values.teacherID}
                  label="Teacher Name"
                  name="teacherID"
                  onChange={handleChange}
                  style={{ gridColumn: "span 2", backgroundColor: "#293040" }}
                  error={!!touched.teacherID && !!errors.teacherID}
                >
                  {teachers.map((item) => (
                    <MenuItem key={item.teacherID} value={item.teacherID}>
                      {`${item.user.firstName} ${item.user.lastName}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ gridColumn: "span 2" }} value="id">
                <InputLabel
                  id="faculty"
                  sx={{ gridColumn: "span 2" }}
                  value="id"
                >
                  Faculty
                </InputLabel>
                <Select
                  labelId="facultyName"
                  id="facultyName"
                  value={values.facultyName}
                  label="Faculty"
                  name="facultyName"
                  onChange={handleChange}
                  style={{ gridColumn: "span 2", backgroundColor: "#293040" }}
                  error={!!touched.facultyName && !!errors.facultyName}
                >
                  {faculties.map((item) => (
                    <MenuItem key={item.department} value={item.department}>
                      {item.department}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {courseInfo ? "Update Course" : "Create Course"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CourseUpdateForm;
