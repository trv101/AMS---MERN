import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";

import AdminHeader from "../../../components/AdminHeader";
import { useMemo, useRef, useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { updateUserById } from "../../../api/userEndPoints";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { viewFacultyList } from "../../../api/facultyEndPoints";

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().required("required"),
  role: yup.string().required("required"),
  faculty: yup.string().required("required"),
  date: yup.date().required("required"),
  year: yup.number().when("role", {
    is: "STUDENT",
    then: yup.number().required("required"),
    otherwise: yup.number(),
  }),
});

const UserUpdateForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { state: userInfo } = useLocation();

  const [formic, setFormicState] = useState({});
  const [form, setForm] = useState({});

  const headerTextRef = useRef("");
  const headerSubRef = useRef("");

  const {
    isLoading,
    isError,
    error,
    data: facultyList,
  } = useQuery("facultyList", viewFacultyList);

  useMemo(() => {
    if (userInfo.teacherID) {
      headerTextRef.current = "TEACHER";
      headerSubRef.current = "Teacher";

      setForm({
        isApproved: userInfo.user.isApproved,
        isAdmin: userInfo.user.isAdmin,
      });
      setFormicState({
        firstName: userInfo.user.firstName,
        lastName: userInfo.user.lastName,
        email: userInfo.user.email,
        password: "",
        role: "TEACHER",
        year: userInfo?.year ?? "",
        faculty: userInfo.faculty.department,
        date: new Date(userInfo.hireDate),
      });
    } else if (userInfo.staffID) {
      headerTextRef.current = "STAFF";
      headerSubRef.current = "Staff";
      setForm({
        isApproved: userInfo.user.isApproved,
        isAdmin: userInfo.user.isAdmin,
      });
      setFormicState({
        firstName: userInfo.user.firstName,
        lastName: userInfo.user.lastName,
        email: userInfo.user.email,
        password: "",
        role: "NONAC",
        year: userInfo?.year ?? "",
        faculty: userInfo.faculty.department,
        date: new Date(userInfo.hireDate),
      });
    } else if (userInfo.studentID) {
      headerTextRef.current = "STUDENT";
      headerSubRef.current = "Student";
      setFormicState({
        firstName: userInfo.user.firstName,
        lastName: userInfo.user.lastName,
        email: userInfo.user.email,
        password: "",
        role: "STUDENT",
        year: userInfo?.year ?? "",
        faculty: userInfo.faculty.department,
        date: new Date(userInfo.enrollmentDate),
      });
    } else {
      headerTextRef.current = "USER";
      headerSubRef.current = "User";
      setFormicState({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        password: "",
        role:  "",
        year:  "",
        faculty:  "",
        date: "",
      });
    }
  }, [userInfo]);

  const updateUserMutation = useMutation(updateUserById, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data, variable) => {
      setLoading(false);

      toast.success("User Updated!");

      if (variable.role === "TEACHER") {
        navigate("/admin/teacherlist");
      } else if (variable.role === "STUDENT") {
        navigate("/admin/studentlist");
      } else {
        navigate("/admin/nonaclist");
      }
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err.response.data.message);
    },
  });

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (value) => {
    updateUserMutation.mutate({ ...value, ...form, userID: userInfo.userID });
  };

  const change = (e) => {
    let boolean = null;

    if (e.target.value === "on") {
      boolean = !form[e.target.id];
    }

    setForm((prevState) => ({
      ...prevState,
      [e.target.id ?? e.target.name]: boolean ?? e.target.value,
    }));
  };
  let faculties;
  if (isLoading || loading) {
    return <p>Loading</p>;
  } else if (isError) {
    return <p>{error.message}</p>;
  } else {
    faculties = facultyList;
  }

  return (
    <Box m="20px">
      <AdminHeader
        title={`UPDATE ${headerTextRef.current}`}
        subtitle={`Update ${headerSubRef.current} Profile`}
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
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helpertext={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onChange={handleChange}
                value={values.lastName}
                id="lastName"
                sx={{ gridColumn: "span 2" }}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onChange={handleChange}
                value={values.email}
                id="email"
                sx={{ gridColumn: "span 2" }}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />

              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onChange={handleChange}
                value={values.password}
                id="password"
                sx={{ gridColumn: "span 2" }}
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />

  

              <FormControl sx={{ gridColumn: "span 2" }} value="id">
                <InputLabel id="faculty" sx={{ gridColumn: "span 2" }} value="id">
                  Faculty
                </InputLabel>
                <Select
                  labelId="faculty"
                  id="faculty"
                  value={values.faculty}
                  label="Faculty"
                  name="faculty"
                  onChange={handleChange}
                  style={{ gridColumn: "span 2", backgroundColor: "#293040" }}
                  error={!!touched.faculty && !!errors.faculty}
                >
                  {faculties.map((item) => (
                    <MenuItem  key={item.department}  value={item.department}>{item.department}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Date Joined"
                onChange={handleChange}
                value={
                  values.date instanceof Date
                    ? values.date.toISOString().split("T")[0]
                    : values.date
                }
                id="date"
                sx={{ gridColumn: "span 2" }}
                error={!!touched.date && !!errors.date}
                helperText={touched.date && errors.date}
              />

              <FormControl sx={{ gridColumn: "span 2" }} value="id">
                <InputLabel id="role" sx={{ gridColumn: "span 2" }} value="id">
                  Role
                </InputLabel>
                <Select
                  labelId="role"
                  id="role"
                  value={values.role}
                  label="Role"
                  name="role"
                  onChange={handleChange}
                  style={{ gridColumn: "span 2", backgroundColor: "#293040" }}
                  error={!!touched.role && !!errors.role}
                >
                  <MenuItem value="STUDENT">Student</MenuItem>
                  <MenuItem value="TEACHER">Teacher</MenuItem>
                  <MenuItem value="NONAC">Non-Academic</MenuItem>
                </Select>
              </FormControl>

              {values.role === "STUDENT" && (
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
              )}

              <div style={{ gridColumn: "span 2", display: "flex" }}>
                <FormControlLabel
                  control={
                    <Switch
                      id="isApproved"
                      checked={form.isApproved}
                      color="warning"
                      onChange={change}
                    />
                  }
                  label="Approved Account"
                  labelPlacement="start"
                  sx={{ marginRight: "100px" }}
                />

                <FormControlLabel
                  label="Is an admin"
                  labelPlacement="start"
                  control={
                    <Switch
                      id="isAdmin"
                      checked={form.isAdmin}
                      color="warning"
                      onChange={change}
                    />
                  }
                />
              </div>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default UserUpdateForm;
