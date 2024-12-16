import api from "./api.js";

export const vieAttendanceList = async () => {
  return api.get(`/api/attendance`);
};

export const createOrUpdateAttendance = async (attendance) => {
  if (attendance.attendanceID) {
    return api.put(`/api/attendance/${attendance.attendanceID}`, attendance);
  } else {
    return api.post(`/api/attendance`, attendance);
  }
};

export const markAttendanceWithQR = async ({ queryKey }) => {
  return api.get(`/api/attendance/qr/${queryKey[1]}/${queryKey[2]}`);
};

export const getStudentAttendance = async ({ queryKey }) => {
  return api.get(`/api/attendance/student/${queryKey[0].split("/")[1]}`);
};

export const getAttendanceById = async (id) => {
  return api.get(`/api/attendance/${id}`);
};

export const updateAttendance = async (id) => {
  return api.put(`/api/attendance/${id}`);
};

export const deleteAttendance = async (id) => {
  return api.delete(`/api/attendance/${id[0]}/${id[1]}`);
};
