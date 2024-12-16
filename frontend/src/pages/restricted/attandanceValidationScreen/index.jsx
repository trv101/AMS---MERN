import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { markAttendanceWithQR } from "../../../api/attendanceEndPoints";
import { useParams } from "react-router-dom";

import { useQuery } from "react-query";

import { toast } from "react-toastify";

import { useSelector } from "react-redux";

const buttonStyle = {
  padding: "10px 20px",
  border: "2px solid #3498db",
  borderRadius: "5px",
  background: "#3498db",
  color: "#fff",
  textDecoration: "none",
  fontSize: "16px",
  cursor: "pointer",
};

const loadingStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  fontSize: "24px",
};

const MarkAttendance = () => {
  const auth = useSelector((state) => state.auth);
  const { userInfo } = auth;
  const { id } = useParams();

  const { isLoading, isError, error } = useQuery(
    ["markattendance", userInfo.userData.studentID, id],
    markAttendanceWithQR
  );

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <button style={buttonStyle}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          Go TO HOME
        </Link>
      </button>
    </div>
  );

  useEffect(() => {
    if (!isLoading && !isError) {
      toast.success("Attendance Recorded!");
    } else if (isError) {

      toast.error(error.response.data.message);
    }
  }, [isLoading, isError, error]);

  return (
    <>{isLoading ? <div style={loadingStyle}>Loading...</div> : content}</>
  );
};

export default MarkAttendance;
