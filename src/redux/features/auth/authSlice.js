import { createSlice } from "@reduxjs/toolkit";

const USER_INFO_STORAGE_KEY = "userInfo";

const readStoredUserInfo = () => {
  try {
    const rawUserInfo = localStorage.getItem(USER_INFO_STORAGE_KEY);
    return rawUserInfo ? JSON.parse(rawUserInfo) : null;
  } catch {
    localStorage.removeItem(USER_INFO_STORAGE_KEY);
    return null;
  }
};

const initialState = {
  userInfo: readStoredUserInfo(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem(USER_INFO_STORAGE_KEY);
      localStorage.removeItem("expirationTime");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
