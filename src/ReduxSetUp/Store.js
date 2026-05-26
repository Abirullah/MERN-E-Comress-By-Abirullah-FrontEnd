import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Feature/Auth/AuthSlice";
import productsReducer from "./Feature/Products/ProductSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
