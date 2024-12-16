import api from "./api.js";

export const viewNotifcationCount = ({ queryKey }) => {
  return api.get(`/api/stats/notification/${queryKey[1]}`);
};

export const viewDashboardStats = ({ queryKey }) => {
  return api.get(`/api/stats/dashboard/${queryKey[1]}`);
};
