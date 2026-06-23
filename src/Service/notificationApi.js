import API from "./Axios";

export const fetchNotificationsAPI = async ({ page = 1, limit = 20 } = {}) => {
  const response = await API.get("/users/notifications", {
    params: { page, limit },
  });

  return response.data;
};

export const markNotificationAsReadAPI = async (id) => {
  const response = await API.patch(`/users/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsReadAPI = async () => {
  const response = await API.patch("/users/notifications/read-all");
  return response.data;
};
