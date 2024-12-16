import {
  userLoginRequest,
  userLoginSuccess,
  userLoginFail,
  userRegisterRequest,
  userRegisterSuccess,
  userRegisterFail,
  userLogout,
} from "../reducers/authSlice";
import api from "./api";

export const login = (loginState, role) => async (dispatch) => {
  try {
    dispatch(userLoginRequest());

    const data = await api.post(`/api/users/login/${role}`, loginState);

    dispatch(userLoginSuccess(data));

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch(
      userLoginFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const logout = () => (dispatch) => {
  //   dispatch(userDetailsReset())

  localStorage.removeItem("userInfo");
  dispatch(userLogout());
};

export const register = (signupState) => async (dispatch) => {
  try {
    dispatch(userRegisterRequest());

    await api.post("/api/users", signupState);

    dispatch(userRegisterSuccess());
  } catch (error) {
    dispatch(
      userRegisterFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};
