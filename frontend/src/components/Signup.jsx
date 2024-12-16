import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { signupFields } from "../constants/formFields";
import FormAction from "./FormActions";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../api/authEndPoints";
import { useNavigate } from "react-router-dom";
import { resetAuthState } from "../reducers/authSlice";

const fields = signupFields;
let fieldsState = {};

fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Signup() {
  const [signupState, setSignupState] = useState(fieldsState);
  const handleChange = (e) =>
    setSignupState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signupState.password !== signupState.confirmpassword) {
      toast.error("Password not matching!");
    } else {
      createAccount(signupState);
    }
  };

  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.auth);
  const { loading, error, success } = userRegister;
  const [errorCount, setErrorCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      setSignupState(fieldsState);
      toast.success("Account created!");
      dispatch(resetAuthState());
    }
  }, [navigate, success, dispatch]);

  useEffect(() => {
    if (error && errorCount === 0) {
      setSignupState(fieldsState);
      toast.error(error);
      setErrorCount(1);
      dispatch(resetAuthState());
    }
  }, [error, errorCount, dispatch]);

  const createAccount = async (signupState) => {
    setErrorCount(0);
    dispatch(register(signupState));
  };

  if (loading) {
    return (
      <>
        <h3>Loading...</h3>
      </>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={signupState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
        <FormAction handleSubmit={handleSubmit} text="Signup" />
      </div>
    </form>
  );
}
