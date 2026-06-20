import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "../../../Service/apiUtils";
import {
  createCheckoutSessionAPI,
  createProductReviewAPI,
  fetchProductByIdAPI,
  fetchProductsAPI,
  toggleWishlistAPI,
  fetchwishlist,
  fetchOrdersAPI,
} from "./ProductApi";

const buildRejectedPayload = (error, fallbackMessage) => ({
  message: getApiErrorMessage(error, fallbackMessage),
  status: error?.response?.status || 500,
});

const extractOrdersPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.docs)) {
    return payload.docs;
  }

  if (Array.isArray(payload?.orders)) {
    return payload.orders;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.docs)) {
    return payload.data.docs;
  }

  if (Array.isArray(payload?.data?.orders)) {
    return payload.data.orders;
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data;
  }

  if (Array.isArray(payload?.orders?.docs)) {
    return payload.orders.docs;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.result)) {
    return payload.result;
  }

  return [];
};

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  detailsLoading: false,
  wishlistLoading: false,
  reviewLoading: false,
  error: null,
  detailsError: null,
  wishlistMessage: null,
  wishlistitems: [],
  reviewError: null,
  reviewSuccessMessage: null,
  checkoutLoading: false,
  checkoutError: null,
  checkoutSession: null,
  orders: [],
  ordersLoading: false,
  ordersError: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      return await fetchProductsAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        buildRejectedPayload(error, "Products could not be loaded")
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "/products",
  async (productId, thunkAPI) => {
    try {
      return await fetchProductByIdAPI(productId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        buildRejectedPayload(error, "Product details could not be loaded")
      );
    }
  }
);

export const toggleProductWishlist = createAsyncThunk(
  "products/toggleProductWishlist",
  async (productId, thunkAPI) => {
    try {
      return await toggleWishlistAPI(productId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        buildRejectedPayload(error, "Wishlist update failed")
      );
    }
  }
);

export const createProductReview = createAsyncThunk(
  "products/createProductReview",
  async ({ productId, reviewData }, thunkAPI) => {
    try {
      return await createProductReviewAPI(productId, reviewData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        buildRejectedPayload(error, "Review could not be submitted")
      );
    }
  }
);

export const fetchWishlist = createAsyncThunk(
  "products/fetchWishlist",
  async (userId, thunkAPI) => {
    try {
      return await fetchwishlist(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        buildRejectedPayload(error, "Wishlist could not be loaded")
      );
    }
  }
);

export const createOrder = createAsyncThunk(
  "products/createOrder",
  async (orderData, thunkAPI) => {
    try {
      return await createCheckoutSessionAPI(orderData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        buildRejectedPayload(error, "Order could not be created")
      );
    }
  }
);

export const Orders = createAsyncThunk(
  "products/fetchOrders",
  async (userId, thunkAPI) => {
    try {
      return await fetchOrdersAPI(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        buildRejectedPayload(error, "Orders could not be loaded")
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductMessages: (state) => {
      state.error = null;
      state.detailsError = null;
      state.reviewError = null;
      state.reviewSuccessMessage = null;
      state.wishlistMessage = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.detailsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Products could not be loaded";
      })
      .addCase(fetchProductById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
        state.reviewSuccessMessage = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError =
          action.payload?.message || "Product details could not be loaded";
      })
      .addCase(toggleProductWishlist.pending, (state) => {
        state.wishlistLoading = true;
        state.wishlistMessage = null;
      })
      .addCase(toggleProductWishlist.fulfilled, (state, action) => {
        state.wishlistLoading = false;
        state.wishlistMessage =
          action.payload?.message || "Wishlist updated successfully";
      })
      .addCase(toggleProductWishlist.rejected, (state, action) => {
        state.wishlistLoading = false;
        state.error = action.payload?.message || "Wishlist update failed";
      })
      .addCase(createProductReview.pending, (state) => {
        state.reviewLoading = true;
        state.reviewError = null;
        state.reviewSuccessMessage = null;
      })
      .addCase(createProductReview.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.reviewSuccessMessage =
          action.payload?.message || "Review submitted successfully";
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.reviewError =
          action.payload?.message || "Review could not be submitted";
      })
      .addCase(fetchWishlist.pending, (state) => {
        state.wishlistLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlistLoading = false;
        state.wishlistitems = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.wishlistLoading = false;
        state.error = action.payload?.message || "Wishlist could not be loaded";
      })
      .addCase(createOrder.pending, (state) => {
        state.checkoutLoading = true;
        state.checkoutError = null;
        state.checkoutSession = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutSession = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutError =
          action.payload?.message || "Order could not be created";
      })
      .addCase(Orders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(Orders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = extractOrdersPayload(action.payload);
      })
      .addCase(Orders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError =
          action.payload?.message || "Orders could not be loaded";
      });

  },
});

export const { clearProductMessages, clearSelectedProduct } =
  productSlice.actions;

export default productSlice.reducer;
