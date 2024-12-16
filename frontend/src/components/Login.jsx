import { useEffect, useState } from "react";
import { loginFields } from "../constants/formFields";
import FormAction from "./FormActions";
import Input from "./Input";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../api/authEndPoints";

const fields = loginFields;

let fieldsState = {};

fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Login() {
  const [loginState, setLoginState] = useState(fieldsState);
  const [errorCount, setErrorCount] = useState(0);
  const { pathname } = useLocation();

  const handleChange = (e) => {
    setLoginState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser(loginState);
  };

  const auth = useSelector((state) => state.auth);
  const { loading, error, userInfo } = auth;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      if (userInfo.userData.user.isAdmin) {
        navigate("/admin");
      } else if (userInfo.role === "STUDENT") {
        navigate("/student");
      } else if (userInfo.role === "TEACHER") {
        navigate("/teacher");
      }
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    if (error && errorCount === 0) {
      toast.error(error);
      setErrorCount(1);
    }
  }, [error, errorCount]);

  if (loading) {
    return <h3>Loading........</h3>;
  }

  //Handle Login API Integration here
  const authenticateUser = (loginState) => {
    setErrorCount(0);

    if (pathname.split("/")[2] === "admin") {
      console.log("ddd");
      dispatch(login(loginState, "NONAC"));
    } else if (pathname.split("/")[2] === "student") {
      dispatch(login(loginState, "STUDENT"));
    } else if (pathname.split("/")[2] === "teacher") {
      dispatch(login(loginState, "TEACHER"));
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={loginState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
      </div>

      <FormAction handleSubmit={handleSubmit} text="Login" />
    </form>
  );
}
