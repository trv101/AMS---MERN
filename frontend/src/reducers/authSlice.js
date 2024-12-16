import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authReducer = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    // getOne
    userLoginRequest: (state) => {
      state.loading = true;
      state.error = false;
    },
    userLoginSuccess: (state, action) => {
      console.log("i am at reducer" + action.payload);
      state.loading = false;
      state.success = true;
      state.userInfo = action.payload;
    },
    userLoginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userRegisterRequest: (state) => {
      state.loading = true;
      state.error = false;
    },
    userRegisterSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    userRegisterFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userLogout: (state) => {
      state.userInfo = null;
      state.error = false;
    },
    resetAuthState: (state) => {
      state.success = false;
      state.loading = false;
      state.error = false;
    },
  },
});

export const {
  userLoginRequest,
  userLoginSuccess,
  userLoginFail,

  userRegisterRequest,
  userRegisterSuccess,
  userRegisterFail,
  userLogout,
  resetAuthState,
} = authReducer.actions;
export default authReducer.reducer;
