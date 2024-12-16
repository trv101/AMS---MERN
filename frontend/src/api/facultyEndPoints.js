import api from "./api.js";

export const viewFacultyList = () => {
  return api.get(`/api/faculty`);
};

export const createOrUpdate = (faculty) => {
  console.log("faculty");
  if (faculty.facultyID) {
    return api.put(`/api/faculty/${faculty.facultyID}`, faculty);
  } else {
    return api.post(`/api/faculty`, faculty);
  }

  //
};

export const getFacultyById = (id) => {
  return api.get(`/api/faculty/${id}`);
};

export const updateFaculty = (id) => {
  return api.put(`/api/faculty/${id}`);
};

export const deleteFaculty = (id) => {
  return api.delete(`/api/faculty/${id}`);
};
