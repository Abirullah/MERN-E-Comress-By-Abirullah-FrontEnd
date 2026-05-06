import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, USE_LOCAL_MOCK } from "../constants";
import { logout } from "../features/auth/authSlice";
import { mockBaseQuery } from "./mockBackend";

const networkBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

const baseQuery = async (args, api, extraOptions) => {
  const result = USE_LOCAL_MOCK
    ? await mockBaseQuery(args, api, extraOptions)
    : await networkBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Profile", "Product", "AdminUsers"],
  endpoints: () => ({}),
});
