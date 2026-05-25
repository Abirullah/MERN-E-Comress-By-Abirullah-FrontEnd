import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import WishlistPage from "./pages/User/WashingList.jsx";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";


import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import Otp from "./pages/Auth/OTP.jsx";
import Profile from "./pages/User/Profile.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop/Shop.jsx";
import LacosteProductPage from "./pages/Shop/ProductDetails.jsx";
import OrdersPlaced from "./pages/User/OrdersPlaced.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
        <Route index element={<Home />} /> 
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="otp" element={<Otp />} />
        <Route path = "washinglist" element= {<WishlistPage/>}/>
        <Route path="shop" element={<Shop />} />
        <Route path="products" element={<LacosteProductPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="ordersplaced" element={<OrdersPlaced/>}/>
    </Route>
  )
);

const store = configureStore({
  reducer: {
    // Add your reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
