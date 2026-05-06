import { apiSlice } from "./apiSlice";
import { PRODUCTS_URL } from "../constants";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL,
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Product", id: "LIST" },
              ...result.map((product) => ({
                type: "Product",
                id: product._id,
              })),
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    toggleWishlist: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}/wishlist`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    createReview: builder.mutation({
      query: ({ productId, ...body }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Product", id: productId },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useToggleWishlistMutation,
  useCreateReviewMutation,
} = productsApiSlice;
