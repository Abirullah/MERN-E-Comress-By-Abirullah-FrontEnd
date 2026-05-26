import API from "../../../Service/Axios";

export const loginUserAPI = async (credentials) => {
  const response = await API.post("/users/login", credentials);
  return response.data;
};

export const registerUserAPI = async (userData) => {
  const response = await API.post("/users/register", userData);
  return response.data;
};

export const fetchProfileAPI = async () => {
  const response = await API.get("/users/profile");
  return response.data;
};

export const updateProfileAPI = async (profileData) => {
  const response = await API.put("/users/profile", profileData);
  return response.data;
};

export const logoutUserAPI = async () => {
  const response = await API.post("/users/logout");
  return response.data;
};
