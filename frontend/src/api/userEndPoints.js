import api from "./api.js";

export const viewPendingUsers = () => {
  return api.get(`/api/users/unapproved`);
};

export const viewTeacherList = () => {
  console.log("ddddd");
  return api.get(`/api/users/teachers`);
};

export const viewStudentList = () => {
  return api.get(`/api/users/students`);
};

export const viewNonacList = () => {
  return api.get(`/api/users/staff`);
};

export const updateUserById = (user) => {
  console.log("user" + user.userID);
  return api.put(`/api/users/${user.userID}`, user);
};

export const deletePendingUser = (id) => {
  return api.delete(`/api/users/${id}`);
};
