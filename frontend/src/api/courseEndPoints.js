import api from "./api.js";

export const viewCourseList = () => {
  return api.get(`/api/course`);
};

export const viewCourseListTeacher = () => {
  return api.get(`/api/course/teacher`);
};

export const createOrUpdateCourse = (faculty) => {
  if (faculty.facultyID) {
    return api.put(`/api/course/${faculty.facultyID}`, faculty);
  } else {
    return api.post(`/api/course`, faculty);
  }
};

export const deleteCourse = (id) => {
  return api.delete(`/api/course/${id}`);
};
