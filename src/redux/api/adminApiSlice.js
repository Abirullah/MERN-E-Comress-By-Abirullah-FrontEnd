import { apiSlice } from "./apiSlice";
import { ADMIN_URL } from "../constants";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    logoutAdmin: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/logout`,
        method: "POST",
      }),
    }),
    getAdminUsers: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/users`,
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "AdminUsers", id: "LIST" },
              ...result.map((user) => ({ type: "AdminUsers", id: user._id })),
            ]
          : [{ type: "AdminUsers", id: "LIST" }],
    }),
    getAdminUserById: builder.query({
      query: (id) => ({
        url: `${ADMIN_URL}/users/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "AdminUsers", id }],
    }),
    activateUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/users/${id}/activate`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "AdminUsers", id },
        { type: "AdminUsers", id: "LIST" },
      ],
    }),
    deactivateUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/users/${id}/deactivate`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "AdminUsers", id },
        { type: "AdminUsers", id: "LIST" },
      ],
    }),
    createAdminProduct: builder.mutation({
      query: (body) => ({
        url: `${ADMIN_URL}/products`,
        method: "POST",
        body,
      }),
    }),
    updateAdminProduct: builder.mutation({
      query: ({ productId, body }) => ({
        url: `${ADMIN_URL}/products/${productId}`,
        method: "PUT",
        body,
      }),
    }),
    deleteAdminProduct: builder.mutation({
      query: (productId) => ({
        url: `${ADMIN_URL}/products/${productId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useLogoutAdminMutation,
  useGetAdminUsersQuery,
  useLazyGetAdminUserByIdQuery,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useCreateAdminProductMutation,
  useUpdateAdminProductMutation,
  useDeleteAdminProductMutation,
} = adminApiSlice;
