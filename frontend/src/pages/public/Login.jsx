import React from "react";
import Header from "../../components/Header";
import Login from "../../components/Login";
import { useLocation } from "react-router-dom";
const LoginPage = () => {
  const { pathname } = useLocation();

  let role = "";

  if (pathname.split("/")[2] === "admin") {
    role = "an Admin";
  } else if (pathname.split("/")[2] === "teacher") {
    role = "a Teacher";
  } else {
    role = "a Student";
  }

  return (
    <>
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Header
            heading={ `Login in as  ${role}`}
            paragraph="Don't have an account yet? "
            linkName="Signup"
            linkUrl="/signup"
          />
          <Login />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
