import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "../../../Service/Axios";
import {
  fetchProfileAPI,
  loginUserAPI,
  logoutUserAPI,
  registerUserAPI,
  updateProfileAPI,
} from "./AuthApi";

const USER_INFO_KEY = "userInfo";

const loadUserInfo = () => {
  try {
    const storedUserInfo = localStorage.getItem(USER_INFO_KEY);
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
  } catch {
    localStorage.removeItem(USER_INFO_KEY);
    return null;
  }
};

const persistUserInfo = (userInfo) => {
  if (userInfo) {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    return;
  }

  localStorage.removeItem(USER_INFO_KEY);
};

const buildRejectedPayload = (error, fallbackMessage) => ({
  message: getApiErrorMessage(error, fallbackMessage),
  status: error?.response?.status || 500,
});

const userInfo = loadUserInfo();

const initialState = {
  userInfo,
  loading: false,
  profileLoading: false,
  updateLoading: false,
  logoutLoading: false,
  error: null,
  profileError: null,
  successMessage: null,
  sessionChecked: !userInfo,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const data = await loginUserAPI(credentials);
      persistUserInfo(data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        buildRejectedPayload(error, "Login failed")
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const data = await registerUserAPI(userData);
      persistUserInfo(data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        buildRejectedPayload(error, "Registration failed")
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const data = await fetchProfileAPI();
      persistUserInfo(data);
      return data;
    } catch (error) {
      if (error?.response?.status === 401) {
        persistUserInfo(null);
      }

      return thunkAPI.rejectWithValue(
        buildRejectedPayload(error, "Profile could not be loaded")
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (profileData, thunkAPI) => {
    try {
      const data = await updateProfileAPI(profileData);
      persistUserInfo(data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        buildRejectedPayload(error, "Profile update failed")
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await logoutUserAPI();
      persistUserInfo(null);
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        buildRejectedPayload(error, "Logout failed")
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthMessages: (state) => {
      state.error = null;
      state.profileError = null;
      state.successMessage = null;
    },
    clearCredentials: (state) => {
      state.userInfo = null;
      state.sessionChecked = true;
      state.error = null;
      state.profileError = null;
      state.successMessage = null;
      persistUserInfo(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.sessionChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.sessionChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.userInfo = action.payload;
        state.sessionChecked = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError =
          action.payload?.message || "Profile could not be loaded";
        state.sessionChecked = true;

        if (action.payload?.status === 401) {
          state.userInfo = null;
        }
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.profileError = null;
        state.successMessage = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.userInfo = action.payload;
        state.successMessage = "Profile updated successfully";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.profileError =
          action.payload?.message || "Profile update failed";
      })
      .addCase(logoutUser.pending, (state) => {
        state.logoutLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutLoading = false;
        state.userInfo = null;
        state.sessionChecked = true;
        state.successMessage = null;
        state.profileError = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutLoading = false;
        state.error = action.payload?.message || "Logout failed";
      });
  },
});

export const { clearAuthMessages, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
