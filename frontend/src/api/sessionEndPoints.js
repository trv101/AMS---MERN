import api from "./api.js";

export const viewSessionList =  () => {
  return api.get(`/api/session`);
};

export const viewUpcomingSessionListTeacher =  () => {
  return api.get(`/api/session/teacher`);
};

export const viewUpcomingSessionListStudent =  () => {
  return api.get(`/api/session/student`);
};
export const viewUpcomingSessionListTeacherAll =  () => {
  return api.get(`/api/session/teacher/all`);
};

export const viewUpcomingSessionListStudentAll =  () => {
  return api.get(`/api/session/student`);
};

export const createOrUpdateSession =  (session) => {

  if (session.sessionID) {
    return api.put(`/api/session/${session.sessionID}`, session);
  } else {
    return api.post(`/api/session`, session);
  }
};


export const viewStudentSessions =  ({queryKey}) => {
  
  return api.get(`/api/session/student/${queryKey[0].split("/")[1]}`);
};

export const deleteSession =  (id) => {
  return api.delete(`/api/session/${id}`);
};
