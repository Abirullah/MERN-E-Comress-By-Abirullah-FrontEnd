import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "../../../Service/Axios";
import {
  createProductReviewAPI,
  fetchProductByIdAPI,
  fetchProductsAPI,
  toggleWishlistAPI,
  fetchwishlist,
} from "./ProductApi";

const buildRejectedPayload = (error, fallbackMessage) => ({
  message: getApiErrorMessage(error, fallbackMessage),
  status: error?.response?.status || 500,
});

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
  async (_, thunkAPI) => {
    try {
      return await fetchwishlist();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        buildRejectedPayload(error, "Wishlist could not be loaded")
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
      }); 
  },
});

export const { clearProductMessages, clearSelectedProduct } =
  productSlice.actions;

export default productSlice.reducer;
