import React from "react";
import { Badge, Box, IconButton } from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { logout } from "../api/authEndPoints";
import { viewNotifcationCount } from "../api/statsEndPonts";

const TopBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { userInfo } = auth;

  let role = "";
  let redirecturl = "";
  if (userInfo.userData.user.isAdmin) {
    role = "admin";
    redirecturl = "/admin/pendingusers";
  } else if (userInfo.role === "STUDENT") {
    role = "student";
    redirecturl = "/student/sessions";
  } else if (userInfo.role === "TEACHER") {
    role = "teacher";
    redirecturl = "/teacher/sessions";
  }

  const {
    isLoading,
    isError,
    data: notification,
  } = useQuery(["notifcation", role], viewNotifcationCount);

  const signOutHandler = (e) => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Box display="flex" justifyContent="flex-end" pr={10} pt={2}>
      {/* ICONS */}
      <Box display="flex">
        {!isLoading && !isError && (
          <Link to={redirecturl}>
            <IconButton>
              <Badge
                badgeContent={notification && notification > 0 && notification}
                color="secondary"
              >
                <NotificationsOutlinedIcon />
              </Badge>
            </IconButton>
          </Link>
        )}

        <IconButton sx={{ marginLeft: "10px" }} onClick={signOutHandler}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopBar;
